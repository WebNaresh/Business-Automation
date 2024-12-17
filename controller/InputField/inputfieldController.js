const catchAssyncError = require("../../middleware/catchAssyncError");
const logger = require("../../utils/logger");

const {
  inputFieldModel,
  InputFieldDetailsModel,
} = require("../../models/InputField/inputFieldSchema");
const { EmployeeModel } = require("../../models/employeeSchema");
exports.getInputField = catchAssyncError(async (req, res, next) => {
  try {
    const { organisationId } = req.params;

    const validCreator = await EmployeeModel.findOne({
      _id: req.user.user._id,
    });

    if (!validCreator) {
      return res.status(400).json({ error: "Creator is not in database" });
    }

    const inputField = await inputFieldModel
      .findOne({ organisationId })
      .populate({
        path: "inputDetail",
        model: InputFieldDetailsModel, // Reference the model for population
        select: "-__v", // Exclude '__v' field if needed
      });

    if (!inputField) {
      return res.status(404).json({ message: "Input fields not found." });
    }

    res
      .status(200)
      .json({ message: "Input fields retrieved successfully.", inputField });
  } catch (error) {
    // Handle errors
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
});

exports.updateInputField = catchAssyncError(async (req, res, next) => {
  try {
    const { inputDetails } = req.body;

    // Validate if the user is a valid creator (if needed)
    const validCreator = await EmployeeModel.findOne({
      _id: req.user.user._id,
    });

    if (!validCreator) {
      return res.status(400).json({ error: "Creator is not in database" });
    }

    // Update multiple input field details
    const updatedFields = [];

    for (const { inputDetailId, isActive, label } of inputDetails) {
      const inputFieldDetail = await InputFieldDetailsModel.findById(
        inputDetailId
      );

      if (!inputFieldDetail) {
        return res.status(404).json({
          message: `Input field detail not found for ID: ${inputDetailId}`,
        });
      }

      inputFieldDetail.isActive = isActive;
      await inputFieldDetail.save();

      updatedFields.push({
        inputDetailId,
        isActive: inputFieldDetail.isActive,
        label,
      });
    }

    res.status(200).json({
      message: "Input field details updated successfully.",
      updatedFields,
    });
  } catch (error) {
    // Handle errors
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
});
