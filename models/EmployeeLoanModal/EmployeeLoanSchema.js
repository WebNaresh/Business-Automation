const mongoose = require("mongoose");

const EmployeeLoanSchema = new mongoose.Schema({
  loanName: {
    type: String,
    maxLength: [35, "name cannot exceed 35 characters"],
    minLength: [1, "name should have more than 2 characters"],
  },
  loanValue: {
    type: Number,
  },
  maxLoanValue: {
    type: Number,
  },
  rateOfInterest: {
    type: Number,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    default: null,
  },
});

const EmployeeLoanModel = mongoose.model("EmployeeLoan", EmployeeLoanSchema);
module.exports = { EmployeeLoanModel };
