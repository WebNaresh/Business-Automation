// checkValidPromoCode a User
const ErrorHandler = require("../../utils/errorHandler");
const catchAssyncError = require("../../middleware/catchAssyncError");
const { PromoCodeModel } = require("../../models/promo-code/model");

exports.checkValidPromoCode = catchAssyncError(async (req, res, next) => {
  let promoCode = req.params.promoCode;
  console.log(`🚀 ~ file: controller.js:8 ~ promoCode:`, promoCode);
  if (!promoCode) {
    return next(new ErrorHandler("Please provide a promo code", 400));
  }
  promoCode = await PromoCodeModel.findOne({ code: promoCode });
  console.log(`🚀 ~ file: controller.js:13 ~ promoCode:`, promoCode);
  if (!promoCode) {
    return res.status(400).json({
      success: false,
      message: "Invalid Promo Code",
    });
  }
  res.status(200).json({
    success: true,
    promoCode,
    message: `Valid Promo Code ${promoCode.code} with discount ${promoCode.discount}`,
  });
});

exports.getAllPromoCodes = catchAssyncError(async (req, res, next) => {
  const promoCodes = await PromoCodeModel.find();
  res.status(200).json({
    success: true,
    promoCodes,
  });
});

exports.createPromoCode = catchAssyncError(async (req, res, next) => {
  const { code, discount } = req.body;
  if (!code || !discount) {
    return next(new ErrorHandler("Please provide code and discount", 400));
  }
  const promoCode = await PromoCodeModel.create({ code, discount });
  res.status(201).json({
    success: true,
    promoCode,
  });
});

exports.getPromoCode = catchAssyncError(async (req, res, next) => {
  if (!req.params.promoCode) {
    return next(new ErrorHandler("Please provide a promo code", 400));
  }
  const promoCode = await PromoCodeModel.findById(req.params.promoCode);
  if (!promoCode) {
    return next(new ErrorHandler("Invalid Promo Code", 400));
  }
  res.status(200).json({
    success: true,
    promoCode,
  });
});

exports.deletePromoCode = catchAssyncError(async (req, res, next) => {
  if (!req.params.promoCode) {
    return next(new ErrorHandler("Please provide a promo code", 400));
  }
  const promoCode = await PromoCodeModel.findByIdAndDelete(
    req.params.promoCode
  );
  if (!promoCode) {
    return next(new ErrorHandler("Invalid Promo Code", 400));
  }
  res.status(200).json({
    success: true,
    promoCode,
  });
});

exports.updatePromoCode = catchAssyncError(async (req, res, next) => {
  if (!req.params.promoCode) {
    return next(new ErrorHandler("Please provide a promo code", 400));
  }
  const promoCode = await PromoCodeModel.findByIdAndUpdate(
    req.params.promoCode,
    req.body,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  if (!promoCode) {
    return next(new ErrorHandler("Invalid Promo Code", 400));
  }
  res.status(200).json({
    success: true,
    promoCode,
  });
});
