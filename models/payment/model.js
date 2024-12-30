const mongoose = require("mongoose");

const Payment = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    isTrialPeriod: {
      type: Boolean,
      default: true,
    },
    memberLimit: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: true }
);

const PaymentModel = mongoose.model("Payment", Payment);
module.exports = { PaymentModel };
