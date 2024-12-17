const mongoose = require("mongoose");

const selectedShift = new mongoose.Schema(
  {
    notificationCount: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    managerId: {
      type: mongoose.Types.ObjectId,
    },
    accountantId: {
      type: mongoose.Types.ObjectId,
    },
    messageM: {
      type: String,
      default: "",
    },
    messageA: {
      type: String,
      default: "",
    },
    status: {
      type: String,
    },
    approveRejectNotificationCount: {
      type: Number,
      default: 0
    },
    accNotificationCount: {
      type: Number,
      default: 0
    },
    accountantStatus: {
      type: String,
    },
    employeeId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Employee",
    },
  },
  { timestamps: true }
);

const SelectedShiftModel = mongoose.model("selectedShift", selectedShift);
module.exports = { SelectedShiftModel };
