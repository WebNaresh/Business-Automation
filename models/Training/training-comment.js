const mongoose = require("mongoose");
const { ObjectId, Number, String } = mongoose.Schema.Types;

const trainingCommentSchema = new mongoose.Schema(
  {
    trainingId: {
      type: ObjectId,
      ref: "Training",
      required: true,
    },
    employeeId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

const TrainingCommentModel = mongoose.model(
  "TrainingComment",
  trainingCommentSchema
);

module.exports = { TrainingCommentModel };
