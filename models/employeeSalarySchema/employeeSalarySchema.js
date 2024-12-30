const mongoose = require("mongoose");

const EmployeeSalary = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
  },
  salary: [
    {
      NotificationCount: {
        type: Number,
        default: 0
      },
      month: {
        type: Number,
        required: true,
      },
      year: {
        type: Number,
        required: true,
      },
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
      totalGrossSalary: {
        type: Number,
      },

      totalNetSalary: {
        type: Number,
      },

      totalDeduction: {
        type: Number,
      },
      emlCtr: {
        type: Number,
      },

      formattedDate: {
        type: String,
      },
      publicHolidaysCount: {
        type: Number,
      },
      numDaysInMonth: {
        type: Number,
      },
      paidLeaveDays: {
        type: Number,
      },
      unPaidLeaveDays: {
        type: Number,
      },
      noOfDaysEmployeePresent: {
        type: Number,
      },
    },
  ],
});

const EmployeeSalaryModel = mongoose.model("EmployeeSalary", EmployeeSalary);
module.exports = { EmployeeSalaryModel };
