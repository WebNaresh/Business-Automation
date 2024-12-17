const express = require("express");
const auth = require("../../middleware/Auth");
const {
  sendEmailCommunication,
  saveForLatterEmailCommunication,
  getEmailCommunication,
  updateEmailCommunication,
  deleteEmailCommunicationById,
} = require("../../controller/EmailCommunicationController/EmailCommunicationController");
const router = express.Router();

router
  .route("/organization/:organizationId/sendEmail-communication")
  .post(auth, sendEmailCommunication);
router
  .route("/organization/:organizationId/saveEmail-communication")
  .post(auth, saveForLatterEmailCommunication);
router
  .route("/organization/:organizationId/getEmail-communication")
  .get(auth, getEmailCommunication);
  router
  .route("/organization/:organizationId/updateEmail-communication/:emailCommunicationId")
  .put(auth, updateEmailCommunication);
router
  .route(
    "/organization/:organizationId/deleteEmailCommunication/:emailCommunicationId"
  )
  .delete(auth, deleteEmailCommunicationById);

module.exports = router;
