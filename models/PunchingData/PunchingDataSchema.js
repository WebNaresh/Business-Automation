const mongoose = require("mongoose");

const PunchingDataSchema = new mongoose.Schema(
  {
    EmployeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    punchingData: [
      {
        notificationCount: {
          type: Number,
          default: 0
        },
        MaNotificationCount: {
          type: Number,
          default: 0
        },
        HrNotificationCount: {
          type: Number,
          default: 0
        },
        recordDate: {
          type: Date,
          required: true,
        },
        punchInTime: {
          type: Date,
        },
        punchOutTime: {
          type: Date,
        },
        totalHours: {
          type: String,
        },
        status: {
          type: String,
        },
        justify: {
          type: String,
        },
        leave: {
          type: String,
        },
        shift: {
          type: String,
        },

        overtimeHours: {
          type: Number,
        },
        approvedId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Employee",
          default: null,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const PunchingDataModal = mongoose.model("PunchingData", PunchingDataSchema);
module.exports = { PunchingDataModal };
