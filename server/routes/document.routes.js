const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadsDir } = require('../config');
const { authMiddleware } = require('../middleware/auth.middleware');
const documentController = require('../controllers/document.controller');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Upload document
router.post('/upload', 
    authMiddleware, 
    upload.single('file'), 
    documentController.uploadDocument
);

// Get document
router.get('/:id', 
    authMiddleware, 
    documentController.getDocument
);

module.exports = router;
