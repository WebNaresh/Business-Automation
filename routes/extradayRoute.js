const express = require("express");
const {
  addExtraDay,
  getExtraDay,
} = require("../controller/extraDayController");
const router = express.Router();
const auth = require("../middleware/Auth");

router.route("/add/extra-day").post(auth, addExtraDay);
router.route("/get/extra-day").get(auth, getExtraDay);

module.exports = router;
