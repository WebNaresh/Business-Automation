const catchAssyncError = require("../../middleware/catchAssyncError");
const { JobLevelModal } = require("../../models/JobLevelSchema/JobLevel");

exports.addJobLevel = catchAssyncError(async (req, res, next) => {
  try {
    const { jobLevel } = req.body;
    const creatorId = req.user.user._id;
    const { organizationId } = req.params;

    const addJobLevel = new JobLevelModal({
      jobLevel,
      organizationId,
      creatorId,
    });

    await addJobLevel.save();

    return res.status(201).json({
      success: true,
      data: addJobLevel,
      message: "Setup the job level successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to add the job level.",
      details: error.message,
    });
  }
});

exports.getJobLevel = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const getJobLevel = await JobLevelModal.find({ organizationId });
    if (!getJobLevel) {
      return res.status(404).json({ message: "No data found" });
    }
    res.status(200).json({ success: true, data: getJobLevel });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

exports.getJobLevelById = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId, jobLevelId } = req.params;
    const getJobLevelById = await JobLevelModal.findOne({
      _id: jobLevelId,
      organizationId,
    });
    res.status(200).json({ success: true, data: getJobLevelById });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

exports.updateJobLevelById = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId, jobLevelId } = req.params;
    const { jobLevel } = req.body;

    const existingJobLevelData = await JobLevelModal.findOne({
      _id: jobLevelId,
      organizationId,
    });
    if (!existingJobLevelData) {
      return res.status(404).json({ message: "No data  found" });
    }

    existingJobLevelData.jobLevel = jobLevel;

    await existingJobLevelData.save();

    return res.status(200).json({
      success: true,
      data: existingJobLevelData,
      message: "Job level updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update the communication",
      details: error.message,
    });
  }
});

exports.deleteJobLevelById = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId, jobLevelId } = req.params;

    const existingJobLevelData = await JobLevelModal.findOne({
      _id: jobLevelId,
      organizationId: organizationId,
    });

    if (!existingJobLevelData) {
      return res.status(404).json({ message: "No data  found" });
    }

    const deleteJobLevel = await JobLevelModal.findByIdAndDelete(jobLevelId);
    res.status(200).json({
      success: true,
      data: deleteJobLevel,
      message: "Job level deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete the job.",
      details: error.message,
    });
  }
});
