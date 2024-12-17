const catchAssyncError = require("../../middleware/catchAssyncError");
const {
  ApplyJobPositionModel,
} = require("../../models/RecruitmentSchema/ApplyJobPositionSchema");
const { EmployeeModel } = require("../../models/employeeSchema");

exports.applyJobPosition = catchAssyncError(async (req, res, next) => {
  try {
    const employeeId = req.user.user._id;
    const organizationId = req.user.user.organizationId;

    const { email, empId, durationOfCurrentRole, yearsOfExperience } = req.body;

    const user = await EmployeeModel.findById(employeeId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let file_url = null;
    if (req.file) {
      console.log("file", req.file);
      file_url = await uploadImage(req.file, user, "advancesalary-images");
      console.log("file url", file_url);
    }

    const newAJobRole = new ApplyJobPositionModel({
      email,
      empId,
      durationOfCurrentRole,
      yearsOfExperience,
      file: file_url,
      employeeId,
      organizationId,
    });

    await newAJobRole.save();

    return res.status(201).json({
      success: true,
      data: newAdvanceSalary,
      message: "Application send successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to apply for job. ",
      details: error.message,
    });
  }
});
