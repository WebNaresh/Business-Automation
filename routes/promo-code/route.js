const express = require("express");
const {
  checkValidPromoCode,
  getAllPromoCodes,
  createPromoCode,
  getPromoCode,
  deletePromoCode,
  updatePromoCode,
} = require("../../controller/promo-code/controller");
const router = express.Router();
router.route("/all").get(getAllPromoCodes);
router.route("/promo-code-verify/:promoCode").get(checkValidPromoCode);
router.route("/create").post(createPromoCode);
router
  .route("/:promoCode")
  .get(getPromoCode)
  .delete(deletePromoCode)
  .put(updatePromoCode);

module.exports = router;
