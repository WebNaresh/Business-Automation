const express = require("express");
const {
  createEmployeeSalaryCalDay,
  getEmployeeSalaryCalDays,
  getEmployeeSalaryCalDay,
  updateEmpSalCalDay,
  deleteEmpSalCalDay,
} = require("../controller/empSalaryCalDayController/emp-sal-cal-day-controller");
const auth = require("../middleware/Auth");
const router = express.Router();
router
  .route("/employee-salary-cal-day/:organizationId")
  .post(auth, createEmployeeSalaryCalDay);
router
  .route("/employee-salary-cal-day/get/:organizationId")
  .get(auth, getEmployeeSalaryCalDays);
router
  .route("/employee-salary-cal-day/get/:organizationId/:id")
  .get(auth, getEmployeeSalaryCalDay);
router
  .route("/employee-salary-cal-day/update/:organizationId/:id")
  .put(auth, updateEmpSalCalDay);
router
  .route("/delete/employee-computation-day/:organizationId/:empSalCalId")
  .delete(auth, deleteEmpSalCalDay);
module.exports = router;
