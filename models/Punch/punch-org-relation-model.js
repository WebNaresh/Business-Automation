const mongoose = require("mongoose");

const punchRel = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      rel: "Employee",
    },
    employees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        rel: "Employee",
      },
    ],
  },
  { timestamps: true }
);

const PunchOrgRelationModel = mongoose.model("PunchTable", punchRel);
module.exports = { PunchOrgRelationModel };
