const mongoose = require("mongoose");

const EmailCommunicationSchema = new mongoose.Schema({
  communication: {
    type: [
      {
        label: String,
        value: String,
      },
    ],
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: [
      {
        label: String,
        value: String,
      },
    ],
    required: true,
  },
  cc: {
    type: [
      {
        label: String,
        value: String,
      },
    ],
    required: true,
  },
  bcc: {
    type: [
      {
        label: String,
        value: String,
      },
    ],
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  valediction: {
    type: String,
    required: true,
  },
  signature: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default : "UnSend" , 
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

const EmailCommunicationModal = mongoose.model(
  "EmailCommunication",
  EmailCommunicationSchema
);
module.exports = { EmailCommunicationModal };
