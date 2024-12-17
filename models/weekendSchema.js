const mongoose = require("mongoose");

const WeekendSchema = new mongoose.Schema({
  days: {
    type: [
      {
        day: {
          type: String,
          required: true,
        },
      },
    ],
    required: true,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
});

const WeekendModel = mongoose.model("Weekend", WeekendSchema);
module.exports = { WeekendModel };
