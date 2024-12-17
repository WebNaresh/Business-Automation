const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  organizationId: {
    type: String,
    required: true,
  },
});

const EmailModel = mongoose.model("Email", emailSchema);
module.exports = { EmailModel };
