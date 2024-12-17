const catchAssyncError = require("../../middleware/catchAssyncError");
const {
  AdvanceSalaryModel,
} = require("../../models/AdvanceSalarySchema/AdvanceSalarySchema");
const { EmployeeModel } = require("../../models/employeeSchema");
const { OrganisationModel } = require("../../models/organizationSchema");
const { generateSignedUrl, uploadImage } = require("../../utils/s3");

exports.uploadImage = catchAssyncError(async (req, res, next) => {
  try {
    const url = await generateSignedUrl();
    res.status(200).json({ url });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    res.status(500).json({ message: "Failed to generate signed URL" });
  }
});
exports.addAdvanceSalary = catchAssyncError(async (req, res, next) => {
  try {
    const userId = req.user.user._id;
    const { organizationId } = req.params;
    const profile = req.user.user.profile;
    const {
      advanceSalaryStartingDate,
      noOfMonth,
      advanceSalaryEndingDate,
      advancedSalaryAmounts,
      totalSalary,
    } = req.body;

    const user = await EmployeeModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let file_url = null;
    if (req.file) {
      console.log("file", req.file);
      file_url = await uploadImage(req.file, user, "advancesalary-images");
      console.log("file url", file_url);
    }

    const organization = await OrganisationModel.findById(
      organizationId
    ).select("creator");
    const hrIds = await EmployeeModel.find({
      organizationId: organizationId,
      profile: "HR",
    }).select("_id");

    const hrIdList = hrIds.map((hr) => hr._id);
    let approvalIds = [...hrIdList, organization.creator];

    if (profile.includes("HR")) {
      // Exclude the applying HR's ID from the approvalIds
      approvalIds = approvalIds.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    const newAdvanceSalary = new AdvanceSalaryModel({
      advanceSalaryStartingDate,
      noOfMonth,
      advanceSalaryEndingDate,
      advancedSalaryAmounts,
      totalSalary: totalSalary,
      file: file_url,
      userId,
      organizationId,
      approvalIds,
      notificationCount: 1
    });

    await newAdvanceSalary.save();

    return res.status(201).json({
      success: true,
      data: newAdvanceSalary,
      message: "Advance salary added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to apply for advance salary ",
      details: error.message,
    });
  }
});

exports.updateAdvanceSalary = catchAssyncError(async (req, res, next) => {
  try {
    const userId = req.user.user._id;
    const { organizationId, advanceSalaryId } = req.params;
    const profile = req.user.user.profile;
    const {
      advanceSalaryStartingDate,
      noOfMonth,
      advanceSalaryEndingDat,
      advancedSalaryAmounts,
    } = req.body;

    const user = await EmployeeModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let file_url = null;
    if (req.file) {
      file_url = await uploadImage(
        req.file,
        user,
        "edit-advance-salary-images"
      );
    }

    const advanceSalary = await AdvanceSalaryModel.findById(advanceSalaryId);
    if (!advanceSalary) {
      return res.status(404).json({ message: "Advance salary data not found" });
    }

    const organization = await OrganisationModel.findById(
      organizationId
    ).select("creator");
    const hrIds = await EmployeeModel.find({
      organizationId: organizationId,
      profile: "HR",
    }).select("_id");

    const hrIdList = hrIds.map((hr) => hr._id);
    let approvalIds = [...hrIdList, organization.creator];

    if (profile.includes("HR")) {
      // Exclude the applying HR's ID from the approvalIds
      approvalIds = approvalIds.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    advanceSalary.advanceSalaryStartingDate =
      advanceSalaryStartingDate || advanceSalary.advanceSalaryStartingDate;
    advanceSalary.advanceSalaryEndingDate =
      advanceSalaryEndingDat || advanceSalary.advanceSalaryEndingDate;
    advanceSalary.noOfMonth = noOfMonth || advanceSalary.noOfMonth;
    advanceSalary.advancedSalaryAmounts =
      advancedSalaryAmounts || advanceSalary.advancedSalaryAmounts;
    advanceSalary.file = file_url || advanceSalary.file;
    advanceSalary.approvalIds = approvalIds;

    await advanceSalary.save();

    return res.status(200).json({
      success: true,
      data: advanceSalary,
      message: "Advance salary updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to update the advance salary data",
      details: error.message,
    });
  }
});
exports.DeleteAdvanceSalaryData = catchAssyncError(async (req, res, next) => {
  try {
    const userId = req.user.user._id;
    const organizationId = req.user.user.organizationId;
    const { advanceSalaryId } = req.params;
    const advanceSalary = await AdvanceSalaryModel.findOne({
      _id: advanceSalaryId,
      userId: userId,
      organizationId: organizationId,
    });

    if (!advanceSalary) {
      return res
        .status(404)
        .json({ success: false, message: "Advance salary data not found" });
    }
    await AdvanceSalaryModel.findByIdAndDelete(advanceSalaryId);
    res.status(200).json({
      success: true,
      message: "Advance salary data deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
exports.getAdvanceSalaryDataByUserId = catchAssyncError(
  async (req, res, next) => {
    try {
      const { organizationId, userId } = req.params;
      const advanceSalaryData = await AdvanceSalaryModel.find({
        userId,
        organizationId,
      });
      console.log(advanceSalaryData, "advanceSalaryData");
      res.status(200).json({ success: true, data: advanceSalaryData });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }
);

exports.getAdvanceSalary = catchAssyncError(async (req, res, next) => {
  try {
    const userIds = req.user.user._id;
    const organizationId = req.user.user.organizationId;

    const pendingAdvanceSalary = await AdvanceSalaryModel.find({
      $or: [{ approvalIds: userIds }],
      organizationId: organizationId,
      status: "Pending",
    }).populate("userId");
    res.status(200).json({ success: true, data: pendingAdvanceSalary });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

exports.getAdvanceSalaryDateToHR = catchAssyncError(async (req, res, next) => {
  try {
    const userIds = req.user.user._id;
    const organizationId = req.user.user.organizationId;
    await AdvanceSalaryModel.updateMany(
      {
        $or: [{ approvalIds: userIds }],
        organizationId: organizationId,
        status: "Pending",
      },
      {
        $set: { notificationCount: 0 }
      }
    );
    const pendingAdvanceSalary = await AdvanceSalaryModel.find({
      $or: [{ approvalIds: userIds }],
      organizationId: organizationId,
      status: "Pending",
    }).populate("userId");
    res.status(200).json({ success: true, data: pendingAdvanceSalary });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
exports.AcceptOrRejectAdvanceSalaryData = catchAssyncError(
  async (req, res, next) => {
    try {
      const { advanceSalaryId } = req.params;
      const { action } = req.body;
      if (action !== "ongoing" && action !== "reject") {
        return res
          .status(400)
          .json({ success: false, message: "Invalid action" });
      }
      const updateAdvanceSalary = await AdvanceSalaryModel.findByIdAndUpdate(
        advanceSalaryId,
        { status: action === "ongoing" ? "Ongoing" : "Rejected" },
        { new: true }
      );
      if (!updateAdvanceSalary) {
        return res
          .status(404)
          .json({ success: false, message: "Advance salary data not found" });
      }
      updateAdvanceSalary.acceptRejectNotificationCount = 1;
      await updateAdvanceSalary.save();
      res.status(200).json({ success: true, data: updateAdvanceSalary });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }
);

exports.AdvanceSalaryEmpNotofication = catchAssyncError(async (req, res, next) => {
  try {
    const userId = req.user.user._id;
    const organizationId = req.user.user.organizationId;

    const advanceSalaryData = await AdvanceSalaryModel.find({
      userId: userId,
      organizationId: organizationId,
      status: { $in: ["Ongoing", "Rejected"] },
    }).populate(["userId", "approvalIds"]);

    res.status(200).json({ success: true, data: advanceSalaryData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

exports.sendNotificationToEmp = catchAssyncError(async (req, res, next) => {
  try {
    const userId = req.user.user._id;
    const organizationId = req.user.user.organizationId;

    const advanceSalaryData = await AdvanceSalaryModel.find({
      userId: userId,
      organizationId: organizationId,
      status: { $in: ["Ongoing", "Rejected"] },
    }).populate(["userId", "approvalIds"]);

    advanceSalaryData.forEach(async (advanceSalary) => {
      advanceSalary.acceptRejectNotificationCount = 0;
      await advanceSalary.save();
    });
    res.status(200).json({ success: true, data: advanceSalaryData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
