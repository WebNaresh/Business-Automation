// Checker a User
const catchAssyncError = require("../../middleware/catchAssyncError");
const {
  RemotePunchingModel,
} = require("../../models/RemotePunching/remote-punching");
const { EmployeeModel } = require("../../models/employeeSchema");

exports.updateTheRemotePunching = catchAssyncError(async (req, res, next) => {
  const {
    allowance,
    allowanceQuantity,
    dualWorkflow,
    geoFencing,
    faceRecognition,
  } = req.body;
  console.log(
    `🚀 ~ file: remote-punching-controller.js:10 ~ { allowance, allowanceQuantity, dualWorkflow } :`,
    { allowance, allowanceQuantity, dualWorkflow }
  );
  const { organizationId } = req.params;
  if (dualWorkflow === true) {
    let accountant = await EmployeeModel.findOne({
      profile: {
        $in: ["Accountant"],
      },
      organizationId,
    });
    console.log(
      `🚀 ~ file: remote-punching-controller.js:18 ~ accountant:`,
      accountant
    );
    if (!accountant) {
      return res
        .status(403)
        .json({ message: "Please add accountant in your organization" });
    }
    await RemotePunchingModel.findOneAndUpdate(
      { organizationId },
      {
        $set: {
          allowance,
          allowanceQuantity,
          dualWorkflow,
          accountantId: accountant._id,
          geoFencing,
          faceRecognition,
        },
      }
    );
  } else {
    await RemotePunchingModel.findOneAndUpdate(
      { organizationId },
      {
        $set: {
          allowance,
          allowanceQuantity,
          dualWorkflow,
          geoFencing,
          faceRecognition,
        },
      }
    );
  }

  return res
    .status(200)
    .json({ message: "Remote punching allowance is updated successfully" });
});
exports.getRemotePunchingObject = catchAssyncError(async (req, res, next) => {
  const { organizationId } = req.params;
  // check organizationId is valid mongoose id
  if (!organizationId) {
    return res.status(403).json({ message: "Please provide necessary data" });
  }

  let remotePunchingObject = await RemotePunchingModel.findOne({
    organizationId,
  });
  if (!remotePunchingObject) {
    remotePunchingObject = await RemotePunchingModel.create({ organizationId });
  }

  const responseObject = remotePunchingObject.toObject({
    getters: true,
    virtuals: true,
  });

  return res.status(200).json({
    message: "Remote punching allowance is updated successfully",
    remotePunchingObject: responseObject, // Sending plain object without circular references
  });
});

exports.getEmployeeRemoteSet = catchAssyncError(async (req, res, next) => {
  const { organizationId } = req.user.user;
  console.log(
    `🚀 ~ file: remote-punching-controller.js:95 ~  req.user.user:`,
    req.user.user
  );
  const employee = await RemotePunchingModel.findOne({ organizationId });
  if (!employee) {
    return res.status(404).json({ message: "No employee found" });
  }
  return res.status(200).json({ employee });
});
