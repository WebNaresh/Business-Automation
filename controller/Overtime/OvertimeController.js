const catchAssyncError = require("../../middleware/catchAssyncError");
const Overtime = require("../../models/Overtime/Overtime");

// create or update
exports.createOrUpdateOvertime = catchAssyncError(async (req, res, next) => {
  const { organizationId } = req.params;
  const {
    overtimeAllowed,
    minimumOvertimeHours,
    overtimeAllowanceRequired,
    allowanceParameter,
    allowanceAmount,
  } = req.body;

  if (!organizationId) {
    return res
      .status(400)
      .json({ success: false, message: "Organization ID is required" });
  }

  try {
    // Check if settings already exist
    let existingSettings = await Overtime.findOne({ organizationId });

    if (existingSettings) {
      // Update existing settings
      existingSettings.overtimeAllowed = overtimeAllowed;
      existingSettings.minimumOvertimeHours = minimumOvertimeHours;
      existingSettings.overtimeAllowanceRequired = overtimeAllowanceRequired;
      existingSettings.allowanceParameter = allowanceParameter;
      existingSettings.allowanceAmount = allowanceAmount;

      await existingSettings.save();

      return res.status(200).json({
        success: true,
        data: existingSettings,
        message: "Overtime settings updated successfully",
      });
    } else {
      // Create new settings if they don't exist
      const newSettings = new Overtime({
        organizationId,
        overtimeAllowed,
        minimumOvertimeHours,
        overtimeAllowanceRequired,
        allowanceParameter,
        allowanceAmount,
      });

      await newSettings.save();

      return res.status(201).json({
        success: true,
        data: newSettings,
        message: "Overtime settings added successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to process overtime settings",
      details: error.message,
    });
  }
});

// Get
exports.getOvertimeSettings = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const settings = await Overtime.findOne({ organizationId });

    if (!settings) {
      return res
        .status(404)
        .json({ success: false, message: "No settings found" });
    }

    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});
