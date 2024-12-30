const { Schema, default: mongoose } = require("mongoose");

const employeeRateSchema = {
  rating: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  reviewDate: {
    type: Date,
    default: Date.now,
  },
};

const EmployeeGoalsSchema = new Schema({
  empId: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
  },
  goals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SingleGoals",
    },
  ],
  managerRating: {
    type: String,
    // required: true,
  },
  managerFeedback: {
    type: String,
    // required: true,
  },
  isRevaluation: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected", "To Do"],
  },
  yearCycle: {
    type: String,
  },
  monitoring: {
    type: String,
  },

  ManagerRating: {
    type: String,
  },
  ManagerReview: {
    type: String,
  },

  Rating: [employeeRateSchema],
});

const EmployeeGoalsModel = mongoose.model("EmployeeGoals", EmployeeGoalsSchema);

module.exports = { EmployeeGoalsModel, EmployeeGoalsSchema };
