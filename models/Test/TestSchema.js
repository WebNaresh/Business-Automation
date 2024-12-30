const mongoose = require("mongoose");

const daysSchem = new mongoose.Schema(
  {
    location: [
      {
        lng: {
          type: Number,
        },
        lat: {
          type: Number,
        },
      },
    ],
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    managerStatus: {
      type: String,
      default: "Pending",
    },
  },

  { timestamps: true }
);

const punchSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  days: [daysSchem],
});

const TestDays = mongoose.model("TestDays", daysSchem);
const TestPunch = mongoose.model("TestPunch", punchSchema);
module.exports = { TestPunch, TestDays };
