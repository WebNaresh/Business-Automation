const express = require("express");
const {
  createJobPosition,
  saveAsDraftJobPosition,
  updateJobPosition,
  getJobPosition,
  getJobPositionById,
  deleteJobPosition,
  getJobPositionToManager,
  acceptJobPosition,
  rejectJobPosition,
  sendNotificationToEmp,
  getOpenJobPosition,
} = require("../../controller/RecruitmentController/CreateRecruitmentController");
const auth = require("../../middleware/Auth");
const router = express.Router();

router
  .route("/organization/:organizationId/create-job-position")
  .post(auth, createJobPosition);

router
  .route("/organization/:organizationId/save-job-position")
  .post(auth, saveAsDraftJobPosition);

router
  .route("/organization/:organizationId/:jobPositionId/update-job-position")
  .put(auth, updateJobPosition);

router
  .route("/delete-job-position/:jobPositionId")
  .delete(auth, deleteJobPosition);

router
  .route("/organization/:organizationId/get-job-position/:role")
  .get(auth, getJobPosition);

router
  .route("/organization/:organizationId/:jobPositionId/get-job-position")
  .get(auth, getJobPositionById);

router.route("/get-job-position-to-manager").get(auth, getJobPositionToManager);

router
  .route("/:jobPositionId/accept-job-position")
  .put(auth, acceptJobPosition);

router
  .route("/:jobPositionId/reject-job-posistion")
  .put(auth, rejectJobPosition);

router.route("/get-notification-to-emp").get(auth, sendNotificationToEmp);

router.route("/get-open-job-position").get(auth, getOpenJobPosition);

module.exports = router;
