const mongoose = require("mongoose");

// year: {
//     type: String,
//     required: true,
// },
// date: {
//     type: String,
//     required: true,
// },
// day: {
//     type: String,
//     required: true,
// },
// month: {
//     type: String,
//     required: true,
// },

const HolidaySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const HolidayModel = mongoose.model("Holiday", HolidaySchema);
module.exports = { HolidayModel };
