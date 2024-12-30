const mongoose = require("mongoose");

const OrganizationRelation = new mongoose.Schema(
  {
    employeeId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
      },
    ],
    organizationId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const OrganizationRelationModel = mongoose.model(
  "OrganizationRelation",
  OrganizationRelation
);

module.exports = { OrganizationRelationModel };
