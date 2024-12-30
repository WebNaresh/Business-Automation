const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const trainingEmployee = new mongoose.Schema({
  employeeId: {
    type: ObjectId,
    required: true,
    ref: "Employee",
  },
  trainingId: {
    type: ObjectId,
    required: true,
    ref: "Training",
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "ongoing", "overdue", "cancelled", "completed"],
  },
  proofOfSubmissionUrl: {
    type: String,
  },
});
const trainingEmployeeModel = mongoose.model(
  "EmployeeTraining",
  trainingEmployee
);
module.exports = { trainingEmployeeModel };
