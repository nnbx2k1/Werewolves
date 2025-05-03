const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const signatureSchema = new Schema(
  {
    document: {
      type: Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    signatureData: {
      type: String,
      required: true,
    },
    signatureType: {
      type: String,
      enum: ['electronic', 'digital', 'hand-drawn'],
      default: 'electronic',
    },
    position: {
      page: {
        type: Number,
        required: true,
      },
      x: {
        type: Number,
        required: true,
      },
      y: {
        type: Number,
        required: true,
      },
      width: {
        type: Number,
        default: 200,
      },
      height: {
        type: Number,
        default: 80,
      },
    },
    certificate: {
      issuer: String,
      validFrom: Date,
      validTo: Date,
      serialNumber: String,
    },
    metadata: {
      ipAddress: String,
      userAgent: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
      geoLocation: {
        latitude: Number,
        longitude: Number,
      },
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationData: {
      hash: String,
      timestamp: Date,
      algorithm: {
        type: String,
        default: 'SHA-256',
      },
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'rejected', 'expired'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

signatureSchema.index({ document: 1, user: 1 });
signatureSchema.index({ status: 1 });

const Signature = mongoose.model('Signature', signatureSchema);

module.exports = Signature;