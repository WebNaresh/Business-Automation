const express = require("express");
const {
  createIncomeOtherSources,
  deleteIncomeOtherSources,
  getOtherIncome,
} = require("../../controller/TDS/incomeFromOtherSouces");
const auth = require("../../middleware/Auth");

const router = express.Router();
router.route("/tds/OtherIncome").post(auth, createIncomeOtherSources);
router.route("/tds/deleteOtherIncome").post(auth, deleteIncomeOtherSources);
router.route("/tds/OtherIncome/:financialYear").get(auth, getOtherIncome);

module.exports = router;
