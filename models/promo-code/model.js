const mongoose = require("mongoose");

const PromoCode = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true, // Promo code should be unique
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
      max: 100, // 100% discount
    },
  },
  { timestamps: true }
);
const PromoCodeModel = mongoose.model("Promo-Code", PromoCode);
module.exports = { PromoCodeModel };
