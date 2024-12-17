const { default: mongoose } = require("mongoose");

const LoanManagementSchema = new mongoose.Schema(
  {
    notificationCount: {
      type: Number,
      default: 0
    },
    acceptRejectNotificationCount: {
      type: Number,
      default: 0
    },
    loanType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployeeLoan",
      required: true,
    },
    rateOfIntereset: {
      type: Number,
    },
    loanAmount: {
      type: Number,
      required: true,
    },
    loanDisbursementDate: {
      type: Date,
      required: true,
    },
    loanCompletedDate: {
      type: Date,
    },
    noOfEmi: {
      type: Number,
      required: true,
    },
    loanPrincipalAmount: {
      type: Number,
    },
    loanInteresetAmount: {
      type: Number,
    },
    totalDeduction: {
      type: Number,
    },
    totalDeductionWithSi: {
      type: Number,
    },
    file: {
      type: String,
    },
    // for approval
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
  },
  { timestamps: true }
);

const LoanManagementModal = mongoose.model(
  "LoanManagementSchema",
  LoanManagementSchema
);

module.exports = { LoanManagementModal };
