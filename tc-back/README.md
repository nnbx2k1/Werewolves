# Werewolves - Secure Messaging Platform

A secure, real-time messaging platform with end-to-end encryption and advanced security features.

## Features

- Real-time messaging with Socket.IO
- End-to-end message encryption
- User authentication and authorization
- Document sharing and management
- Digital signature support
- Real-time notifications
- Rate limiting and security measures
- Audit logging

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/nnbx2k1/Werewolves.git
cd werewolves/server
```

2. Install dependencies:
```bash
# Install all dependencies
npm install

# Or install specific packages:
npm install express mongoose cors socket.io helmet compression morgan express-rate-limit express-validator jsonwebtoken bcrypt multer dotenv uuid axios
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/werewolves
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
ENCRYPTION_KEY=your-encryption-key
```

4. Start the server:
```bash
# Development mode
npm start

# Production mode
npm run production
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Conversations
- `GET /api/conversations` - Get all conversations for user
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/:id` - Get conversation by ID
- `GET /api/conversations/:id/messages` - Get messages for conversation
- `PATCH /api/conversations/:id/incognito` - Toggle incognito mode

### Messages
- `GET /api/messages/:conversationId` - Get messages for a conversation
- `GET /api/messages/message/:id` - Get a single message
- `DELETE /api/messages/:messageId` - Delete a message

### Documents
- `GET /api/documents` - Get user documents
- `POST /api/documents` - Upload new document
- `GET /api/documents/:id` - Get document details

### Signatures
- `POST /api/signatures` - Create new signature
- `GET /api/signatures` - Get user signatures
- `GET /api/signatures/:id` - Get signature details

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read

### Backpack
- `GET /api/backpack` - Get user backpack items
- `POST /api/backpack` - Add item to backpack
- `DELETE /api/backpack/:id` - Remove item from backpack

## Project Structure

```
server/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
├── uploads/         # File uploads
├── config.js        # Main configuration
├── server.js        # Main server file
└── package.json     # Project dependencies
```

## Security Features

- Helmet for security headers
- Rate limiting
- CORS protection
- JWT authentication
- End-to-end encryption
- Input validation
- Audit logging