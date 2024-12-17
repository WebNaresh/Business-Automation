//routes

const express = require("express");
const router = express.Router();
const {
  getOvertimeSettings,
  createOrUpdateOvertime,
} = require("../../controller/Overtime/OvertimeController");
const auth = require("../../middleware/Auth");
// GET
router.route("/get/:organizationId/overtime").get(auth, getOvertimeSettings);
// POST
router
  .route("/organization/:organizationId/overtime")
  .post(auth, createOrUpdateOvertime);

module.exports = router;
