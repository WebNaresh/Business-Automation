const {
  createAndUpdatePFSetup,
  getPFSetup,
} = require("../controller/PFSetupController");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/Auth");

router
  .route("/PfEsic/:orgId")
  .put(auth, createAndUpdatePFSetup)
  .get(auth, getPFSetup);

module.exports = router;
