const mongoose = require("mongoose");

const EmployeeCodeSchema = new mongoose.Schema({
  code: {
    type: String,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    default: null,
  },
});

const EmployeeCodeModel = mongoose.model("EmployeeCode", EmployeeCodeSchema);
module.exports = { EmployeeCodeModel };
