const express = require('express');
const auth = require("../../middleware/Auth");
const { sendNotification, getNotifications, markAsSeen } = require('../../controller/NotificationController/notificationcontroller');
const router = express.Router();

// Send a notification
router
    .route("/organization/:organizationId/notification/send")
    .post(auth, sendNotification);

// Get notifications for a user
router
    .route("/organization/:organizationId/notification")
    .get(auth, getNotifications);

// Mark a notification as seen
router.route("/organization/:organizationId/notification/:id")
    .put(auth, markAsSeen);

module.exports = router;
