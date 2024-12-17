const mongoose = require("mongoose");

const workFlowSchema = new mongoose.Schema(
  {
    request_raised_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    Approver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    msg: {
      type: String,
    },
    status: {
      type: String,
      enum: ["approved", "rejected", "pending"],
      default: "pending",
    },
    backend_link: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const WorkFlowDeptModel = mongoose.model("WorkFlowDept", workFlowSchema);
module.exports = { WorkFlowDeptModel };
