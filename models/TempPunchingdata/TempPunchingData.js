const mongoose = require("mongoose");

const tempPunchingdataSchema = new mongoose.Schema({
  OrganizationID: {
    type: String,
    required: true,
  },
  EmployeeID: {
    type: Number,
    required: true,
  },
  FirstName: {
    type: String,
    required: true,
  },
  Department: {
    type: String,
    required: true,
  },
  Date: {
    type: String,
    required: true,
  },
  PunchTime: {
    type: String,
    required: true,
  },
  PunchState: {
    type: String,
    required: true,
  },
  Area: {
    type: String,
    required: true,
  },
  SerialNumber: {
    type: String,
    required: true,
  },
  DeviceName: {
    type: String,
    required: true,
  },
  UploadTime: {
    type: String,
    required: true,
  },
});

const TempPunchingdata = mongoose.model(
  "TempPunchingData",
  tempPunchingdataSchema
);

module.exports = TempPunchingdata;
