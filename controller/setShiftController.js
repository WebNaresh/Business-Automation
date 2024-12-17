const catchAssyncError = require("../middleware/catchAssyncError");
const { ShiftModel } = require("../models/setShiftsSchema");
const mongoose = require("mongoose");

exports.getShifts = catchAssyncError(async (req, res, next) => {
  const { organisationId } = req.params;
  try {
    const shifts = await ShiftModel.find({ organizationId: organisationId });
    res.status(200).json({ success: true, shifts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

exports.getAllShifts = catchAssyncError(async (req, res) => {
  try {
    const shifts = await ShiftModel.find({});
    res.status(200).json({ success: true, shifts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getSingleShift = catchAssyncError(async (req, res, next) => {
  const { organisationId } = req.user.user;
  const { id } = req.params;

  try {
    const shifts = await ShiftModel.findById({
      _id: id,
      organizationId: organisationId,
    });
    res.status(200).json({ success: true, shifts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "internal server error" });
  }
});
exports.setAllowanceForIndividualShift = catchAssyncError(
  async (req, res, next) => {
    const { id } = req.params;

    const { data } = req.body;
    console.log("in this controller", data);
    try {
      const shifts = await ShiftModel.findOne({
        _id: data.shiftId,
        organizationId: id,
      });
      console.log("just now", shifts);
      shifts.allowance = data.amount;
      shifts.save();
      res.status(200).json({ success: true, shifts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

exports.deleteShift = catchAssyncError(async (req, res, next) => {
  const { organisationId } = req.params;

  if (!mongoose.isValidObjectId(organisationId)) {
    return res.status(400).json({ success: false, error: "Invalid shift ID" });
  }

  try {
    const result = await ShiftModel.deleteOne({ _id: organisationId });

    if (result.deletedCount > 0) {
      res
        .status(200)
        .json({ success: true, message: "Shift deleted successfully." });
    } else {
      res.status(404).json({ success: false, error: "Shift not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

exports.updateShift = catchAssyncError(async (req, res, next) => {
  const { id } = req.params;

  const { workingFrom, shiftName, startTime, endTime, selectedDays , allowance } = req.body;

  const updateFields = {};
  if (workingFrom) updateFields.workingFrom = workingFrom;
  if (shiftName) updateFields.shiftName = shiftName;
  if (startTime) updateFields.startTime = startTime;
  if (endTime) updateFields.endTime = endTime;
  if (selectedDays) updateFields.selectedDays = selectedDays;
  if (allowance) updateFields.allowance = allowance;

  try {
    const result = await ShiftModel.updateOne(
      { _id: id },
      { $set: updateFields },
      { upsert: true }
    );

    return res
      .status(200)
      .json({ success: true, message: "Shift updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

exports.addShift = catchAssyncError(async (req, res, next) => {
  try {
    // Validate request body against the Shift schema
    const newShift = new ShiftModel(req.body);
    const { organizationId, shiftName } = req.body;
    // Check for existing user with the same shiftName and organizationId
    const existingShift = await ShiftModel.findOne({
      shiftName,
      organizationId,
    });
    if (existingShift) {
      return res.status(400).json({
        success: false,
        message: "Shift name already exists in this organization",
      });
    }

    const validationError = newShift.validateSync();

    if (validationError) {
      return res
        .status(400)
        .json({ success: false, error: validationError.message });
    }

    // Perform additional custom validation if needed
    const savedShift = await newShift.save();
    res.status(201).json({ success: true, savedShift });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
