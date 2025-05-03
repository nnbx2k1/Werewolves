const NotificationService = require('../services/notification.service');

const notificationController = {
    async getUserNotifications(req, res) {
        try {
            const notifications = await NotificationService.getUserNotifications(req.user._id);
            res.json(notifications);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching notifications', error: error.message });
        }
    },

    async markAsRead(req, res) {
        try {
            const notification = await NotificationService.markAsRead(req.params.notificationId);
            if (!notification) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            res.json(notification);
        } catch (error) {
            res.status(500).json({ message: 'Error marking notification as read', error: error.message });
        }
    }
};

module.exports = notificationController; 