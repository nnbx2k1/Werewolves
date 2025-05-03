const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const Document = require('../models/document.model');
const { uploadsDir } = require('../config');

// Encryption configuration
const algorithm = 'aes-256-cbc';
const keyLength = 32; // 256 bits

// Generate a random encryption key and IV
const generateKeyAndIV = () => {
    const key = crypto.randomBytes(keyLength);
    const iv = crypto.randomBytes(16);
    return { key, iv };
};

// Encrypt file
const encryptFile = (fileBuffer, key, iv) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(fileBuffer);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted;
};

// Decrypt file
const decryptFile = (encryptedBuffer, key, iv) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted;
};

exports.uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { receiverId, bankerId, message } = req.body;
        if (!receiverId || !bankerId || !message) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Generate encryption key and IV
        const { key, iv } = generateKeyAndIV();

        // Read the uploaded file
        const fileBuffer = fs.readFileSync(req.file.path);

        // Encrypt the file
        const encryptedBuffer = encryptFile(fileBuffer, key, iv);

        // Save encrypted file
        const encryptedFilename = `${Date.now()}-${req.file.originalname}.enc`;
        const encryptedPath = path.join(uploadsDir, encryptedFilename);
        fs.writeFileSync(encryptedPath, encryptedBuffer);

        // Remove original file
        fs.unlinkSync(req.file.path);

        // Create document record
        const document = new Document({
            filename: encryptedFilename,
            originalName: req.file.originalname,
            path: encryptedPath,
            sender: req.user._id,
            receiver: receiverId,
            banker: bankerId,
            encryptionKey: key.toString('hex'),
            iv: iv.toString('hex'),
            message: message,
            accessList: [req.user._id, receiverId, bankerId]
        });

        await document.save();

        res.status(201).json({
            message: 'Document uploaded and encrypted successfully',
            documentId: document._id
        });
    } catch (error) {
        console.error('Error uploading document:', error);
        res.status(500).json({ message: 'Error uploading document' });
    }
};

exports.getDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Check if user has access
        if (!document.accessList.includes(req.user._id)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Read encrypted file
        const encryptedBuffer = fs.readFileSync(document.path);

        // Convert hex strings back to buffers
        const key = Buffer.from(document.encryptionKey, 'hex');
        const iv = Buffer.from(document.iv, 'hex');

        // Decrypt file
        const decryptedBuffer = decryptFile(encryptedBuffer, key, iv);

        // Send file
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename=${document.originalName}`);
        res.send(decryptedBuffer);
    } catch (error) {
        console.error('Error retrieving document:', error);
        res.status(500).json({ message: 'Error retrieving document' });
    }
};
