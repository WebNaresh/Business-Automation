// employeeController a User
const catchAssyncError = require("../../middleware/catchAssyncError");
const {
  LeaveTypeModel,
  LeaveTypeDetailModel,
} = require("../../models/leaves/leave-schma");

exports.getAllLeaveTypesByOrganizationId = catchAssyncError(
  async (req, res, next) => {
    try {
      const { organisationId } = req.body;
      console.log(`🚀 ~ organisationId:`, organisationId);
      console.log(`🚀 ~ user.user:`, req.user.user);

      const leaveTypeDocument = await LeaveTypeDetailModel.find({
        organisationId: organisationId,
        count: { $ne: -1 },
      });

      if (!leaveTypeDocument) {
        return res.status(404).json({
          message: "No leave types found for the given organization ID.",
        });
      }

      res.status(200).json({
        message: "Leave types retrieved successfully.",
        data: leaveTypeDocument,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message || "Server Error" });
    }
  }
);
exports.removeLeaveTypeDetails = catchAssyncError(async (req, res, next) => {
  try {
    console.log(`🚀 ~  req.params:`, req.params);
    const { leaveTypeDetails } = req.params;

    // Check if the leave type exists for the given organization ID
    const leaveType = await LeaveTypeDetailModel.findByIdAndDelete(
      leaveTypeDetails
    );

    if (!leaveType) {
      return res.status(404).json({
        message:
          "Leave type not found or already deleted successfully for given organization ID.",
      });
    }

    // Delete the leave type
    res.status(200).json({ message: "Leave type deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
});
exports.updateLeaveTypeDetails = catchAssyncError(async (req, res, next) => {
  try {
    const { leaveTypeDetails } = req.params;
    const { leaveName, isActive, color, count } = req.body;

    // Check if the leave type exists for the given name
    const leaveType = await LeaveTypeDetailModel.findByIdAndUpdate(
      leaveTypeDetails,
      {
        $set: {
          leaveName,
          isActive,
          color,
          count: Number(count),
        },
      },
      { new: true } // This option returns the modified document
    );

    if (!leaveType) {
      return res.status(404).json({
        message: "Leave type not found for the given name.",
      });
    }

    res
      .status(200)
      .json({ message: "Leave type updated successfully", leaveType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
});

exports.addLeaveTypeDetails = catchAssyncError(async (req, res, next) => {
  try {
    const { organisationId } = req.params;
    const { leaveName, isActive, color, count } = req.body;

    // Check if required fields are missing
    if (
      !leaveName.trim() ||
      !color.trim() ||
      (count && !count.toString().trim())
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const existingLeave = await LeaveTypeDetailModel.findOne({
      leaveName,
      organisationId,
    });
    console.log(existingLeave);
    if (existingLeave) {
      return res
        .status(400)
        .json({ message: "Current Leave name already existed" });
    }

    // Create a new LeaveTypeDetail
    const newLeaveTypeDetail = new LeaveTypeDetailModel({
      leaveName,
      isActive,
      color,
      count,
      organisationId: organisationId,
    });

    // Save the new LeaveTypeDetail to the database
    const savedLeaveTypeDetail = await newLeaveTypeDetail.save();

    // Find the LeaveType and add the new LeaveTypeDetail
    const leaveType = await LeaveTypeModel.findOneAndUpdate(
      { organisationId: organisationId },
      { $push: { leaveTypes: savedLeaveTypeDetail._id } },
      { new: true }
    ).populate("leaveTypes");

    // Send a success response with the updated LeaveType
    res.status(201).json({
      message: "Leave type details added successfully.",
      data: leaveType,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
});

exports.getLeaveTypesFunctionWithoutDefault = async (organisationId) => {
  try {
    const leaveTypeDocument = await LeaveTypeDetailModel.find({
      organisationId: organisationId,
      count: { $ne: -1 },
    });

    return leaveTypeDocument;
  } catch (error) {
    console.error(error);
  }
};

exports.getLeaveTypesFunctionWithDefault = async (organisationId) => {
  try {
    const leaveTypeDocument = await LeaveTypeModel.findOne({
      organisationId: organisationId,
    }).populate("leaveTypes");

    if (!leaveTypeDocument) {
      return [];
    }

    return leaveTypeDocument;
  } catch (error) {
    console.error(error);
  }
};
