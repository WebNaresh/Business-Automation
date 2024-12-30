const express = require("express");
const {
  addAdvanceSalary,
  updateAdvanceSalary,
  DeleteAdvanceSalaryData,
  getAdvanceSalaryDataByUserId,
  getAdvanceSalaryDateToHR,
  AcceptOrRejectAdvanceSalaryData,
  sendNotificationToEmp,
  getAdvanceSalary,
  AdvanceSalaryEmpNotofication
} = require("../../controller/AdvanceSalaryController/AdvanceSalary");
const auth = require("../../middleware/Auth");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
  .route("/organization/:organizationId/add-advance-salary")
  .post(auth, upload.single("fileurl"), addAdvanceSalary);
router
  .route("/organization/:organizationId/:advanceSalaryId/update-advance-salary-data")
  .put(auth, upload.single("fileurl"), updateAdvanceSalary);
router
  .route("/delete-advance-salary-data/:advanceSalaryId")
  .delete(auth, DeleteAdvanceSalaryData);
router
  .route("/organization/:organizationId/:userId/get-advancesalary-data")
  .get(auth, getAdvanceSalaryDataByUserId);
router
  .route("/advance-salary-data")
  .get(auth, getAdvanceSalary);
router
  .route("/pending-advance-salary-data")
  .get(auth, getAdvanceSalaryDateToHR);
router
  .route("/organization/accept/reject/advance-salary/:advanceSalaryId")
  .put(auth, AcceptOrRejectAdvanceSalaryData);
router
  .route("/advance-salary-notification-to-emp")
  .get(auth, AdvanceSalaryEmpNotofication);
router
  .route("/send-notification-to-emp")
  .get(auth, sendNotificationToEmp);
module.exports = router;
