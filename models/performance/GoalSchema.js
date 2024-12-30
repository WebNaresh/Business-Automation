const { default: mongoose } = require("mongoose");
const { SingleGoalsModel } = require("./SingleGoals");

const GoalsSchema = new mongoose.Schema(
  {
    currentYear: {
      type: String,
    },
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
    assignee: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],
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
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    downcasted: {
      type: Boolean,
      default: false,
    },
    totalCompletionCount: {
      type: Number,
      default: 0,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    goals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SingleGoals",
      },
    ],
  },
  { timestamps: true }
);

GoalsSchema.pre("save", async function (next) {
  const assignees = this.assignee;
  const goals = [];
  let status = "pending";

  if (this.creatorRole === "Manager") {
    status = "Goal Approved";
  }

  for (const assignee of assignees) {
    const singleGoal = new SingleGoalsModel({
      goalId: this._id,
      empId: assignee,
      organizationId: this.organizationId,
      status,
    });

    // Save the singleGoal to get its _id
    const savedSingleGoal = await singleGoal.save();
    goals.push(savedSingleGoal);
  }

  try {
    // Add the _ids of the singleGoals to the goals array of the GoalsModel
    this.goals = goals.map((goal) => goal._id);

    next();
  } catch (error) {
    next(error);
  }
});

const GoalsModel = mongoose.model("OrganizationGoals", GoalsSchema);
module.exports = { GoalsModel };
