const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Plan = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: [true, "Please Enter Your name "],
    },
    planName: {
      type: Number,
      required: [true, "Please Enter Price "],
    },
    description: {
      type: String,
      required: [true, "Please Enter Description "],
    },
    duration: {
      type: Number,
    },
  },
  { timestamps: true }
);
const PlanModel = mongoose.model("Plan", Plan);
module.exports = { PlanModel };
