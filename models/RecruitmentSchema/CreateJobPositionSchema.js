const mongoose = require("mongoose");

const JobPositionSchema = new mongoose.Schema(
  {
    position_name: {
      type: String,
      required: true,
    },
    department_name: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    location_name: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrganizationLocations",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    job_type: {
      type: {
        label: String,
        value: String,
      },
      required: true,
    },
    mode_of_working: {
      type: {
        label: String,
        value: String,
      },
      required: true,
    },
    job_level: {
      type: {
        label: String,
        value: String,
      },
      required: true,
    },
    job_description: {
      type: String,
      required: true,
    },
    role_and_responsibility: {
      type: String,
      required: true,
    },
    required_skill: {
      type: [
        {
          label: String,
          value: String,
        },
      ],
      required: true,
    },
    hiring_manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    hiring_hr: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    education: {
      type: String,
      required: true,
    },
    experience_level: {
      type: String,
      required: true,
    },
    age_requirement: {
      type: Number,
    },
    working_time: {
      type: Number,
    },
    isSaveDraft: {
      type: Boolean,
      default: false,
    },
    approvalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
  },
  { timestamps: true }
);

const JobPositionModel = mongoose.model("JobPosition", JobPositionSchema);
module.exports = { JobPositionModel };
