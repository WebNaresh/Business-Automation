const express = require("express");
const {
  getOrganizationTrainingDetails,
  updateOrganizationTrainingDetails,
} = require("../../controller/Setup/training");
const auth = require("../../middleware/Auth");

const router = express.Router();
router
  .route("/setup/training/:organizationId")
  .get(auth, getOrganizationTrainingDetails)
  .put(auth, updateOrganizationTrainingDetails);
module.exports = router;
