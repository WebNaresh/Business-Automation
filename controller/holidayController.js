const mongoose = require("mongoose");
const catchAssyncError = require("../middleware/catchAssyncError");
const { HolidayModel } = require("../models/holidaySchema");
const logger = require("../utils/logger/index");

exports.addHoliday = catchAssyncError(async (req, res, next) => {
  try {
    const { name, date, type, region, organizationId } = req.body;
    const existingNameEntry = await HolidayModel.find({
      name: name,
      organizationId: organizationId,
    });
    if (existingNameEntry.length > 0) {
      return res.status(500).json({ message: "Cannot add duplicate entries" });
    }
    const existingDateEntry = await HolidayModel.find({
      date: date,
      organizationId: organizationId,
    });
    console.log(
      `🚀 ~ file: holidayController.js:20 ~ existingDateEntry:`,
      existingDateEntry
    );
    if (existingDateEntry.length > 0) {
      return res
        .status(500)
        .json({ message: "Cannot add duplicate entries of same dates" });
    }
    const holiday = await HolidayModel.create({
      name,
      date,
      type,
      region,
      organizationId,
    });

    logger.info(holiday);

    res.status(201).json({
      message: "Holiday added successfully.",
      holiday: holiday,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

exports.getHolidays = catchAssyncError(async (req, res, next) => {
  try {
    const id = req.params.id;

    const holidays = await HolidayModel.find({ organizationId: id });

    res.status(201).json({
      message: "Holiday displayed successfully",
      holidays: holidays,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});
exports.deleteHoliday = catchAssyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const holiday = await HolidayModel.findByIdAndDelete({ _id: id });

    res.status(201).json({
      message: "Holiday deleted successfully",
      holidays: holiday,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

exports.updateHoliday = catchAssyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const ID = mongoose.Types.ObjectId(id);
    const { name, type, region, date, organizationId } = req.body;
    const orgId = mongoose.Types.ObjectId(organizationId);

    const requiredFields = {};
    if (name) requiredFields.name = name;
    if (type) requiredFields.type = type;
    if (region) requiredFields.region = region;
    if (date) requiredFields.date = new Date(date);
    const holiday = await HolidayModel.findByIdAndUpdate(
      { _id: ID },
      { $set: requiredFields },
      { new: true }
    );

    res.status(201).json({
      message: "holiday updated successfully",
      holidays: holiday,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

exports.getOneHoliday = catchAssyncError(async (req, res, next) => {
  try {
    const { id } = req.params;

    const holiday = await HolidayModel.findById({ _id: id });

    res.status(201).json({
      message: "Holiday found successfully",
      holidays: holiday,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

exports.getUpcomingHoliday = catchAssyncError(async (req, res, next) => {
  const { organizationId } = req.user.user;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  console.log(req.user.user);

  try {
    const holidays = await HolidayModel.find({
      organizationId: organizationId,
      date: { $gte: today },
    })
      .sort({ date: 1 })
      .limit(3);

    res.json({ upcomingHolidays: holidays });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
exports.checkHoliday = async (start, end, organizationId) => {
  console.log(
    `🚀 ~ file: holidayController.js:123 ~ start, end, organizationId:`,
    start,
    end,
    organizationId
  );

  // Extract date part from end date
  const endDateOnly = new Date(end).toISOString().split("T")[0];
  console.log(
    `🚀 ~ file: holidayController.js:132 ~ endDateOnly:`,
    endDateOnly
  );

  try {
    const holidays = await HolidayModel.findOne({
      organizationId: organizationId,
      date: {
        $gte: endDateOnly,
        $lt: new Date(endDateOnly + "T23:59:59.999Z"),
      },
    });
    console.log(`🚀 ~ file: holidayController.js:145 ~ holidays:`, holidays);
    return holidays;
  } catch (error) {
    console.error(error);
    return error;
  }
};
