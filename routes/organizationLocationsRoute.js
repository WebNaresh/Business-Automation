const express = require("express");

const {
  addOrganizationLocations,
  getOrganizationLocations,
  updateOrganizationLocations,
  deleteOrganizationLocations,
} = require("../controller/organizationLocationsController");
const auth = require("../middleware/Auth");
const router = express.Router();
router
  .route("/location/addOrganizationLocations")
  .post(auth, addOrganizationLocations);
router
  .route("/location/getOrganizationLocations/:organizationId")
  .get(auth, getOrganizationLocations);
router
  .route("/location/deleteOrganizationLocations/:id")
  .delete(auth, deleteOrganizationLocations);
router
  .route("/location/updateOrganizationLocations/:id")
  .put(auth, updateOrganizationLocations);
// router.route("/location/addOrganizationLocations").post(auth, addOrganizationLocations);
// router.route("/location/getOrganizationLocations").get(auth, getOrganizationLocations)
// router.route("/location/deleteOrganizationLocations/:id").delete(auth, deleteOrganizationLocations)
// router.route("/location/updateOrganizationLocations/:id").put(auth, updateOrganizationLocations)

module.exports = router;
