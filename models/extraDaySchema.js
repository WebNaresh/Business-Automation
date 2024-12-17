const mongoose = require("mongoose");

const ExtraDaySchema = new mongoose.Schema({
  extraDay: {
    type: Boolean,
    required: true,
    default: false,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});
const ExtraDayModal = mongoose.model("Extraday", ExtraDaySchema);
module.exports = { ExtraDayModal };

