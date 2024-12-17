const express = require("express");
const auth = require("../../middleware/Auth");
const {
  addJobLevel,
  getJobLevel,
  getJobLevelById,
  updateJobLevelById,
  deleteJobLevelById,
} = require("../../controller/JobLevelController/JobLevel");

const router = express.Router();

router
  .route("/organization/:organizationId/add-job-level")
  .post(auth, addJobLevel);
router
  .route("/organization/:organizationId/get-job-level")
  .get(auth, getJobLevel);
router
  .route("/organization/:organizationId/:communicationId/get-communication")
  .get(auth, getCommunicationById);
router
  .route("/organization/:organizationId/:communicationId/update-communication")
  .put(auth, updateCommunicationById);
router
  .route("/organization/:organizationId/:communicationId/delete-communication")
  .delete(auth, deleteCommunicationById);

module.exports = router;
