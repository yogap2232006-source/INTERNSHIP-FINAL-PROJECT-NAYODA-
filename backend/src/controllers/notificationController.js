const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
};

const markAsRead = async (req, res) => {
    const notification = await Notification.findById(req.params.id);
    if (notification) {
        if (notification.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        notification.isRead = true;
        await notification.save();
        res.json({ message: 'Marked as read' });
    } else {
        res.status(404).json({ message: 'Notification not found' });
    }
};

const createNotification = async (req, res) => {
    try {
        const { user, message } = req.body;
        const notification = await Notification.create({
            user,
            message,
            isRead: false
        });
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getNotifications, markAsRead, createNotification };
