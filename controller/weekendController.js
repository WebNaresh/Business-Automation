const mongoose = require("mongoose");
const { WeekendModel } = require("../models/weekendSchema");
const catchAssyncError = require("../middleware/catchAssyncError");
const logger = require("../utils/logger/index");

exports.addDays = catchAssyncError(async (req, res, next) => {
  try {
    const { days, numbers, organizationId } = req.body;

    // Check if a document already exists for the given organizationId
    const existingDocument = await WeekendModel.findById({
      _id: organizationId,
    });

    if (existingDocument) {
      return res.status(400).json({
        message: "A Document already exists for the organizationId",
        existingDocument,
      });
    }

    const weekendDays = new WeekendModel({
      days,
      numbers,
      organizationId,
    });

    await weekendDays.save();

    res.status(201).json({
      message: "Everything is up to date",
      Days: weekendDays,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

exports.getWeekend = catchAssyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const days = await WeekendModel.find({
      organizationId: id,
    });

    res.status(201).json({
      message: "Days fetched successfully !",
      days: days,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});
exports.getWeekend2 = catchAssyncError(async (req, res, next) => {
  try {
    const days = await WeekendModel.findOne({
      organizationId: req.user.user.organizationId,
    });

    res.status(201).json({
      message: "days fetched successfully !",
      days: days,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});
exports.deleteWeekend = catchAssyncError(async (req, res, next) => {
  try {
    const { id } = req.params; // Use req.params to get the ID from the URL
    const weekend = await WeekendModel.findByIdAndDelete(id);

    res.status(201).json({
      message: "Weekend deleted successfully",
      weekend: weekend,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

exports.updateWeekend = catchAssyncError(async (req, res, next) => {
  const { id } = req.params;
  const { days } = req.body;

  try {
    const weekend = await WeekendModel.findByIdAndUpdate(
      { _id: id },
      { $set: { days: days } },
      { new: true }
    );

    res.status(201).json({
      message: "Weekend updated successfully.",
      weekend: weekend,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});
