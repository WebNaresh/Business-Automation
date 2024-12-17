const express = require("express");
const {
  addCompOffLeave,
  getCompOffLeave,
} = require("../controller/compoffleavecontroller");
const router = express.Router();
const auth = require("../middleware/Auth");

router.route("/add/compOff").post(auth, addCompOffLeave);
router.route("/get/comp-off").get(auth, getCompOffLeave);

module.exports = router;
