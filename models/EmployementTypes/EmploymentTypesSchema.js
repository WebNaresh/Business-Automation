const mongoose = require("mongoose");

const employementSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const EmploymentModel = mongoose.model("EmploymentTypes", employementSchema);
module.exports = { EmploymentModel };
