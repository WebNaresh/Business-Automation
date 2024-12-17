const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
  coupan: {
    type: String,
    required: true,
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
});

const CouponModel = mongoose.model("Coupons", CouponSchema);
module.exports = { CouponModel };
