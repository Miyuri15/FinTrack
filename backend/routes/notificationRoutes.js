const express = require('express');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Fetch notifications for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching notifications' });
    }
});

// Mark notification as read
router.put('/:id/read', authMiddleware, async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: 'Error updating notification' });
    }
});

// Delete a notification
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Notification.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        res.json({ message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting notification' });
    }
});

module.exports = router;