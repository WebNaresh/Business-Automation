const express = require("express");
const {
  createIncomeHouseProperty,
  getIncomeHouseProperty,
  deleteIncomeHouseProperty,
} = require("../../controller/TDS/incomeFromPropertyController");
const auth = require("../../middleware/Auth");

const router = express.Router();
router.route("/tds/createHouseProperty").post(auth, createIncomeHouseProperty);
router
  .route("/tds/getHouseProperty/:financialYear")
  .get(auth, getIncomeHouseProperty);
router.route("/tds/deleteHouseProperty").post(auth, deleteIncomeHouseProperty);

module.exports = router;
