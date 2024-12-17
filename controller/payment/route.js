const mongoose = require("mongoose");
const catchAssyncError = require("../middleware/catchAssyncError");
const logger = require("../utils/logger/index");

exports.checkPayment = catchAssyncError(async (req, res, next) => {
  try {
    res.status(201).json({
      message: "Designation added successfully",
      designation: "designation",
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});
