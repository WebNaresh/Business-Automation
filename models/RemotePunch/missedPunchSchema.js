const express = require("express");
const { default: mongoose } = require("mongoose");

const MissedSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  locations: [
    {
      startLocation: {
        type: String,
        required: true,
      },
      endLocation: {
        type: String,
        required: true,
      },
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
    },
  ],

  

});
