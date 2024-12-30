const express = require("express");
const router = express.Router();
const auth = require("../middleware/Auth");
const {
  getInputField,
  updateInputField,
} = require("../controller/InputField/inputfieldController");

router.route("/inputfield/:organisationId").get(auth, getInputField);
router.route("/inputfield/update/:organisationId").put(auth, updateInputField);
module.exports = router;
