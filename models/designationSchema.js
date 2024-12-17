const mongoose = require("mongoose");

const DesignationSchema = new mongoose.Schema({
  designationName: {
    type: String,
    required: true,
  },
  designationId: {
    type: String,
    required: false,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("Designation", DesignationSchema);
