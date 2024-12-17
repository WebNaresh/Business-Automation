const mongoose = require("mongoose");

const userDocuments = new mongoose.Schema({
  files: [
    {
      fileName: {
        type: String,
        required: true,
      },
      selectedValue: {
        type: String,
        required: true,
      },
      fileType: {
        type: String,
        required: true,
        enum: ["application/pdf", "image/jpeg", "image/png"], // Allowed file types
        default: "application/pdf", // Default file type
      },
      isCustom: {
        type: Boolean,
        default: false, // Default value, optional field
      },
      customDocumentName: {
        type: String,
        default: "", // Optional field
      },
    },
  ],
  employeeId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Employee",
  },
  approvalId: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Employee",
    },
  ],
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
});

const UserDocuments = mongoose.model("userdocuments", userDocuments);
module.exports = { UserDocuments };
