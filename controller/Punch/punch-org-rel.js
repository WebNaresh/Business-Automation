const catchAsyncError = require("../../middleware/catchAssyncError");
const {
  PunchOrgRelationModel,
} = require("../../models/Punch/punch-org-relation-model");

exports.getEmployees = catchAsyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.body;
    if (!organizationId) {
      return res.status(500).json({ message: "Please Provide necessary Data" });
    }
    const employees = await PunchOrgRelationModel.findOne({
      organizationId,
    }).populate("employees");
    return res.status(201).json({
      message: "Employees retrieved successfully.",
      employees,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
exports.addEmployee = catchAsyncError(async (req, res, next) => {
  try {
    const { organizationId, employeeId } = req.body;
    if ((!organizationId, !employeeId)) {
      return res.status(500).json({ message: "Please Provide necessary Data" });
    }
    await PunchOrgRelationModel.findOneAndUpdate(
      { organizationId },
      {
        $push: {
          employees: employeeId,
        },
      }
    );
    return res.status(201).json({
      message: "Employee Added successfully.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
exports.removeEmployee = catchAsyncError(async (req, res, next) => {
  try {
    const { organizationId, employeeId } = req.body;
    if ((!organizationId, !employeeId)) {
      return res.status(500).json({ message: "Please Provide necessary Data" });
    }
    await PunchOrgRelationModel.findOneAndUpdate(
      { organizationId },
      {
        $pull: {
          employees: employeeId,
        },
      }
    );
    return res.status(201).json({
      message: "Employee Added successfully.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
