const mongoose = require("mongoose");
const moment = require("moment");

const tdsDeclaration = new mongoose.Schema({
  section: {
    type: String,
    enum: ["office", "remote"],
    required: true,
  },
  investmenttype: {
    type: String,
    required: true,
  },
  maxallowed: {
    type: number,
    required: true,
  },
  amount: {
    type: number,
    required: true,
  },
  proofs: {
    type: String,
  },
  empId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization", // Reference to the Organization schema
    required: true,
  },
});

const TDSDeclare = mongoose.model("Shift", tdsDeclaration);

module.exports = { TDSDeclare };
