const mongoose = require("mongoose");
const { Boolean, ObjectId } = mongoose.Schema.Types;
const RemotePunching = new mongoose.Schema({
  dualWorkflow: {
    type: Boolean,
    default: false,
  },
  allowance: {
    type: Boolean,
    default: false,
  },
  allowanceQuantity: {
    type: Number,
    default: 0,
  },
  organizationId: {
    type: ObjectId,
    ref: "Organization",
    required: true,
  },
  accountantId: {
    type: ObjectId,
    ref: "Employee",
  },
  geoFencing: {
    type: Boolean,
    default: false,
  },
  faceRecognition: {
    type: Boolean,
    default: false,
  },
});
const RemotePunchingModel = mongoose.model(
  "RemotePunchingSetup",
  RemotePunching
);
module.exports = { RemotePunchingModel };
