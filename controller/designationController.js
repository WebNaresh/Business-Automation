const mongoose = require("mongoose");
const catchAssyncError = require("../middleware/catchAssyncError");
const Designation = require("../models/designationSchema");
const logger = require("../utils/logger/index");

exports.addDesignation = catchAssyncError(async (req, res, next) => {
  try {
    const { designationName, designationId, organizationId } = req.body;
    const creatorId = req.user.user._id;

    const existingNameEntry = await Designation.find({
      designationName,
      organizationId,
    });
    if (existingNameEntry.length > 0) {
      return res
        .status(500)
        .json({ message: "Designation name is already used" });
    }

    const existingIdEntry = await Designation.find({
      designationId,
      organizationId,
    });
    if (existingIdEntry.length > 0) {
      return res
        .status(500)
        .json({ message: "Designation id is already used" });
    }

    const designation = new Designation({
      designationName,
      designationId,
      organizationId,
      creatorId,
    });

    await designation.save();
    logger.info(designation);

    res.status(201).json({
      message: "Designation added successfully",
      designation: designation,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

exports.getDesignations = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const designations = await Designation.find({
      organizationId: organizationId,
    });
    return res.status(200).json({ designations });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

exports.getOneDesignation = catchAssyncError(async (req, res, next) => {
  try {
    const designationId = req.params.id;
    console.log(designationId);
    console.log(req.params);
    const designation = await Designation.findById({ _id: designationId });
    return res.status(200).json({ designation });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

exports.deleteDesignation = catchAssyncError(async (req, res, next) => {
  try {
    const designationId = req.params.id;
    const designation = await Designation.deleteOne({ _id: designationId });

    res.status(200).json({ message: designation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// exports.updateDesignation = catchAssyncError(async (req, res, next) => {
//   try {
//     const designationId  = req.params.id;
//     await Designation.findByIdAndUpdate({_id:designationId})

//     res.status(200).json({ message: "Designation updated successfully." });
//   } catch (error) {
//     logger.error(error, "message: server error");
//     res.status(500).json({ message: error.message });
//   }
// });

exports.updateDesignation = catchAssyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid designation ID" });
  }

  const { designationName, designationId } = req.body;
  console.log(`🚀 ~ file: designationController.js:109 ~ req.body:`, req.body);
  const updateFields = {};

  if (designationName) updateFields.designationName = designationName;
  if (designationId) updateFields.designationId = designationId;

  const result = await Designation.findByIdAndUpdate(
    { _id: id },
    { $set: updateFields },
    { new: true }
  );

  if (result) {
    return res.status(200).json({
      message: "Designation updated successfully.",
      designation: result,
    });
  } else {
    return res
      .status(404)
      .json({ error: "Designation not found or not modified." });
  }
});
