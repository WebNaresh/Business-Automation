const express = require("express");
const {
  updateOrganization,
  addOrganization,
  getOrganization,
  getSingleOrganization,
  deleteOrganization,
  verifyCoupon,
  verifyOrganization,
  cancelSubscription,
  getSubscriptionDetails,
  updateSubscription,
  updateOrganizationStructure,
  createAndPayOrganization,
  upgradeOrganizationPlan,
  verifyUpgradePlan,
  currentOrganizationMembers,
  renewOrganizationPlan,
  verifyRenewPlan,
  verifyPayPlan,
  payOrganizationPlan,
  generateMisReport,
} = require("../controller/organizationController");
const auth = require("../middleware/Auth");
const multer = require("multer");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.route("/organization/create").post(auth, addOrganization);
// router.route("/organization/getall").get(auth, getAllOrgDetails);
router.route("/organization/get").get(auth, getOrganization);
router.route("/organization/connect").post(updateOrganization);
router.route(`/organization/get/:id`).get(getSingleOrganization);
router.route(`/organization/getmembers/:id`).get(currentOrganizationMembers);
router
  .route(`/organization/verify/:paymentType/:data`)
  .post(verifyOrganization);

router.route(`/organization/verify/coupon`).post(auth, verifyCoupon);

router
  .route(`/organization/subscription/:organizationId`)
  .get(getSubscriptionDetails);

router.route("/organization/delete/:id").delete(auth, deleteOrganization);
router
  .route("/organization/edit/:organizationId")
  .patch(upload.single("logo_url"), updateOrganizationStructure);
router.route("/organization").post(auth, createAndPayOrganization);

router
  .route("/organization/organization-upgrade/:organizationId")
  .post(auth, upgradeOrganizationPlan);
router
  .route("/organization/organization-renew/:organizationId")
  .post(auth, renewOrganizationPlan);
router
  .route("/organization/organization-pay/:organizationId")
  .post(auth, payOrganizationPlan);

router
  .route(
    "/organization/upgrade-organization/:organizationId/:paymentType/:data"
  )
  .post(verifyUpgradePlan);
router
  .route("/organization/renew-organization/:organizationId/:paymentType/:data")
  .post(verifyRenewPlan);
router
  .route("/organization/pay-organization/:organizationId/:paymentType/:data")
  .post(verifyPayPlan);

//TODO mis route don't remove it if your route is with it accept both
router
  .route("/mis/generateReport/:organizationId")
  .get(auth, generateMisReport);

http: module.exports = router;
