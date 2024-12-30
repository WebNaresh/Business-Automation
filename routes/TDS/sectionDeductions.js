const express = require("express");
const {
  createSectionDeduction,
  getSectionDeduction,
} = require("../../controller/TDS/sectionDeductionController");
const auth = require("../../middleware/Auth");

const router = express.Router();
router.route("/tds/createSectionDeduction").post(auth, createSectionDeduction);
router
  .route("/tds/getSectionDeduction/:financialYear")
  .get(auth, getSectionDeduction);
// router
//   .route("/tds/getHouseProperty/:financialYear")
//   .get(auth, getIncomeHouseProperty);
// router.route("/tds/deleteHouseProperty").post(auth, deleteIncomeHouseProperty);

module.exports = router;
