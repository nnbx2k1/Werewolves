const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['login_alert', 'security_alert']
    },
    message: {
        type: String,
        required: true
    },
    location: {
        ip: String,
        city: String,
        country: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', notificationSchema); 