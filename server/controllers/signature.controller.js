const Signature = require('../models/signature.model');
const Document = require('../models/document.model');
const { createAuditLog } = require('../services/audit.service');
const crypto = require('crypto');

// Create a new signature
exports.createSignature = async (req, res, next) => {
  try {
    const { 
      documentId, 
      signatureData, 
      signatureType, 
      position, 
      certificate 
    } = req.body;

    // Verify document exists and user has permission to sign
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user has permission to sign the document
    // Logic will depend on your permission system
    
    // Create signature hash for verification
    const signatureHash = crypto
      .createHash('sha256')
      .update(signatureData + Date.now().toString())
      .digest('hex');
    
    // Get IP and user agent for metadata
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Create new signature
    const signature = new Signature({
      document: documentId,
      user: req.user._id,
      signatureData,
      signatureType: signatureType || 'electronic',
      position,
      certificate,
      metadata: {
        ipAddress,
        userAgent,
        timestamp: new Date(),
      },
      verificationData: {
        hash: signatureHash,
        timestamp: new Date(),
        algorithm: 'SHA-256',
      },
    });

    await signature.save();

    // Log signature creation
    await createAuditLog(
      req,
      req.user._id,
      'signature_created',
      signature._id,
      'signature'
    );

    res.status(201).json({
      message: 'Signature created successfully',
      signature,
    });
  } catch (error) {
    next(error);
  }
};

// Get all signatures for a document
exports.getDocumentSignatures = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    
    const signatures = await Signature.find({ document: documentId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(signatures);
  } catch (error) {
    next(error);
  }
};

// Get all signatures by a user
exports.getUserSignatures = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user._id;
    
    const signatures = await Signature.find({ user: userId })
      .populate('document', 'filename metadata')
      .sort({ createdAt: -1 });
    
    res.json(signatures);
  } catch (error) {
    next(error);
  }
};

// Verify a signature
exports.verifySignature = async (req, res, next) => {
  try {
    const { signatureId } = req.params;
    
    const signature = await Signature.findById(signatureId);
    if (!signature) {
      return res.status(404).json({ message: 'Signature not found' });
    }

    // Here you would implement your verification logic
    // This could involve checking against a blockchain, a certificate authority, etc.
    const isVerified = true; // Replace with actual verification
    
    signature.verified = isVerified;
    await signature.save();

    // Log verification
    await createAuditLog(
      req,
      req.user._id,
      'signature_verified',
      signature._id,
      'signature'
    );

    res.json({
      message: 'Signature verification completed',
      verified: isVerified,
      signature,
    });
  } catch (error) {
    next(error);
  }
};

// Update signature status
exports.updateSignatureStatus = async (req, res, next) => {
  try {
    const { signatureId } = req.params;
    const { status } = req.body;
    
    const signature = await Signature.findById(signatureId);
    if (!signature) {
      return res.status(404).json({ message: 'Signature not found' });
    }

    // Validate status transition
    const validStatusTransitions = {
      pending: ['completed', 'rejected', 'expired'],
      completed: ['expired'],
      rejected: ['pending'],
      expired: [],
    };

    if (!validStatusTransitions[signature.status].includes(status)) {
      return res.status(400).json({ 
        message: `Cannot transition from ${signature.status} to ${status}` 
      });
    }

    signature.status = status;
    await signature.save();

    // Log status update
    await createAuditLog(
      req,
      req.user._id,
      'signature_status_updated',
      signature._id,
      'signature'
    );

    res.json({
      message: 'Signature status updated',
      signature,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a signature (often just marking as deleted rather than actual removal)
exports.deleteSignature = async (req, res, next) => {
  try {
    const { signatureId } = req.params;
    
    const signature = await Signature.findById(signatureId);
    if (!signature) {
      return res.status(404).json({ message: 'Signature not found' });
    }

    // Check if user has permission to delete the signature
    if (signature.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized to delete this signature' });
    }

    // In many cases, especially for legal documents, you might want to mark as deleted
    // rather than actually removing the record
    signature.status = 'rejected';
    await signature.save();

    // For actual deletion, uncomment:
    // await Signature.findByIdAndDelete(signatureId);

    // Log deletion
    await createAuditLog(
      req,
      req.user._id,
      'signature_deleted',
      signature._id,
      'signature'
    );

    res.json({ message: 'Signature deleted successfully' });
  } catch (error) {
    next(error);
  }
};