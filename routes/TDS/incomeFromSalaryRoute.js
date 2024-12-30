const express = require("express");

const auth = require("../../middleware/Auth");
const {
  createIncomeSalary,
  getSalaryIncome,
} = require("../../controller/TDS/incomeFromSalaryController");

const router = express.Router();
router.route("/tds/salaryIncome").post(auth, createIncomeSalary);
// router.route("/tds/deleteOtherIncome").post(auth, deleteIncomeOtherSources);
router.route("/tds/salaryIncome/:financialYear").get(auth, getSalaryIncome);

module.exports = router;
