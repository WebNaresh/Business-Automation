const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  empId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  mId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  status: {
    type: Boolean,
    default: false,
  },
  rejected: {
    type: Boolean,
    default: false,
  },
});

const orgDocuments = new mongoose.Schema({
  organizationId: {
    type: mongoose.Types.ObjectId,
  },
  type: {
    type: String,
    required: true,
  },
  header: {
    type: String,
    required: true,
  },
  footer: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  creatorId: {
    type: mongoose.Types.ObjectId,
    required: false,
    ref: "Employee",
  },
  employeeId: [employeeSchema],
  managerId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  ],
  url: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  applicableDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const OrgDocuments = mongoose.model("orgdocuments", orgDocuments);
module.exports = { OrgDocuments };
