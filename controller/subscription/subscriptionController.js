// getSubscriptionInfo a User
const catchAssyncError = require("../../middleware/catchAssyncError");
const { OrganisationModel } = require("../../models/organizationSchema");
const {
  getSubscription,
  updateSubscriptionPlan,
  pauseSubscriptionPlan,
  resumeSubscriptionPlan,
} = require("../../utils/razorypay");

exports.getSubscriptionInfo = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.params;

    if (!organizationId) {
      return res.status(401).json({ message: "Required params not provided" });
    }
    const { subscriptionDetails } = await OrganisationModel.findById(
      organizationId
    );

    if (!subscriptionDetails) {
      return res
        .status(401)
        .json({ message: "Given organisation is not found" });
    }
    let { subscription } = await getSubscription(subscriptionDetails.id);

    if (!subscription) {
      return res.status(401).json({ message: "Given subscription not found" });
    }
    return res.status(200).json({ subscription });
  } catch (error) {
    console.error(`🚀 ~ file: subscriptionController.js:13 ~ error:`, error);
    res.status(401).json({ message: "Something went wrong at backend step" });
  }
});
exports.updateSubscription = catchAssyncError(async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;
    console.log(
      `🚀 ~ file: subscriptionController.js:41 ~ subscriptionId:`,
      subscriptionId
    );
    const { data } = req.body;
    console.log(req.body);
    console.log(`🚀 ~ file: subscriptionController.js:40 ~ data:`, data);

    if (!subscriptionId) {
      return res.status(401).json({ message: "Required params not provided" });
    }
    if (!data) {
      return res.status(401).json({ message: "Required data not provided" });
    }
    const { subscription, error } = await updateSubscriptionPlan(
      subscriptionId,
      data
    );
    console.log(
      `🚀 ~ file: subscriptionController.js:81 ~ subscription:`,
      subscription
    );
    console.log(`🚀 ~ file: subscriptionController.js:86 ~ error:`, error);

    const organisation = await OrganisationModel.findOneAndUpdate(
      {
        "subscriptionDetails.id": subscriptionId,
      },
      {
        $set: {
          subscriptionDetails: { ...subscription },
        },
      }
    );
    console.log(
      `🚀 ~ file: subscriptionController.js:56 ~ organisation:`,
      organisation
    );

    return res.status(200).json({ organisation });
  } catch (error) {
    console.error(`🚀 ~ file: subscriptionController.js:13 ~ error:`, error);
    res.status(401).json({ message: "Something went wrong at backend step" });
  }
});
exports.pauseSubscription = catchAssyncError(async (req, res, next) => {
  console.log(`🚀 ~ file: subscriptionController.js:81 ~ error:`, error);
  try {
    const { subscriptionId } = req.params;

    if (!subscriptionId) {
      return res.status(401).json({ message: "Required params not provided" });
    }

    const { subscription } = await pauseSubscriptionPlan(subscriptionId);

    const organisation = await OrganisationModel.findOneAndUpdate(
      {
        "subscriptionDetails.id": subscriptionId,
      },
      {
        $set: {
          subscriptionDetails: { ...subscription },
        },
      }
    );
    console.log(
      `🚀 ~ file: subscriptionController.js:56 ~ organisation:`,
      organisation
    );

    return res.status(200).json({ organisation });
  } catch (error) {
    console.error(`🚀 ~ file: subscriptionController.js:13 ~ error:`, error);
    res.status(401).json({ message: "Something went wrong at backend step" });
  }
});
exports.resumeSubscription = catchAssyncError(async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;
    console.log(`🚀 ~ file: subscriptionController.js resume`, subscriptionId);

    if (!subscriptionId) {
      return res.status(401).json({ message: "Required params not provided" });
    }

    const { subscription } = await resumeSubscriptionPlan(subscriptionId);
    console.log(
      `🚀 ~ file: subscriptionController.js:120 ~ subscription:`,
      subscription
    );

    const organisation = await OrganisationModel.findOneAndUpdate(
      {
        "subscriptionDetails.id": subscriptionId,
      },
      {
        $set: {
          subscriptionDetails: { ...subscription },
        },
      }
    );

    return res.status(200).json({ organisation });
  } catch (error) {
    console.error(`🚀 ~ file: subscriptionController.js:13 ~ error:`, error);
    res.status(401).json({ message: "Something went wrong at backend step" });
  }
});
