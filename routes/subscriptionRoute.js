const express = require("express");

const auth = require("../middleware/Auth");
const {
  getSubscriptionInfo,
  updateSubscription,
  pauseSubscription,
  resumeSubscription,
} = require("../controller/subscription/subscriptionController");
const router = express.Router();
// router.route("/subscription/:organizationId").get(auth, getSubscriptionInfo);
router
  .route("/subscription-status/:subscriptionId")
  .patch(auth, updateSubscription)
  .delete(auth, pauseSubscription)
  .get(auth, resumeSubscription);

module.exports = router;
