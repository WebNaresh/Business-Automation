// employeeController a User
const catchAssyncError = require("../middleware/catchAssyncError");
const Department = require("../models/Department/departmentSchema");
const { OrganisationModel } = require("../../models/organizationSchema");
const { EmployeeModel } = require("../../models/employeeSchema");
const {
  EmployeeManagementModel,
} = require("../../models/employeManager/employeeManagementSchema");
const mongoose = require("mongoose");

exports.getOrganisaitonEmployees = catchAssyncError(async (req, res, next) => {
  try {
    const employees = await EmployeeModel.find({
      organizationId: req.params.organizationId,
    });
    res.status(200).json({
      employees,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "error from function", error: error.message });
  }
});
