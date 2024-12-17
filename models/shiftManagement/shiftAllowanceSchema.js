const { default: mongoose } = require("mongoose");

const shiftAllowance = new mongoose.Schema({
  check: {
    type: Boolean,
    required: true,
    default: false,
  },
  organizationId: {
    type: mongoose.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  accountantId: {
    type: mongoose.Types.ObjectId,
    ref: "Employee",
  },
});

const ShiftAllowanceModal = mongoose.model("shiftAllowance", shiftAllowance);
module.exports = { ShiftAllowanceModal };
