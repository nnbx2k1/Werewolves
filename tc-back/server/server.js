const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/error.middleware');
const { apiLimiter } = require('./middleware/rateLimit.middleware');
const authRoutes = require('./routes/auth.routes');
const conversationRoutes = require('./routes/conversation.routes');
const documentRoutes = require('./routes/document.routes');
const signatureRoutes = require('./routes/signature.routes');
const notificationRoutes = require('./routes/notification.routes');
const { authMiddleware } = require('./middleware/auth.middleware');
const NotificationService = require('./services/notification.service');
const { setupSocketHandlers } = require('./services/socket.service');
const jwt = require('jsonwebtoken');
const config = require('./config');
const messageRoutes = require('./routes/message.routes');
const Message = require('./models/message.model');
const Conversation = require('./models/conversation.model');
const { encryptMessage, decryptMessage } = require('./services/encryption.service');
const { createAuditLog } = require('./services/audit.service');

const app = express();
const server = http.createServer(app);

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
    origin: '*', // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());
app.use(morgan('combined'));

// Rate limiting
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/conversations', authMiddleware, conversationRoutes);
app.use('/api/documents', authMiddleware, documentRoutes);
app.use('/api/signatures', authMiddleware, signatureRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);
app.use('/api/messages', messageRoutes);

// Error handling
app.use(errorHandler);

// Socket.IO setup with security
const io = socketIo(server, {
    cors: {
        origin: '*', // Allow all origins in development
        methods: ['GET', 'POST'],
        credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
});

// Initialize socket handlers
setupSocketHandlers(io);

// Make io accessible to routes
app.set('io', io);

// Add notification middleware to track logins
app.use((req, res, next) => {
  if (req.user && req.path === '/api/auth/login') {
    const ipAddress = req.ip || req.connection.remoteAddress;
    NotificationService.createLoginAlert(req.user._id, ipAddress)
      .then(notification => {
        io.to(`user_${req.user._id}`).emit('notification', notification);
      })
      .catch(error => console.error('Error creating login notification:', error));
  }
  next();
});

// Database connection with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/secure-banking-messenger', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      retryWrites: true,
      retryReads: true
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
  setTimeout(connectDB, 5000);
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

connectDB();

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});