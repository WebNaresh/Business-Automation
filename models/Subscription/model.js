const mongoose = require("mongoose");
const { String, ObjectId } = mongoose.Schema.Types;

const subscriptionSchema = new mongoose.Schema({
  packageName: {
    type: String,
    required: true,
    enum: [
      "Basic Plan",
      "Intermediate Plan",
      "Enterprise Plan",
      "Essential Plan",
    ],
  },
  memberCount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["Active", "Inactive"],
  },
  expirationDate: {
    type: Date,
    required: true,
  },
});

const SubscriptionSchemaModel = mongoose.model(
  "Subscription",
  subscriptionSchema
);
module.exports = { SubscriptionSchemaModel };
