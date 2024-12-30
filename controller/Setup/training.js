const catchAsyncError = require("../../middleware/catchAssyncError");
const {
  OrganizationTrainingModel,
} = require("../../models/Setup/training-Model/model");

exports.getOrganizationTrainingDetails = catchAsyncError(async (req, res) => {
  try {
    let organizationTraining;

    organizationTraining = await OrganizationTrainingModel.findOne({
      organizationId: req.params.organizationId,
    });

    if (!organizationTraining) {
      organizationTraining = await OrganizationTrainingModel.create({
        organizationId: req.params.organizationId,
      });
    }

    return res.status(200).json({
      message: "Organization Training Details",
      data: organizationTraining,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
exports.updateOrganizationTrainingDetails = catchAsyncError(
  async (req, res) => {
    try {
      const {
        canManagerAssign,
        canDeptHeadAssign,
        canHRAssign,
        collectPoints,
        canHRDefinePoints,
        usePointsForExternal,
        trainingType,
      } = req.body;

      await OrganizationTrainingModel.findOneAndUpdate(
        {
          organizationId: req.params.organizationId,
        },
        {
          $set: {
            canManagerAssign,
            canDeptHeadAssign,
            canHRAssign,
            collectPoints,
            canHRDefinePoints,
            usePointsForExternal,
            trainingType,
          },
        },
        {
          new: true,
        }
      );

      return res.status(200).json({
        message: "Organization Training updated successfully",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);
