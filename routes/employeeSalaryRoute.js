const express = require("express");
const router = express.Router();
const auth = require("../middleware/Auth");
const {
  addEmployeeSalaryDetails,
  getEmployeeSalaryDetails,
  getOrganizationSalaryOverview,
  getDepartmentSalaryOverview,
  getLocationSalaryOverview,
  getManagerSalaryOverview,
  getEmployeeSalaryDetailsForYear,
  getPFChallan,
  getESICChallan,
  getEmployeeSalaryPerFinancialYear,
  getEmployeeSalaryDetailsNoti
} = require("../controller/employeeSalary/employee-salary-controller");

router
  .route("/employeeSalary/add-salary/:employeeId/:organisationId")
  .post(auth, addEmployeeSalaryDetails);

router
  .route("/employeeSalary/viewpayslip/:employeeId/:organisationId")
  .get(auth, getEmployeeSalaryDetails);

router
  .route("/employeeSalary/viewpayslip/notification/:employeeId/:organisationId")
  .get(auth, getEmployeeSalaryDetailsNoti);

router
  .route("/employeeSalary/viewpayslip/:employeeId/:organisationId")
  .get(auth, getEmployeeSalaryDetails);

router
  .route("/employeeSalary/viewpayslip/:employeeId/:organisationId/:year")
  .get(auth, getEmployeeSalaryDetailsForYear);

module.exports = router;

router
  .route("/employeeSalary/organizationSalaryOverview/:organizationId/:year")
  .get(auth, getOrganizationSalaryOverview);

router
  .route("/employeeSalary/departmentSalaryOverview/:departmentId/:year")
  .get(auth, getDepartmentSalaryOverview);

router
  .route("/employeeSalary/locationSalaryOverview/:locationId/:year")
  .get(auth, getLocationSalaryOverview);

router
  .route("/employeeSalary/getEmployeeSalaryPerFinancialYear")
  .get(auth, getEmployeeSalaryPerFinancialYear);

router
  .route("/employeeSalary/managerSalaryOverview/:managerId/:year")
  .get(auth, getManagerSalaryOverview);
router
  .route("/employeeSalary/getPFChallan/:organizationId/:year/:month")
  .get(auth, getPFChallan);
router
  .route("/employeeSalary/getESICChallan/:organizationId/:year/:month")
  .get(auth, getESICChallan);
