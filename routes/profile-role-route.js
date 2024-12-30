const express = require("express");
const router = express.Router();
const auth = require("../middleware/Auth");
const {
  updateRoles,
  getRoles,
} = require("../controller/union-roles-controller/role-controller");

router.route("/profile/role/:organisationId").get(auth, getRoles);
router.route("/profile/role/:organisationId").patch(auth, updateRoles);
// router.route("/profile/role/:organisationId").patch(auth, updateRoles);
module.exports = router;
