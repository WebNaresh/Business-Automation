const mongoose = require("mongoose");
const { ObjectId, Boolean } = mongoose.Schema.Types;

const OrganizationTrainingSchema = new mongoose.Schema(
  {
    organizationId: {
      type: ObjectId,
      ref: "Organization",
      required: true,
    },
    trainingId: [
      {
        type: ObjectId,
        ref: "Training",
        required: true,
      },
    ],
    // New fields
    canManagerAssign: {
      type: Boolean,
      default: false,
    },
    canDeptHeadAssign: {
      type: Boolean,
      default: false,
    },
    canHRAssign: {
      type: Boolean,
      default: false,
    },
    collectPoints: {
      type: Boolean,
      default: false,
    },
    canHRDefinePoints: {
      type: Boolean,
      default: false,
    },
    usePointsForExternal: {
      type: Boolean,
      default: false,
    },
    trainingType: [
      {
        label: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const OrganizationTrainingModel = mongoose.model(
  "OrganizationTraining",
  OrganizationTrainingSchema
);
module.exports = { OrganizationTrainingModel };
