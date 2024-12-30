const express = require("express");
const {
  addShift,
  getShifts,
  deleteShift,
  updateShift,
  getSingleShift,
  getAllShifts,
  setAllowanceForIndividualShift,
} = require("../controller/setShiftController");
const auth = require("../middleware/Auth");
const router = express.Router();
router.route("/shifts/create").post(addShift);

router.route("/getSingleshifts/:id").get(auth, getSingleShift);
router.route("/getAllShifts").get(getAllShifts);
router.route("/shifts/:organisationId").get(auth, getShifts);
router.route("/shifts/:organisationId").delete(auth, deleteShift);
router.route("/shifts/:id").patch(auth, updateShift);
router
  .route("/shifts/setAllowance/:id")
  .post(auth, setAllowanceForIndividualShift);

module.exports = router;
