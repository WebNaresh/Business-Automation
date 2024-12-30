const express = require("express");
const {
  addHoliday,
  getHolidays,
  deleteHoliday,
  updateHoliday,
  getOneHoliday,
  getUpcomingHoliday,
} = require("../controller/holidayController");
const router = express.Router();
const auth = require("../middleware/Auth");

router.route("/holiday/create").post(addHoliday);
router.route("/holiday/get/:id").get(getHolidays);
router.route("/holiday/getone/:id").get(getOneHoliday);
router.route("/holiday/delete/:id").delete(deleteHoliday);
router.route("/holiday/update/:id").patch(updateHoliday);
router.route("/holiday/getUpcomingHoliday").get(auth, getUpcomingHoliday);

module.exports = router;
