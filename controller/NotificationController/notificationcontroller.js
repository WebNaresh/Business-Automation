const catchAsyncError = require("../../middleware/catchAssyncError");
const Notification = require('../../models/NotificationSchema/notificationschema');

// Send a notification
exports.sendNotification = catchAsyncError(async (req, res) => {
    const { senderId, receiverId, category, message } = req.body;
    try {
        const notification = new Notification({
            senderId,
            receiverId,
            category,
            message
        });
        await notification.save();

        // Emit to specific user via socket
        req.app.get('io').to(receiverId.toString()).emit('receiveNotification', notification);

        res.status(201).json(notification);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get notifications for a user
exports.getNotifications = catchAsyncError(async (req, res) => {
    const { userId, category } = req.query;
    try {
        const query = { receiverId: userId };
        if (category) query.category = category;

        const notifications = await Notification.find(query).sort({ createdAt: -1 });

        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark a notification as seen
exports.markAsSeen = catchAsyncError(async (req, res) => {
    const { id } = req.params;
    try {
        const notification = await Notification.findByIdAndUpdate(
            id,
            { isSeen: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json(notification);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
