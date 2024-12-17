const express = require("express");
const {
  createEmploymentType,
  getEmployementTypes,
  deleteEmploymentTypes,
  updateEmployementTypes,
  getEmployementType,
} = require("../controller/employmentType/employementTypeController");

const auth = require("../middleware/Auth");
const router = express.Router();

router.route("/employment-types/:organizationId").post(auth, createEmploymentType);
// .get(auth, getEmployementTypes);
router
  .route("/employment-types/:id")
  .delete(auth, deleteEmploymentTypes)
  .put(auth, updateEmployementTypes)
  .get(auth, getEmployementType);
router
  .route("/employment-types-organisation/:organizationId")
  .get(auth, getEmployementTypes);
module.exports = router;
