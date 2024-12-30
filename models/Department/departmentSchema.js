const mongoose = require("mongoose");

const Department = new mongoose.Schema({
  departmentName: {
    type: String,
    required: true,
  },
  workflow: {
    type: mongoose.Types.ObjectId,
    ref: "WorkFlow",
  },
  departmentId: {
    type: String,
    required: true,
  },
  dept_cost_center_id: {
    type: String,
    required: true,
  },
  departmentDescription: {
    type: String,
  },
  departmentLocation: {
    ref: "OrganizationLocations",
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  costCenterName: {
    type: String,
  },
  costCenterDescription: {
    type: String,
    required: false,
  },

  departmentHeadName: {
    ref: "Employee",
    type: mongoose.Schema.Types.ObjectId,
  },
  departmentHeadDelegateName: {
    ref: "Employee",
    type: mongoose.Schema.Types.ObjectId,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
  approvalIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  ],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
});

Department.pre("save", async function (next) {
  try {
    const savedDocument = this;
    if (this.isNew) {
      next();
    }
  } catch (error) {
    console.log(error);
  }
});

const DepartmentModel = mongoose.model("Department", Department);
module.exports = { DepartmentModel };
