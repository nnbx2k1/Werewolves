const crypto = require('crypto');

// Generate a random encryption key
const ENCRYPTION_KEY = crypto.randomBytes(32);
const IV_LENGTH = 16;

// Encrypt a message
async function encryptMessage(message) {
  try {
    if (!message) return null;
    
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    
    let encrypted = cipher.update(JSON.stringify(message), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      iv: iv.toString('hex'),
      encryptedData: encrypted
    };
  } catch (error) {
    console.error('Error encrypting message:', error);
    throw error;
  }
}

// Decrypt a message
async function decryptMessage(encryptedMessage) {
  try {
    if (!encryptedMessage || !encryptedMessage.iv || !encryptedMessage.encryptedData) {
      return null;
    }
    
    const iv = Buffer.from(encryptedMessage.iv, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    
    let decrypted = decipher.update(encryptedMessage.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Error decrypting message:', error);
    throw new Error('Failed to decrypt message');
  }
}

module.exports = {
  encryptMessage,
  decryptMessage
};
