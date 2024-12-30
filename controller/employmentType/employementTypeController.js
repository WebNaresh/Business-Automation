const catchAssyncError = require("../../middleware/catchAssyncError");
const {
  EmploymentModel,
} = require("../../models/EmployementTypes/EmploymentTypesSchema");
exports.createEmploymentType = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    console.log(organizationId);
    const { title } = req.body;

    console.log(title, organizationId);

    if (!title) {
      return res.status(400).json({ message: "All fields are mandatory" });
    }

    const existingEmpTypes = await EmploymentModel.findOne({
      title,
      organizationId,
    });

    if (existingEmpTypes) {
      return res.status(400).json({
        success: false,
        error: "Employment type name already exists in this organization",
      });
    }

    const employMentType = new EmploymentModel({
      organizationId,
      title,
    });

    // Save the leave request to the database
    await employMentType.save();

    // Send a success response
    res.status(201).json({
      message: "An Employment Types  has been created.",
      success: true,
      employMentType: employMentType,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.getEmployementTypes = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const empTypes = await EmploymentModel.find({ organizationId });
    return res.status(200).json({
      empTypes,
    });
  } catch (err) {
    console.log(err);
  }
});

exports.getEmployementType = catchAssyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const empType = await EmploymentModel.findById({ _id: id });

    return res.status(200).json({
      empType,
    });
  } catch (err) {
    console.log(err);
  }
});

exports.deleteEmploymentTypes = catchAssyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const isIdExists = await EmploymentModel.find({
      _id: id,
    });

    if (!isIdExists)
      return res.status(400).json({ message: "Invalid ID", success: false });

    const deleteEmployeeType = await EmploymentModel.findByIdAndDelete({
      _id: id,
    });
    return res.status(200).json({
      message: "An Employment Types deleted successfully.",
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
});

exports.updateEmployementTypes = catchAssyncError(async (req, res, next) => {
  try {
    const { title } = req.body;
    const { id } = req.params;

    const isIdExists = await EmploymentModel.find({
      _id: id,
    });

    if (!isIdExists)
      return res.status(400).json({
        message: "No such employment types exists in organization",
        success: false,
      });

    // Find the holiday by ID
    const updateEmployeeType = await EmploymentModel.findByIdAndUpdate(
      id,
      { $set: { title } },
      { new: true }
    );

    res.status(200).json({
      message: "An Employment Types updated successfully",
      success: true,
      updateEmployeeType,
    });
  } catch (error) {
    console.log(error);
  }
});
