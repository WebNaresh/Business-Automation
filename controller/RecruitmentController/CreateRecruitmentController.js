const catchAssyncError = require("../../middleware/catchAssyncError");
const {
  JobPositionModel,
} = require("../../models/RecruitmentSchema/CreateJobPositionSchema");

exports.createJobPosition = catchAssyncError(async (req, res, next) => {
  try {
    const {
      position_name,
      department_name,
      location_name,
      date,
      job_type,
      mode_of_working,
      job_level,
      job_description,
      role_and_responsibility,
      required_skill,
      hiring_manager,
      hiring_hr,
      education,
      experience_level,
      age_requirement,
      working_time,
    } = req.body;
    const creatorId = req.user.user._id;
    const { organizationId } = req.params;

    const newJobPosition = new JobPositionModel({
      position_name,
      department_name,
      location_name,
      date,
      job_type,
      mode_of_working,
      job_level,
      job_description,
      role_and_responsibility,
      required_skill,
      hiring_manager,
      hiring_hr,
      education,
      experience_level,
      age_requirement,
      working_time,
      isSaveDraft: true,
      approvalId: hiring_manager,
      organizationId,
      creatorId,
    });

    await newJobPosition.save();

    return res.status(201).json({
      success: true,
      data: newJobPosition,
      message: "Job position added  successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add job position",
      details: error.message,
    });
  }
});

exports.saveAsDraftJobPosition = catchAssyncError(async (req, res, next) => {
  try {
    const {
      position_name,
      department_name,
      location_name,
      date,
      job_type,
      mode_of_working,
      job_level,
      job_description,
      role_and_responsibility,
      required_skill,
      hiring_manager,
      hiring_hr,
      education,
      experience_level,
      age_requirement,
      working_time,
    } = req.body;
    const creatorId = req.user.user._id;
    const { organizationId } = req.params;

    const saveJobPosition = new JobPositionModel({
      position_name,
      department_name,
      location_name,
      date,
      job_type,
      mode_of_working,
      job_level,
      job_description,
      role_and_responsibility,
      required_skill,
      hiring_manager,
      hiring_hr,
      education,
      experience_level,
      age_requirement,
      working_time,
      approvalId: hiring_manager,
      organizationId,
      creatorId,
    });

    await saveJobPosition.save();

    return res.status(201).json({
      success: true,
      data: saveJobPosition,
      message: "Save job position successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to save job position successfully  ",
      details: error.message,
    });
  }
});

exports.updateJobPosition = catchAssyncError(async (req, res, next) => {
  try {
    const {
      position_name,
      department_name,
      location_name,
      date,
      job_type,
      mode_of_working,
      job_level,
      job_description,
      role_and_responsibility,
      required_skill,
      hiring_manager,
      hiring_hr,
      education,
      experience_level,
      age_requirement,
      working_time,
    } = req.body;
    const creatorId = req.user.user._id;
    const { organizationId, jobPositionId } = req.params;

    const updatedJobPosition = await JobPositionModel.findByIdAndUpdate(
      jobPositionId,
      {
        position_name,
        department_name,
        location_name,
        date,
        job_type,
        mode_of_working,
        job_level,
        job_description,
        role_and_responsibility,
        required_skill,
        hiring_manager,
        hiring_hr,
        education,
        experience_level,
        age_requirement,
        working_time,
        isSaveDraft: true,
        organizationId,
        creatorId,
      },
      { new: true }
    );
    if (!updatedJobPosition) {
      return res.status(404).json({
        success: false,
        message: "Job position not found",
      });
    }
    return res.status(201).json({
      success: true,
      data: updatedJobPosition,
      message: "Job position updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update job position communication",
      details: error.message,
    });
  }
});

exports.getJobPosition = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId, role } = req.params;
    const creatorId = req.user.user._id;

    let query = { organizationId };
    if (
      role !== "HR" &&
      role !== "Super-Admin" &&
      role !== "Delegate-Super-Admin"
    ) {
      query.creatorId = creatorId;
    }

    const getJobPositions = await JobPositionModel.find(query)
      .populate("organizationId")
      .populate("location_name");

    if (!getJobPositions.length) {
      return res.status(404).json({ message: "No data found" });
    }

    res.status(200).json({ success: true, data: getJobPositions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

exports.getJobPositionById = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId, jobPositionId } = req.params;
    const getJobPosition = await JobPositionModel.findOne({
      organizationId,
      _id: jobPositionId,
    })
      .populate("organizationId")
      .populate("location_name")
      .populate("department_name")
      .populate("hiring_manager")
      .populate("hiring_hr");

    if (!getJobPosition) {
      return res.status(404).json({ message: "No data found" });
    }
    res.status(200).json({ success: true, data: getJobPosition });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

exports.deleteJobPosition = catchAssyncError(async (req, res, next) => {
  try {
    const { jobPositionId } = req.params;

    const deleteJobPosition = await JobPositionModel.findByIdAndDelete(
      jobPositionId
    );

    res.status(200).json({
      success: true,
      data: deleteJobPosition,
      message: "Job position deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete job position",
      details: error.message,
    });
  }
});

exports.getJobPositionToManager = catchAssyncError(async (req, res, next) => {
  try {
    const hiring_manager = req.user.user._id;
    const organizationId = req.user.user.organizationId;

    const getJobPositionToManager = await JobPositionModel.find({
      organizationId,
      hiring_manager,
      isSaveDraft: true,
      status: "Pending",
    })
      .populate("creatorId")
      .populate("location_name")
      .populate("department_name");

    if (!getJobPositionToManager) {
      return res.status(404).json({ message: "No data found" });
    }
    res.status(200).json({ success: true, data: getJobPositionToManager });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

exports.acceptJobPosition = catchAssyncError(async (req, res, next) => {
  try {
    const organizationId = req.user.user.organizationId;
    const { jobPositionId } = req.params;

    let jobPosition = await JobPositionModel.findOne({
      organizationId,
      _id: jobPositionId,
    });

    if (!jobPosition) {
      return res
        .status(404)
        .json({ success: false, error: "Job position data not found." });
    }

    jobPosition.status = "Approved";
    jobPosition.isSaveDraft = "false";
    await jobPosition.save();

    res.status(200).json({
      success: true,
      message: "Job position approved successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to approved job position.",
      details: error.message,
    });
  }
});

exports.rejectJobPosition = catchAssyncError(async (req, res, next) => {
  try {
    const organizationId = req.user.user.organizationId;
    const { jobPositionId } = req.params;

    let jobPosition = await JobPositionModel.findOne({
      organizationId,
      _id: jobPositionId,
    });

    if (!jobPosition) {
      return res
        .status(404)
        .json({ success: false, error: "Job position data not found." });
    }
    jobPosition.status = "Rejected";
    jobPosition.isSaveDraft = "false";
    await jobPosition.save();

    res.status(200).json({
      success: true,
      message: "Job position approv successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to approved job position.",
      details: error.message,
    });
  }
});

exports.sendNotificationToEmp = catchAssyncError(async (req, res, next) => {
  try {
    const creatorId = req.user.user._id;
    const organizationId = req.user.user.organizationId;

    const getJobNotificationToEmp = await JobPositionModel.find({
      creatorId,
      organizationId,
      status: { $in: ["Approved", "Rejected"] },
    }).populate(["hiring_manager"]);

    res.status(200).json({ success: true, data: getJobNotificationToEmp });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

exports.getOpenJobPosition = catchAssyncError(async (req, res, next) => {
  try {
    const organizationId = req.user.user.organizationId;

    const getOpenJobPosition = await JobPositionModel.find({
      organizationId,
      status: "Approved",
    })
      .populate("creatorId")
      .populate("location_name")
      .populate("organizationId")
      .populate("department_name");

    if (!getOpenJobPosition) {
      return res.status(404).json({ message: "No data found" });
    }
    res.status(200).json({ success: true, data: getOpenJobPosition });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
