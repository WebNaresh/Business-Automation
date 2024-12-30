const mongoose = require("mongoose");

const ApplyJobPositionSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    empId: {
      type: String,
      required: true,
    },
    durationOfCurrentRole: {
      type: String,
      required: true,
    },
    yearsOfExperience: {
      type: String,
      required: true,
    },
    file: {
      type: String,
    },

    employeeId: {
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

const ApplyJobPositionModel = mongoose.model(
  "ApplyJobPosition",
  ApplyJobPositionSchema
);
module.exports = { ApplyJobPositionModel };
