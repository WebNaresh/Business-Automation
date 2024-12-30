const express = require("express");
const {
  updateTheRemotePunching,
  getRemotePunchingObject,
  getEmployeeRemoteSet,
} = require("../../controller/RemotePunching/remote-punching-controller");
const auth = require("../../middleware/Auth");
const router = express.Router();
router
  .route("/remote-punch/:organizationId")
  .get(auth, getRemotePunchingObject)
  .post(auth, updateTheRemotePunching);

router
  .route("/remote-punch/get-employee-org-obj/org")
  .get(auth, getEmployeeRemoteSet);

module.exports = router;
