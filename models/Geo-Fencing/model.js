const mongoose = require("mongoose");

const GeoFencingSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  center: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  radius: {
    type: Number,
    required: true,
  },
  employee: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  ],
});

// Create a 2dsphere index on the center field
GeoFencingSchema.index({ center: "2dsphere" });

const GeoFencingModel = mongoose.model("GeoFencing", GeoFencingSchema);

module.exports = { GeoFencingModel };
