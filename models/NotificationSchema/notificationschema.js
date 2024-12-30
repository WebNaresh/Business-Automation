const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    category: { type: String, required: true },
    message: { type: String, required: true },
    isSeen: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const NotificationModel = mongoose.model('Notification', notificationSchema);

module.exports = NotificationModel;
