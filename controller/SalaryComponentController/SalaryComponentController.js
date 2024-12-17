const catchAssyncError = require("../../middleware/catchAssyncError");
const {
  SalaryComponentModel,
} = require("../../models/SalaeryComponent/SalaryComponentSchema");

exports.AddSalaryComponent = catchAssyncError(async (req, res, next) => {
  try {
    const { income, deductions, totalSalary } = req.body;
    const { EmployeeId } = req.params;

    const updatedSalaryComponent = await SalaryComponentModel.findOneAndUpdate(
      { EmployeeId }, // Filter by EmployeeId
      {
        $set: {
          income: income,
          deductions: deductions,
          totalSalary,
          EmployeeId,
        },
      },
      {
        new: true, // Return the updated document
        upsert: true, // Create a new document if it doesn't exist
      }
    );

    return res.status(201).json({
      success: true,
      data: updatedSalaryComponent,
      message: "Salary component added successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to add salary component",
      details: error.message,
    });
  }
});

exports.getSalaryComponentById = catchAssyncError(async (req, res, next) => {
  try {
    const { EmployeeId } = req.params;
    const getSalaryComponent = await SalaryComponentModel.findOne({
      EmployeeId,
    });
    res.status(200).json({ success: true, data: getSalaryComponent });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

exports.deleteSalaryComponentById = catchAssyncError(async (req, res, next) => {
  try {
    const { empId, id } = req.params; // 'id' refers to the income or deduction item to be deleted

    // Find the salary component of the employee
    const salaryComponent = await SalaryComponentModel.findOne({ EmployeeId: empId });

    if (!salaryComponent) {
      return res
        .status(404)
        .json({ success: false, message: "Salary component not found" });
    }

    // Filter out the salary component from both income and deductions arrays
    const originalIncomeCount = salaryComponent.income.length;
    const originalDeductionsCount = salaryComponent.deductions.length;

    salaryComponent.income = salaryComponent.income.filter(
      (item) => item._id.toString() !== id
    );

    salaryComponent.deductions = salaryComponent.deductions.filter(
      (item) => item._id.toString() !== id
    );

    // Check if anything was actually deleted
    const incomeDeleted = originalIncomeCount !== salaryComponent.income.length;
    const deductionsDeleted = originalDeductionsCount !== salaryComponent.deductions.length;

    // If no item was found to delete, return a 404 response
    if (!incomeDeleted && !deductionsDeleted) {
      return res.status(404).json({ success: false, message: "Item not found in income or deductions" });
    }

    // Save the updated salary component after removing the item
    const updatedSalaryComponent = await salaryComponent.save();

    res.status(200).json({
      success: true,
      message: incomeDeleted ? "Income item deleted" : "Deduction item deleted",
      data: updatedSalaryComponent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
