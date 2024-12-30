const express = require("express");

const {
  addPunchingData,
  getPunchingData,
  getUnavailableRecords,
  getUnavailableRecordsEmployee,
  updatePunchingDataByEmployee,
  getUnavailableRecordstoApproval,
  updateApprovalIdByManager,
  acceptUnavailableRecord,
  rejectUnavailableRecord,
  approvedUnpaidLeave,
  approvedExtraShift,
  missedPunchRecordToHr,
  getMissedPunchNotificationToEmployee,
  getUnavailableRecordsByEmployeeId,
  deletePunchingRecord,
  getMachinePunchingRecordofEmployee,
  getEmployeeLeaveByDate,
  getMissedPunchUpdateNotificationToEmployee,
  getOthrOfEmployee,
} = require("../../controller/PunchingDataController/PunchingDataController");
const auth = require("../../middleware/Auth");
const router = express.Router();

router
  .route("/organization/:organizationId/punching-data")
  .post(auth, addPunchingData);
router
  .route(
    "/organization/:organizationId/update-punching-data/:unavailableRecordId"
  )
  .put(auth, updatePunchingDataByEmployee);
router
  .route("/organization/:organizationId/get-punching-info")
  .get(auth, getPunchingData);
router
  .route("/organization/:organizationId/get-unavaialble-record")
  .get(auth, getUnavailableRecords);
router
  .route("/organization/:organizationId/missed-punch-record-to-hr")
  .get(auth, missedPunchRecordToHr);
router
  .route("/organization/:organizationId/unavailable-record")
  .get(auth, getUnavailableRecordsEmployee);
router
  .route("/organization/:organizationId/unavailable-record/:EmployeeId")
  .get(auth, getUnavailableRecordsByEmployeeId);
router
  .route("/organization/:organizationId/unavailable-record-to-approval")
  .get(auth, getUnavailableRecordstoApproval);
router
  .route("/organization/:organizationId/update-approvalId/:recordId")
  .put(auth, updateApprovalIdByManager);
router
  .route("/organization/:organizationId/approved-unavailable-record/:recordId")
  .put(auth, acceptUnavailableRecord);
router
  .route("/organization/:organizationId/reject-unavailable-record/:recordId")
  .put(auth, rejectUnavailableRecord);
router
  .route(
    "/organization/:organizationId/approved-leave-unavailable-record/:recordId"
  )
  .put(auth, approvedUnpaidLeave);
router
  .route("/organization/:organizationId/approved-extra-shift-record/:recordId")
  .put(auth, approvedExtraShift);
router
  .route("/missed-punch-notification-to-employee")
  .get(auth, getMissedPunchNotificationToEmployee);
router
  .route("/missed-punch-update-notification-to-employee")
  .get(auth, getMissedPunchUpdateNotificationToEmployee);
router
  .route("/organization/:organizationId/delete-record/:recordId")
  .delete(auth, deletePunchingRecord);
router.route("/availableRecords").get(auth, getMachinePunchingRecordofEmployee);
router.route("/employee/leave/:date").get(auth, getEmployeeLeaveByDate);
router.route("/getOvertimeHour/:organizationId/:EmployeeId").get(auth, getOthrOfEmployee);

module.exports = router;
