const express = require("express");
const {
  createEmployeeCode,
  getEmployeeCode,
  updateEmployeeCode,
  deleteEmployeeCode,
  getEmpCodeById,
} = require("../controller/EmployeeCodeController/employeeCodeController");
const router = express.Router();
const auth = require("../middleware/Auth");
router
  .route("/create/employee-code-generator/:organizationId")
  .post(auth, createEmployeeCode);
router.route("/get/employee-code/:organizationId").get(auth, getEmployeeCode);
router
  .route("/get/employee-code/:organizationId/:empCodeId")
  .get(auth, getEmpCodeById);
router
  .route("/update/employee-code/:organizationId/:employeeCodeId")
  .put(auth, updateEmployeeCode);
router
  .route("/delete/employee-code/:organizationId/:employeeCodeId")
  .delete(auth, deleteEmployeeCode);
module.exports = router;
