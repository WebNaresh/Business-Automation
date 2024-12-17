const { default: mongoose } = require("mongoose");

const WorkFlowSchema = new mongoose.Schema({
  apperover: {
    type: mongoose.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  repoteeID: {
    type: mongoose.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Reject"],
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  workFlowSection: {
    type: String,
    default: "Recent",
    enum: ["Archived", "Recent"],
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

const WorkFlowModel = mongoose.model("WorkFlowModel", WorkFlowSchema);

module.exports = { WorkFlowModel };
