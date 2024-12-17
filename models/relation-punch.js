const mongoose = require("mongoose");

const punchSchema = new mongoose.Schema(
  {
    employeeIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        rel: "Employee",
      },
    ],
    organisationId: {
      type: mongoose.Schema.Types.ObjectId,
      rel: "Organization",
    },
  },
  { timestamps: true }
);

const PunchTestModel = mongoose.model("PunchTable", punchSchema);
module.exports = { PunchTestModel };
