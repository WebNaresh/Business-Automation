const mongoose = require("mongoose");

const OrganizationLocations = new mongoose.Schema({
  continent: {
    type: String,
    required: true,
  },
  shortName: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },
  addressLine1: {
    type: String,
    required: true,
  },
  addressLine2: {
    type: String,
    required: false,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  creater: {
    type: String,
    required: true,
  },
});

const OrganisationLocationModel = mongoose.model(
  "OrganizationLocations",
  OrganizationLocations
);
module.exports = { OrganisationLocationModel };
