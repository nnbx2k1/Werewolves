const Notification = require('../models/notification.model');
const axios = require('axios');

class NotificationService {
    static async createLoginAlert(userId, ipAddress) {
        try {
            // Get location information from IP
            const locationInfo = await this.getLocationFromIP(ipAddress);
            
            const notification = new Notification({
                userId,
                type: 'login_alert',
                message: `New login detected from ${locationInfo.city}, ${locationInfo.country}`,
                location: {
                    ip: ipAddress,
                    city: locationInfo.city,
                    country: locationInfo.country,
                    coordinates: {
                        latitude: locationInfo.latitude,
                        longitude: locationInfo.longitude
                    }
                }
            });

            await notification.save();
            return notification;
        } catch (error) {
            console.error('Error creating login alert:', error);
            throw error;
        }
    }

    static async getLocationFromIP(ipAddress) {
        try {
            // Using ipapi.co for IP geolocation (free tier)
            const response = await axios.get(`https://ipapi.co/${ipAddress}/json/`);
            return {
                city: response.data.city,
                country: response.data.country_name,
                latitude: response.data.latitude,
                longitude: response.data.longitude
            };
        } catch (error) {
            console.error('Error getting location from IP:', error);
            return {
                city: 'Unknown',
                country: 'Unknown',
                latitude: 0,
                longitude: 0
            };
        }
    }

    static async getUserNotifications(userId) {
        try {
            return await Notification.find({ userId })
                .sort({ createdAt: -1 })
                .limit(50);
        } catch (error) {
            console.error('Error getting user notifications:', error);
            throw error;
        }
    }

    static async markAsRead(notificationId) {
        try {
            return await Notification.findByIdAndUpdate(
                notificationId,
                { isRead: true },
                { new: true }
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }
}

module.exports = NotificationService; 