const express = require("express");
const {
  AddSalaryComponent,
  getSalaryComponentById,
  deleteSalaryComponentById,
} = require("../../controller/SalaryComponentController/SalaryComponentController");
const auth = require("../../middleware/Auth");
const router = express.Router();

router
  .route("/delete-salary-component/:empId/:id")
  .delete(auth, deleteSalaryComponentById);
router
  .route("/add-salary-component/:EmployeeId")
  .post(auth, AddSalaryComponent);
router
  .route("/get-salary-component/:EmployeeId")
  .get(auth, getSalaryComponentById);

module.exports = router;
