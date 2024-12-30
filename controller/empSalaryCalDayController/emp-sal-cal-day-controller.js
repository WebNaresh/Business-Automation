const catchAssyncError = require("../../middleware/catchAssyncError");
const {
  EmployeeSalaryCalDayModel,
} = require("../../models/EmpSalaryCalDaySchema/EmpSalaryCalDaySchema");

exports.createEmployeeSalaryCalDay = catchAssyncError(
  async (req, res, next) => {
    try {
      const { organizationId } = req.params;
      const { selectedDay } = req.body;

      console.log("selectedDay", selectedDay);

      // Check if the selectedDay already exists
      const existingDay = await EmployeeSalaryCalDayModel.findOne({
        organizationId,
        selectedDay,
      });

      console.log("existingDay", existingDay);

      if (existingDay) {
        // If the selectedDay already exists, send an error response
        return res.status(400).json({
          success: false,
          message: "The selected day already exists.",
        });
      }

      const employeeSalaryCalDay = new EmployeeSalaryCalDayModel({
        organizationId,
        selectedDay,
      });

      // Save the employeeSalaryCalDay to the database
      await employeeSalaryCalDay.save();

      // Send a success response
      res.status(201).json({
        message: "Salary computation day created successfully.",
        success: true,
        employeeSalaryCalDay,
      });
    } catch (error) {
      console.log(error);
      // Handle other errors
      res.status(500).json({
        success: false,
        message: "An error occurred while creating the salary computation day.",
      });
    }
  }
);

exports.getEmployeeSalaryCalDays = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const empSalaryCalDayData = await EmployeeSalaryCalDayModel.find({
      organizationId,
    });

    return res.status(200).json({
      empSalaryCalDayData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

exports.getEmployeeSalaryCalDay = catchAssyncError(async (req, res, next) => {
  try {
    const { id, organizationId } = req.params;

    const empSalCalDayInfo = await EmployeeSalaryCalDayModel.findOne({
      _id: id,
      organizationId: organizationId,
    });

    if (!empSalCalDayInfo) {
      return res.status(404).json({
        message:
          "Salary computation day not found for the given in the organization",
      });
    }

    return res.status(200).json({
      empSalCalDayInfo,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});

exports.updateEmpSalCalDay = catchAssyncError(async (req, res, next) => {
  try {
    const { selectedDay } = req.body;
    const { id, organizationId } = req.params;

    const isIdExists = await EmployeeSalaryCalDayModel.findOne({
      _id: id,
      organizationId: organizationId,
    });

    if (!isIdExists) {
      return res.status(400).json({
        message: "No such salary computation day exists in the organization.",
        success: false,
      });
    }

    // Find the employee salary calculation day by ID and organization ID, update the selectedDay field
    const updateEmployeeSalaryCalDay =
      await EmployeeSalaryCalDayModel.findOneAndUpdate(
        { _id: id, organizationId: organizationId },
        { selectedDay },
        { new: true }
      );

    res.status(200).json({
      message: "Salary computation day updated successfully.",
      success: true,
      updateEmployeeSalaryCalDay,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
});

exports.deleteEmpSalCalDay = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId, empSalCalId } = req.params;

    const existingEmplSalCalId = await EmployeeSalaryCalDayModel.findOne({
      _id: empSalCalId,
      organizationId: organizationId,
    });

    if (!existingEmplSalCalId) {
      return res.status(404).json({
        message: "Salary computation day not found",
      });
    }

    const deleteEmplSalCalDay =
      await EmployeeSalaryCalDayModel.findByIdAndDelete(empSalCalId);
    res.status(200).json({
      success: true,
      data: deleteEmplSalCalDay,
      message: "Salary computation day deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete salary computation day ",
      details: error.message,
    });
  }
});
