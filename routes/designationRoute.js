const express = require("express");
const {
  addDesignation,
  getDesignations,
  getOneDesignation,
  deleteDesignation,
  updateDesignation,
} = require("../controller/designationController");
const auth = require("../middleware/Auth");
const router = express.Router();
router.route("/designation/create").post(auth, addDesignation);
router.route("/designation/create/:organizationId").get(getDesignations);
router.route("/designation/findone/:id").get(getOneDesignation);
router.route("/designation/create/:id").delete(deleteDesignation);
router.route("/designation/create/:id").patch(updateDesignation);

module.exports = router;
