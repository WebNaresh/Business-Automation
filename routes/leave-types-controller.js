const express = require("express");
const {
  getAllLeaveTypesByOrganizationId,
  removeLeaveTypeDetails,
  addLeaveTypeDetails,
  updateLeaveTypeDetails,
} = require("../controller/leave-types/leave-controller");
const auth = require("../middleware/Auth");
const router = express.Router();

router
  .route("/leave-types-details/:leaveTypeDetails")
  .post(auth, getAllLeaveTypesByOrganizationId)
  .delete(auth, removeLeaveTypeDetails)
  .patch(auth, updateLeaveTypeDetails);
router.route("/leave-types/:organisationId").post(auth, addLeaveTypeDetails);

module.exports = router;
