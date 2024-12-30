const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const EmployeeSummary = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  organisationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Attendance",
    required: true,
  },
  summary: [
    {
      month: {
        type: Number,
        required: true,
      },
      year: {
        type: Number,
        required: true,
      },
      availableDays: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Attendance",
          required: true,
        },
      ],
      paidleaveDays: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Attendance",
          required: true,
        },
      ],
      unpaidleaveDays: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Attendance",
          required: true,
        },
      ],
      remotePunching: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "PunchTable",
          required: true,
        },
      ],
    },
  ],
});

const EmployeeSummaryModel = mongoose.model("EmployeeSummary", EmployeeSummary);
module.exports = { EmployeeSummaryModel };
