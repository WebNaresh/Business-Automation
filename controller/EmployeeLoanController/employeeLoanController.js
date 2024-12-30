const { default: mongoose } = require("mongoose");
const catchAssyncError = require("../../middleware/catchAssyncError");
const {
  EmployeeLoanModel,
} = require("../../models/EmployeeLoanModal/EmployeeLoanSchema");

exports.addLoanType = catchAssyncError(async (req, res, next) => {
  try {
    const { loanName, loanValue, rateOfInterest, maxLoanValue } = req.body;
    const creatorId = req.user.user._id;
    const { organizationId } = req.params;

    const newLoanType = new EmployeeLoanModel({
      loanName,
      loanValue,
      maxLoanValue,
      rateOfInterest,
      organizationId,
      creatorId,
    });

    await newLoanType.save();

    return res.status(201).json({
      success: true,
      data: newLoanType,
      message: "Loan Type added succssfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to add the loan type ",
      details: error.message,
    });
  }
});
exports.getLoanType = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const getEmployeeLoan = await EmployeeLoanModel.find({ organizationId });
    if (!getEmployeeLoan) {
      return res.status(404).json({ message: "Loan type not found" });
    }
    res.status(200).json({ success: true, data: getEmployeeLoan });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
exports.getLoanTypeById = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId, loanTypeId } = req.params;
    const getLoanTypeById = await EmployeeLoanModel.findOne({
      _id: loanTypeId,
      organizationId,
    });
    res.status(200).json({ success: true, data: getLoanTypeById });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
exports.updateLoanType = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId, loanTypeId } = req.params;
    const { loanName, loanValue, rateOfInterest, maxLoanValue } = req.body;

    const existingLoanType = await EmployeeLoanModel.findOne({
      _id: loanTypeId,
      organizationId,
    });
    
    if (!existingLoanType) {
      return res.status(404).json({ message: "Loan type not found" });
    }

    existingLoanType.loanName = loanName;
    existingLoanType.loanValue = loanValue;
    existingLoanType.rateOfInterest = rateOfInterest;
    existingLoanType.maxLoanValue = maxLoanValue;

    await existingLoanType.save();
    return res.status(200).json({
      success: true,
      data: existingLoanType,
      message: "Loan type updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update the loan type",
      details: error.message,
    });
  }
});
exports.deleteLoanType = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId, loanTypeId } = req.params;

    const existingLoanType = await EmployeeLoanModel.findOne({
      _id: loanTypeId,
      organizationId: organizationId,
    });

    if (!existingLoanType) {
      return res.status(404).json({
        message: "Loan type not found.",
      });
    }

    const deleteLoanType = await EmployeeLoanModel.findByIdAndDelete(
      loanTypeId
    );
    res.status(200).json({
      success: true,
      data: deleteLoanType,
      message: "Loan type deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete the loan type",
      details: error.message,
    });
  }
});
