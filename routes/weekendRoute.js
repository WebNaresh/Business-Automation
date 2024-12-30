const express = require("express");
const {
  addDays,
  getWeekend,
  deleteWeekend,
  updateWeekend,
  getWeekend2,
} = require("../controller/weekendController");
const auth = require("../middleware/Auth");
const router = express.Router();
router.route("/weekend/create").post(addDays);
// router.route("/email/getone/:id").get(getOneEmail);
router.route("/weekend/get").get(auth, getWeekend2);
router.route("/weekend/get/:id").get(getWeekend);
router.route("/weekend/delete/:id").delete(deleteWeekend);
router.route("/weekend/edit/:id").patch(updateWeekend);

module.exports = router;
