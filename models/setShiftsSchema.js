const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
  workingFrom: {
    type: String,
    enum: ["office", "remote"],
    required: true,
  },
  shiftName: {
    type: String,
    required: true,
    minlength: [3, "Shift name must have a minimum length of 3 characters."],
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  selectedDays: {
    type: [
      {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
    ],
    validate: [
      {
        validator: function (selectedDays) {
          // Ensure no duplicate values
          return new Set(selectedDays).size === selectedDays.length;
        },
        message: "Duplicate values are not allowed in selectedDays array.",
      },
    ],
    required: true,
  },
  allowance: {
    type: Number,
    default: 0,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization", // Reference to the Organization schema
    required: true,
  },
});

const ShiftModel = mongoose.model("Shift", shiftSchema);

module.exports = { ShiftModel };
