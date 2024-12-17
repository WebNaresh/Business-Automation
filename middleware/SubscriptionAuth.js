const jwt = require("jsonwebtoken");
const { EmployeeModel } = require("../models/employeeSchema");
const { getSubscription } = require("../utils/razorypay");

const subscriptionAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid authorization header" });
    }

    const decoded = jwt.verify(token, process.env.jWT_SECRETE);
    req.user = decoded.user;

    const existingUser = await EmployeeModel.findById(req.user?._id);
    if (!existingUser) {
      return res
        .status(401)
        .json({ message: "User not found", success: false });
    }

    const subscriptionId = existingUser.organizationId;
    const subscription = await OrganisationModel.findById(subscriptionId);
    if (!subscription) {
      return res
        .status(401)
        .json({ message: "Organization not found", success: false });
    }

    const subscriptionInfo = await getSubscription(subscription);
    req.subscriptionInfo = subscriptionInfo;

    next();
  } catch (error) {
    console.error("Error in subscriptionAuth middleware:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = subscriptionAuth;
