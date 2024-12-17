const { mongoose } = require("mongoose");

const WorkFlowSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["approved", "rejected", "pending"],
    default: "pending",
  },
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
    required: true,
  },
});

module.exports = mongoose.model("WorkFlow", WorkFlowSchema);
