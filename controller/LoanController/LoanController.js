const catchAssyncError = require("../../middleware/catchAssyncError");
const {
  LoanManagementModal,
} = require("../../models/LoanManagement/LoanManagementSchema");
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
exports.addLoanData = catchAssyncError(async (req, res, next) => {
  try {
    const userId = req.user.user._id;
    const { organizationId } = req.params;
    const profile = req.user.user.profile;
    const {
      loanType,
      rateOfInterest,
      loanAmount,
      loanDisbursementDate,
      loanCompletedDate,
      noOfEmi,
      loanPrincipalAmount,
      loanInterestAmount,
      totalDeduction,
      totalDeductionWithSi,
      rateOfIntereset,
    } = req.body;

    const user = await EmployeeModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let file_url = null;
    if (req.file) {
      file_url = await uploadImage(req.file, user, "loandocument-images");
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

    const newLoanData = new LoanManagementModal({
      loanType,
      rateOfInterest,
      loanAmount,
      loanDisbursementDate,
      loanCompletedDate,
      noOfEmi,
      loanPrincipalAmount,
      loanInterestAmount,
      totalDeduction,
      totalDeductionWithSi,
      file: file_url,
      rateOfIntereset,
      userId,
      organizationId,
      approvalIds,
      notificationCount: 1
    });
    console.log("newData", newLoanData);
    await newLoanData.save();

    return res.status(201).json({
      success: true,
      data: newLoanData,
      message: "Loan data added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to add the loan data ",
      details: error.message,
    });
  }
});
exports.updateLoanData = catchAssyncError(async (req, res, next) => {
  try {
    const userId = req.user.user._id;
    const { organizationId, loanId } = req.params;
    const profile = req.user.user.profile;
    const {
      loanType,
      rateOfInterest,
      loanAmount,
      loanDisbursementDate,
      loanCompletedDate,
      noOfEmi,
      loanPrincipalAmount,
      loanInterestAmount,
      totalDeduction,
      totalDeductionWithSi,
    } = req.body;

    const user = await EmployeeModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("file", req.file);
    let file_url = null;
    if (req.file) {
      file_url = await uploadImage(req.file, user, "edit-loan-document-images");
    }

    const loan = await LoanManagementModal.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
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

    loan.loanType = loanType || loan.loanType;
    loan.rateOfIntereset = rateOfInterest || loan.rateOfIntereset;
    loan.loanAmount = loanAmount || loan.loanAmount;
    loan.loanDisbursementDate =
      loanDisbursementDate || loan.loanDisbursementDate;
    loan.loanCompletedDate = loanCompletedDate || loan.loanCompletedDate;
    loan.noOfEmi = noOfEmi || loan.noOfEmi;
    loan.loanPrincipalAmount = loanPrincipalAmount || loan.loanPrincipalAmount;
    loan.loanInteresetAmount = loanInterestAmount || loan.loanInteresetAmount;
    loan.totalDeduction = totalDeduction || loan.totalDeduction;
    loan.totalDeductionWithSi =
      totalDeductionWithSi || loan.totalDeductionWithSi;
    loan.file = file_url || loan.file;
    loan.approvalIds = approvalIds;

    await loan.save();

    return res.status(200).json({
      success: true,
      data: loan,
      message: "Loan data updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to update the loan data",
      details: error.message,
    });
  }
});
exports.DeleteLoanData = catchAssyncError(async (req, res, next) => {
  try {
    const userId = req.user.user._id;
    const organizationId = req.user.user.organizationId;
    const { loanId } = req.params;
    const loan = await LoanManagementModal.findOne({
      _id: loanId,
      userId: userId,
      organizationId: organizationId,
    });

    if (!loan) {
      return res
        .status(404)
        .json({ success: false, message: "Loan data not found" });
    }
    await LoanManagementModal.findByIdAndDelete(loanId);
    res.status(200).json({
      success: true,
      message: "Loan  data deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
exports.getLoanDataByUserId = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId, userId } = req.params;
    const loanData = await LoanManagementModal.find({
      userId,
      organizationId,
    }).populate("loanType");
    res.status(200).json({ success: true, data: loanData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

exports.getEmpLaonApplRequestToHr = catchAssyncError(async (req, res, next) => {
  try {
    const userIds = req.user.user._id;
    const organizationId = req.user.user.organizationId;
    const pendingLoans = await LoanManagementModal.find({
      $or: [{ approvalIds: userIds }],
      organizationId: organizationId,
      status: "Pending",
    }).populate("userId");

    res.status(200).json({ success: true, data: pendingLoans });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

exports.getLoanOfSpecificEmployee = catchAssyncError(async (req, res, next) => {
  try {
    const { loanId } = req.params;
    const loan = await LoanManagementModal.findOne({
      _id: loanId,
      status: "Pending",
    })
      .populate("userId")
      .populate("loanType");
    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }
    loan.notificationCount = 0;
    await loan.save();

    res.status(200).json({ success: true, data: loan });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

exports.AcceptOrReject = catchAssyncError(async (req, res, next) => {
  try {
    const { loanId } = req.params;
    const { action } = req.body;
    // Check if the action is valid
    if (action !== "ongoing" && action !== "reject") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid action" });
    }

    // Update the loan document based on the action
    const updatedLoan = await LoanManagementModal.findByIdAndUpdate(
      loanId,
      { status: action === "ongoing" ? "Ongoing" : "Rejected" },
      { new: true }
    );

    if (!updatedLoan) {
      return res
        .status(404)
        .json({ success: false, message: "Loan not found" });
    }
    updatedLoan.acceptRejectNotificationCount = 1;
    await updatedLoan.save();
    res.status(200).json({ success: true, data: updatedLoan });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

exports.getEmpOngoingLoanData = catchAssyncError(async (req, res, next) => {
  try {
    const { userId, organizationId } = req.params;
    const onGoingLoanData = await LoanManagementModal.find({
      userId,
      organizationId,
      status: "Ongoing",
    });

    res.status(200).json({ success: true, data: onGoingLoanData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

exports.getEmpLoanData = catchAssyncError(
  async (req, res, next) => {
    try {
      const userId = req.user.user._id;
      const organizationId = req.user.user.organizationId;
      console.log("organizaiton id", organizationId);

      const approvedRejectedData = await LoanManagementModal.find({
        userId: userId,
        organizationId: organizationId,
        status: { $in: ["Ongoing", "Rejected"] },
      }).populate(["userId", "approvalIds", "loanType"]);


      res.status(200).json({
        success: true, data: approvedRejectedData
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }
);


exports.getEmpLaonDataApprovedRejectedByHr = catchAssyncError(
  async (req, res, next) => {
    try {
      const userId = req.user.user._id;
      const organizationId = req.user.user.organizationId;
      console.log("organizaiton id", organizationId);
      await LoanManagementModal.updateMany(
        {
          userId: userId,
          organizationId: organizationId,
          status: { $in: ["Ongoing", "Rejected"] },
        },
        {
          $set: { acceptRejectNotificationCount: 0 }
        }
      );
      const approvedRejectedData = await LoanManagementModal.find({
        userId: userId,
        organizationId: organizationId,
        status: { $in: ["Ongoing", "Rejected"] },
      }).populate(["userId", "approvalIds", "loanType"]);


      res.status(200).json({
        success: true, data: approvedRejectedData
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }
);
