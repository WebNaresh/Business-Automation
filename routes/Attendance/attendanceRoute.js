const express = require("express");

const {
  addAttendanceData,
  getAllAttendanceData,
  getAttendanceDataById
} = require("../../controller/AttendanceBioController/attendanceBioController");
const auth = require("../../middleware/Auth");
const router = express.Router();

router
  .route("/organization/:organizationId/add-attendance-data")
  .post(auth, addAttendanceData);
router
  .route("/organization/:organizationId/get-attendance-data")
  .get(auth, getAllAttendanceData);
  router
  .route("/organization/:organizationId/attendance-data/:id")
  .get(auth, getAttendanceDataById);

module.exports = router;
