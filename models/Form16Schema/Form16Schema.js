const mongoose = require("mongoose");

const Form16Schema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  form16_file: {
    type: String,
    required: true,
  },
});

const Form16Modal = mongoose.model("Form16", Form16Schema);
module.exports = { Form16Modal };
