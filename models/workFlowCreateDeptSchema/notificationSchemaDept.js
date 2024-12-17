const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },

  isRead: {
    type: Boolean,
    default: false,
  },
});

const NotificationModel = mongoose.model(
  "NotificationDept",
  NotificationSchema
);
module.exports = { NotificationModel };
