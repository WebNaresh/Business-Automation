const express = require("express");
const {
  createLeave,
  updateLeaveNotificationCount,
  getAllLeave,
  acceptLeaveRequest,
  rejectLeaveRequest,
  getEmployeeSummaryForCurrentMonth,
  getEmployeeLeaveTable,
  getOrgEmployeeYearLeave,
  getEmployeeCurrentYearLeave,
  getEmployeeSummaryTable,
  getLeavesByMonth,
  getEmployeeLast3Leaves,
  getAllLeaveForYear,
  getAllLeaveByYear,
  getAllLeaveForManager,
  getOrganizationAttendence,
  getOrganizationAttendenceByYear,
  getDepartmentAttendence,
  getLocationAttendence,
  getManagerEmployeeAttendence,
  getManagerAttendence,
  getAbsentEmployee,
  getDeptAbsentEmployee,
  getManagerAbsentEmployee,
  getAllLeaves,
  getNotificationForEmps,
  deleteLeaveRequest,
  getEmployeeNotificationWithFilter,
  getEmployeeNotificationCountWithFilter,
  acceptDeleteRequest,
  rejectDeleteRequest,
  getEmployeeLeaveByMonth,
  getLeaveTableForEmployee,
} = require("../controller/leave-types/leave-requesation-controller");
const auth = require("../middleware/Auth");
const {
  getLeaveTypesFunctionWithoutDefault,
} = require("../controller/leave-types/leave-controller");
const router = express.Router();
router.route("/leave/create").post(auth, createLeave);
router
  .route("/leave/update/notificationCount/:employeeId")
  .put(auth, updateLeaveNotificationCount);
router.route("/leave/get").get(auth, getAllLeave);
router.route("/leave/get/:employeeId").get(auth, getNotificationForEmps);
router.route("/leave/allLeaves").get(auth, getAllLeaves);
router.route("/leave/accept/:leaveRequestId").post(auth, acceptLeaveRequest);
router.route("/leave/reject/:leaveRequestId").post(auth, rejectLeaveRequest);
router.route("/leave/delete/:leaveRequestId").post(auth, deleteLeaveRequest);
router
  .route("/leave/delete-request-accept/:leaveRequestId")
  .post(auth, acceptDeleteRequest);
router
  .route("/leave/delete-request-reject/:leaveRequestId")
  .post(auth, rejectDeleteRequest);

router.route("/leave/getEmployeeLeaveTable").get(auth, getEmployeeLeaveTable);
router
  .route("/leave/getLeaveTypesFunctionWithoutDefault")
  .get(auth, getLeaveTypesFunctionWithoutDefault);
router
  .route("/leave/getEmployeeSummaryTable")
  .get(auth, getEmployeeSummaryTable);
router
  .route("/leave/getEmployeeCurrentYearLeave")
  .get(auth, getEmployeeCurrentYearLeave);
router
  .route("/leave/getOrgEmployeeYearLeave/:id")
  .get(auth, getOrgEmployeeYearLeave);
router
  .route("/leave/getLeaveTableForEmployee/:id/:organizationId")
  .get(auth, getLeaveTableForEmployee);

router
  .route("/leave/getEmployeeSummaryForCurrentMonth")
  .get(auth, getEmployeeSummaryForCurrentMonth);
router.route("/leave/get-leaves-by-month").get(auth, getLeavesByMonth);
router.route("/leave/get-3-leaves-employee").get(auth, getEmployeeLast3Leaves);
router.route("/leave/getYearLeaves/:employeeId").get(auth, getAllLeaveByYear);
router.route("/leave/getAllLeaveForManager").get(auth, getAllLeaveForManager);
router
  .route("/leave/getYearLeaves/:employeeId/:year")
  .get(auth, getAllLeaveForYear);
router
  .route("/leave/getOrganizationAttendece/:organisationId")
  .get(auth, getOrganizationAttendence);
router
  .route("/leave/getOrganizationAttendece/:organisationId/:year")
  .get(auth, getOrganizationAttendenceByYear);
router
  .route("/leave/getDepartmentAttendece/:departmentId/:year")
  .get(auth, getDepartmentAttendence);
router
  .route("/leave/getLocationAttendece/:locationId/:year")
  .get(auth, getLocationAttendence);
router
  .route("/leave/getManagerEmployeeAttendence/:year/:month")
  .get(auth, getManagerEmployeeAttendence);
router
  .route("/leave/getManagerAttendence/:managerId/:year")
  .get(auth, getManagerAttendence);

module.exports = router;
router.route("/leave/getAbsent/:organizationId").post(auth, getAbsentEmployee);
router
  .route("/leave/getDeptAbsent/:organizationId")
  .get(auth, getDeptAbsentEmployee);
router
  .route("/leave/getTodaysAbsentUnderManager/:organizationId")
  .get(auth, getManagerAbsentEmployee);

router
  .route("/leave/get-leave-notification/:employeeId")
  .get(auth, getEmployeeNotificationWithFilter);

router
  .route("/leave/get-count-leave-notification/:employeeId")
  .get(auth, getEmployeeNotificationCountWithFilter);

router
  .route("/employee/leaves/:year/:month/:employeeId")
  .get(auth, getEmployeeLeaveByMonth);
module.exports = router;
