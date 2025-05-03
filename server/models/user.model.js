const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['client', 'banker'],
    required: true
  },
  phoneNumber: {
    type: String
  },
  profilePicture: {
    type: String
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.passwordHash);
};

// Static method to hash password
userSchema.statics.hashPassword = async function(password) {
  return await bcrypt.hash(password, 10);
};

module.exports = mongoose.model('User', userSchema);
