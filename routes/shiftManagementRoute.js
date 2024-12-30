const express = require("express");
const {
  createShiftRequest,
  getShiftRequest,
  getShiftNotificationCountChange,
  updateShiftRequest,
  deleteShiftRequest,
  getShiftRequestForManager,
  acceptShiftRequest,
  rejectShiftRequest,
  getShiftRequestForAccountant,
  acceptShiftRequestAccountant,
  rejectShiftRequestAccountant,
  getShiftRequestForEmployee,
  getShiftRequestForEmployee2,
  getCountForAcc,
  saveAmountShiftAllowance,
  getShiftAllowanceForOrg,
  getShiftRequestofEmployee,
  updateShiftNotificationCount,
} = require("../controller/shiftManagement/selectedController");
// const { add } = require("winston");
const auth = require("../middleware/Auth");
const router = express.Router();
router.route("/shiftApply/create").post(auth, createShiftRequest);
router.route("/shift/update/notificationCount/:employeeId").put(auth, updateShiftNotificationCount);
router.route("/shiftApply/get").get(auth, getShiftRequest);
router.route("/updatenoticationshiftApplyEmployee/get").get(auth, getShiftNotificationCountChange);
router.route("/shiftApplyEmployee/get").get(auth, getShiftRequest);
router.route("/shiftApply/getForManager").get(auth, getShiftRequestForManager);
router
  .route("/shiftApply/getForAccountant/:organisationId")
  .get(auth, getShiftRequestForAccountant);
router.route("/shiftApply/update/:id").patch(auth, updateShiftRequest);
router.route("/shiftApply/delete/:id").delete(auth, deleteShiftRequest);
router
  .route("/shiftApply/postallowance/:id")
  .post(auth, saveAmountShiftAllowance);
router.route("/shiftApply/getallowance/:id").get(auth, getShiftAllowanceForOrg);
router
  .route("/shiftApply/getForEmp/:employeeId")
  .get(auth, getShiftRequestForEmployee);
router
  .route("/shiftApply/getForEmp2/:employeeId/:organisationId")
  .get(auth, getShiftRequestForEmployee2);

router.route("/shiftApply/accept/:id").post(auth, acceptShiftRequest);
router.route("/shiftApply/reject/:id").post(auth, rejectShiftRequest);
router.route("/shiftApply/getCount/:organisationId").get(auth, getCountForAcc);
router
  .route("/shiftApply/acceptAcc/:id")
  .post(auth, acceptShiftRequestAccountant);
router
  .route("/shiftApply/rejectAcc/:id")
  .post(auth, rejectShiftRequestAccountant);
router
  .route('/get/shifts/:employeeId')
  .get(auth, getShiftRequestofEmployee);
module.exports = router;
