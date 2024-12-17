const express = require("express");
const auth = require("../../middleware/Auth");
const {
  addCommunication,
  getCommunication,
  getCommunicationById,
  updateCommunicationById,
  deleteCommunicationById,
} = require("../../controller/CommunicationController/CommunicationController");
const router = express.Router();

router
  .route("/organization/:organizationId/add-communication")
  .post(auth, addCommunication);
router
  .route("/organization/:organizationId/get-communication")
  .get(auth, getCommunication);
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
