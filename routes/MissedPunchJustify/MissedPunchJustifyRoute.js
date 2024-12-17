const express = require("express");
const {
  addMissJustifyData
} = require("../../controller/MissedPunchJustifyController/MissedPunchJustifyController");
const auth = require("../../middleware/Auth");
const router = express.Router();

router
  .route("/organization/:organizationId/add-missed-data")
  .post(auth, addMissJustifyData);

module.exports = router;
