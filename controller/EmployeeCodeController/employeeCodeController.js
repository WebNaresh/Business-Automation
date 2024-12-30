const {
  EmployeeCodeModel,
} = require("../../models/employeeCodeGenerator/employeeCodeSchema");
const catchAssyncError = require("../../middleware/catchAssyncError");

exports.createEmployeeCode = catchAssyncError(async (req, res, next) => {
  try {
    const { code } = req.body;
    const creatorId = req.user.user._id;
    const { organizationId } = req.params;

    // Save employee code to the database
    const newEmployeeCode = new EmployeeCodeModel({
      code: code,
      organizationId,
      creatorId,
    });

    await newEmployeeCode.save();

    return res.status(201).json({
      success: true,
      data: newEmployeeCode,
      message: "Employee code generated succssfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to create the employee code generator",
      details: error.message,
    });
  }
});

exports.getEmployeeCode = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const getEmployeeCode = await EmployeeCodeModel.find({ organizationId });
    if (!getEmployeeCode) {
      return res.status(404).json({ message: "Employee code not found" });
    }
    res.status(200).json({ success: true, getEmployeeCode });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

exports.getEmpCodeById = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId, empCodeId } = req.params;
    const getEmpCodeData = await EmployeeCodeModel.findOne({
      _id: empCodeId,
      organizationId,
    });
    res.status(200).json({ success: true, data: getEmpCodeData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

exports.updateEmployeeCode = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId, employeeCodeId } = req.params;
    const { code } = req.body;

    // find the existing employee code id
    const existingEmployeeCode = await EmployeeCodeModel.findOne({
      _id: employeeCodeId,
      organizationId,
    });
    if (!existingEmployeeCode) {
      return res.status(404).json({ message: "Employee code not found" });
    }

    existingEmployeeCode.code = code;

    await existingEmployeeCode.save();
    return res.status(200).json({
      success: true,
      data: existingEmployeeCode,
      message: "Employee code updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update the employee code",
      details: error.message,
    });
  }
});

exports.deleteEmployeeCode = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId, employeeCodeId } = req.params;

    const existingEmployeeCode = await EmployeeCodeModel.findOne({
      _id: employeeCodeId,
      organizationId: organizationId,
    });

    if (!existingEmployeeCode) {
      return res.status(404).json({
        message: "Employee code not found.",
      });
    }

    const deleteEmployeeCode = await EmployeeCodeModel.findByIdAndDelete(
      employeeCodeId
    );
    res.status(200).json({
      success: true,
      data: deleteEmployeeCode,
      message: "Employee code deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete the employee code",
      details: error.message,
    });
  }
});
