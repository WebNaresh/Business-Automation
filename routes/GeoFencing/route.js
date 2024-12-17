const express = require("express");
const {
  addCircle,
  getOrgCircle,
  deleteCircle,
  editCircle,
  removeEmployeeFromCircle,
  getOrgEmployeeWithFilter,
  getEmployeeCircle,
  getCircle,
  getEmployeesInCircle, manageEmployeeInCircle
} = require("../../controller/GeoFencing/controller");
const router = express.Router();
router
  .route("/:organizationId")
  .post(addCircle)
  .get(getOrgCircle)
  .put(getOrgEmployeeWithFilter);

router.route("/area/:circleId").delete(deleteCircle).put(editCircle).get(getCircle);

router
  .route("/:circleId/employee")
  .put(removeEmployeeFromCircle)
  .post(manageEmployeeInCircle).get(getEmployeesInCircle);

router.route("/get-employee-circle/:employeeId").get(getEmployeeCircle);

module.exports = router;
