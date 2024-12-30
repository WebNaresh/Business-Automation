const mongoose = require("mongoose");

const CommunicationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  communication: {
    type: [String],
   
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

const CommunicationModal = mongoose.model("communication", CommunicationSchema);
module.exports = { CommunicationModal };
