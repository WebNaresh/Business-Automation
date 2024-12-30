const mongoose = require("mongoose");

const CompOffLeaveSchema = new mongoose.Schema({
  compOff: {
    type: Boolean,
    required: true,
    default: false,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});
const CompOffLeaveModal = mongoose.model("Compoff", CompOffLeaveSchema);
module.exports = { CompOffLeaveModal };
