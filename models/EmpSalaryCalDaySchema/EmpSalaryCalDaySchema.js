const mongoose = require("mongoose");

const EmpSalaryCalDaySchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  selectedDay: {
    type: String,
    required: true,
    unique: true,
  },
});

const EmployeeSalaryCalDayModel = mongoose.model(
  "EmployeeSalaryCalculation",
  EmpSalaryCalDaySchema
);
module.exports = { EmployeeSalaryCalDayModel };
