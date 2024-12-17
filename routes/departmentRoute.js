const express = require("express");
const {
  createDepartment,
  updateDepartment,
  getDepartmentById,
  getDepartmentDetails,
  deleteDepartment,
  deleteDepartments,
  getDepartmentsByLocation,
  getNotifications,
  updateNotification,
  getDepartmentEmployees,
  getCostCenterId,
  getDepartmentManagers,
  getDeptShiftEmployee,
  getManagerShiftEmployee,
  getDeptForOrg,
  getDepartmentToApproval,
  AcceptOrRejectDepartment,
  sendNotificationToEmp,
} = require("../controller/departmentController");
const auth = require("../middleware/Auth");
const router = express.Router();

router.route("/department/create/:organizationId").post(auth, createDepartment);
router
  .route("/update-department/:organizationId/:deptId")
  .put(auth, updateDepartment);
router
  .route("/get-department/:organizationId/:deptId")
  .get(auth, getDepartmentById);
router.route("/department/getall/:id").get(auth, getDeptForOrg);
router.route("/department/get/:organizationId").get(auth, getDepartmentDetails);
router
  .route("/department/get/cost-center-id/:organizationId")
  .get(auth, getCostCenterId);

router
  .route("/department/getbylocation/:locationId")
  .get(auth, getDepartmentsByLocation);
router
  .route("/department/delete/:organizationId/:deptId")
  .delete(auth, deleteDepartment);
router.route("/department/delete/:id").delete(auth, deleteDepartments);
router.route("/notification").get(auth, getNotifications);
router
  .route("/notification/update/:notificationId")
  .post(auth, updateNotification);

router
  .route("/departmentHead/getAllEmployees")
  .get(auth, getDepartmentEmployees);
router.route("/departmentHead/getAllManagers").get(auth, getDepartmentManagers);

router
  .route("/leave/getDeptShift/:organizationId")
  .get(auth, getDeptShiftEmployee);

router
  .route("/leave/getManagerShifts/:organizationId")
  .get(auth, getManagerShiftEmployee);

router.route("/getDepartment/toApproval").get(auth, getDepartmentToApproval);

router.route("/accept/reject/:deptId").put(auth, AcceptOrRejectDepartment);

router.route("/sendNotficationToEmp").get(auth, sendNotificationToEmp);

module.exports = router;
