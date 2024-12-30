const { default: mongoose } = require("mongoose");

const AdvanceSalarySchema = new mongoose.Schema(
  {
    notificationCount: {
      type: Number,
      default: 0
    },
    advanceSalaryStartingDate: {
      type: Date,
      required: true,
    },
    noOfMonth: {
      type: Number,
      required: true,
    },
    advanceSalaryEndingDate: {
      type: Date,
      required: true,
    },
    advancedSalaryAmounts: {
      type: Number,
      required: true,
    },
    totalSalary: {
      type: Number,
      required: true,
    },
    file: {
      type: String,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    approvalIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Ongoing", "Rejected"],
      default: "Pending",
    },
    acceptRejectNotificationCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const AdvanceSalaryModel = mongoose.model("advancesalary", AdvanceSalarySchema);

module.exports = { AdvanceSalaryModel };
