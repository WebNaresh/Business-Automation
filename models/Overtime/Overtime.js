const mongoose = require("mongoose");

const OvertimeSchema = new mongoose.Schema({
  overtimeAllowed: {
    type: Boolean,
    required: true,
  },
  minimumOvertimeHours: {
    type: Number,
    required: true,
    min: 0,
    max: 24,
  },
  overtimeAllowanceRequired: {
    type: Boolean,
    required: true,
  },
  allowanceParameter: {
    type: String,
    enum: ["perHour", "perDay"],
    required: true,
  },
  allowanceAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
});

module.exports = mongoose.model("Overtime", OvertimeSchema);
