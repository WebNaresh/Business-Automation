const mongoose = require("mongoose");
const { ObjectId, Number } = mongoose.Schema.Types;

const FaceDetect = new mongoose.Schema(
  {
    label: {
      type: ObjectId,
      ref: "User",
    },
    descriptor: [Number],
  },
  { timestamps: true }
);
const FaceDetectModel = mongoose.model("FaceDetect", FaceDetect);
module.exports = { FaceDetectModel };
