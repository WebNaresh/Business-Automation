const mongoose = require("mongoose");

const JobLevelSchema = new mongoose.Schema({
  jobLevel: {
    type: [
      {
        label: String,
        value: String,
      },
    ],
    required: true,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
});

const JobLevelModal = mongoose.model("joblevel", JobLevelSchema);
module.exports = { JobLevelModal };
