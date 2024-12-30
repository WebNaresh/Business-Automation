const { default: mongoose } = require("mongoose");
const { EmployeeGoalsModel } = require("./EmployeeGoalsSchema");
const SingleGoal = new mongoose.Schema(
  {
    goal: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    goalType: {
      type: String,
    },

    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    creatorRole: {
      type: String,
      required: true,
    },
    approverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    comments: {
      type: String,
    },
    employeeComments: {
      type: String,
    },
    measurments: {
      type: String,
    },
    message: {
      type: String,
    },
    review: {
      type: String,
    },
    rating: {
      type: String,
    },
    attachments: {
      type: String,
    },

    goalCompleteDate: {
      type: String,
    },
    goalStatus: {
      type: String,
      default: "Not Started",
      enum: [
        "In Progress",
        "Completed",
        "Overdue",
        "Not Started",
        "Pending",
        "Goal Rejected",
      ],
    },

    empId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    status: {
      type: String,
      default: "pending",
    },
    downcasted: {
      type: Boolean,
      default: false,
    },
    downcastedId: {
      type: String,
      default: false,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
  },
  { timestamps: true }
);

SingleGoal.pre("save", async function (next) {
  const goal = this;

  // Find an existing EmployeeGoals document for the same employee and organization
  let employeeGoals = await EmployeeGoalsModel.findOne({
    empId: goal.empId,
  });

  if (employeeGoals) {
    // If an EmployeeGoals document exists, add the new goal to the goals array
    employeeGoals.goals.push(goal._id);
  } else {
    // If no EmployeeGoals document exists, create a new one
    employeeGoals = new EmployeeGoalsModel({
      empId: goal.empId,
      organizationId: goal.organizationId,
      goals: [goal._id],
      yearCycle: "", // set this to the desired value
      managerKRA: "", // set this to the desired value
      selfKRA: "", // set this to the desired value
      Rating: [], // set this to the desired value
    });
  }

  // Save the EmployeeGoals document
  await employeeGoals.save();

  next();
});

const SingleGoalsModel = mongoose.model("SingleGoals", SingleGoal);

module.exports = { SingleGoalsModel };
