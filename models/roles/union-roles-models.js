const mongoose = require("mongoose");
const RolesSchema = new mongoose.Schema({
  Manager: {
    isApprover: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  HR: {
    isApprover: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  "Department-Head": {
    isApprover: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  "Delegate-Department-Head": {
    isApprover: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  "Department-Admin": {
    isApprover: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  "Delegate-Department-Admin": {
    isApprover: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  Accountant: {
    isApprover: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  "Delegate-Accountant": {
    isApprover: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  organisationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
});

const RolesModel = mongoose.model("Roles-Organisation", RolesSchema);
module.exports = { RolesModel };
