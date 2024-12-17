const mongoose = require("mongoose");

const PFSchema = new mongoose.Schema({
  EPF: {
    type: Number,
    default: 0.12,
    required: true,
  },
  EPS: {
    type: Number,
    default: 0.0833,
    required: false,
  },
  ECP: {
    type: Number,
    required: false,
    default: 0.75,
  },
  ECS: {
    type: Number,
    required: false,
    default: 3.25,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization", // Reference to the Organization schema
    required: true,
  },
});

const PFModel = mongoose.model("PFESIC", PFSchema);

module.exports = { PFModel };
