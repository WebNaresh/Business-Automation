const express = require("express");
const auth = require("../../middleware/Auth");
const {
  getTempPunchingData,
  createTempPunchingData,
} = require("../../controller/TempPunchingDataController/TempPunchingDataController");

const router = express.Router();

router
  .route("/organization/:organizationId/get-temp-punching-data")
  .get(auth, getTempPunchingData);

router.route("/temp-punching-data").post(auth, createTempPunchingData);

module.exports = router;
