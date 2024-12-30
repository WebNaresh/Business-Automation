const mongoose = require("mongoose");

const SalaryComponentSchema = new mongoose.Schema(
  {
    income: [
      {
        name: {
          type: String,
          required: true,
        },
        value: {
          type: Number,
          default: 0,
        },
      },
    ],
    deductions: [
      {
        name: {
          type: String,
          required: true,
        },
        value: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalSalary: {
      type: Number,
    },
    EmployeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
  },
  { timestamps: true }
);

const SalaryComponentModel = mongoose.model(
  "SalaryComponent",
  SalaryComponentSchema
);

module.exports = { SalaryComponentModel };
