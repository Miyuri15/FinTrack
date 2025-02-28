const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },  // Track read status
}, { timestamps: true }); // Added timestamps to track notification creation time

module.exports = mongoose.model('Notification', NotificationSchema);
