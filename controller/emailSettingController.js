const mongoose = require("mongoose");
const { EmailModel } = require("../models/emailSettingSchema");
const catchAssyncError = require("../middleware/catchAssyncError");
const logger = require("../utils/logger/index");

exports.addEmail = catchAssyncError(async (req, res, next) => {
  try {
    const { email, organizationId } = req.body;
    const newEmail = new EmailModel({
      email,
      organizationId,
    });

    await newEmail.save();
    logger.info(newEmail);

    res.status(201).json({
      message: "Email added successfully.",
      email: newEmail,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

exports.getEmail = catchAssyncError(async (req, res, next) => {
  const id = req.params.id;

  try {
    const emails = await EmailModel.find({ organizationId: id });
    res.status(200).json({ message: "Emails retrieved successfully.", emails });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
exports.deleteEmail = catchAssyncError(async (req, res, next) => {
  const id = req.params.id;
  try {
    const email = await EmailModel.findByIdAndDelete({ _id: id });
    res.status(200).json({ message: "Email deleted successfully.", email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
exports.editEmail = catchAssyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid designation ID" });
  }
  const { email } = req.body;
  const updateFields = {};
  if (email) updateFields.email = email;
  console.log(email);

  const result = await EmailModel.findByIdAndUpdate(
    { _id: id },
    { $set: updateFields },
    { new: true }
  );
  if (result) {
    return res.status(200).json({
      message: "Email updated successfully",
      designation: result,
    });
  } else {
    return res.status(404).json({ error: "Email not found or not modified" });
  }
});
exports.deleteEmail = catchAssyncError(async (req, res, next) => {
  const id = req.params.id;
  try {
    const email = await EmailModel.findByIdAndDelete({ _id: id });
    res.status(200).json({ message: "Email Deleted successfully", email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.getOneEmail = catchAssyncError(async (req, res, next) => {
  const id = req.params.id;
  try {
    const email = await EmailModel.findOne({ _id: id });
    res.status(200).json({ message: "Email found successfully", email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
