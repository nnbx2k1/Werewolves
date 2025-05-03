const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      // Document actions
      'document_upload',
      'document_view',
      'document_download',
      'document_delete',
      'document_persistence_update',
      'document_access_update',
      
      // Signature actions
      'signature_add',
      'signature_created',
      'signature_status_updated',
      
      // User actions
      'user_register',
      'login',
      'user_login',
      'logout',
      'authentification_acess',
      'banker_api_access',
      
      // Conversation actions
      'conversation_create',
      'conversation_incognito_on',
      'conversation_incognito_off',
      
      // Message actions
      'message_send'
    ],
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  resourceType: {
    type: String,
    required: true,
    enum: [
      'document',
      'signature',
      'user',
      'conversation',
      'message',
      'other'
    ],
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: String,
  userAgent: String,
  deviceInfo: {
    type: Object,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  hash: String,
  previousEntryHash: String,
});

// Add indexes for common queries
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ resourceId: 1, resourceType: 1 });

// ✅ This prevents OverwriteModelError
module.exports = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
