const catchAssyncError = require("../../middleware/catchAssyncError");
const {
  SelectedShiftModel,
} = require("../../models/shiftManagement/selectedShiftSchema");
const mongoose = require("mongoose");
const {
  EmployeeManagementModel,
} = require("../../models/employeManager/employeeManagementSchema");
const { EmployeeModel } = require("../../models/employeeSchema");
const { error } = require("winston");
const {
  ShiftAllowanceModal,
} = require("../../models/shiftManagement/shiftAllowanceSchema");

exports.createShiftRequest = catchAssyncError(async (req, res, next) => {
  try {
    const { title, start, end } = req.body;
    const approverId = await EmployeeManagementModel.findOne({
      reporteeIds: { $in: [req.user.user._id] },
    }).populate("organizationId");

    const superAdmin = await EmployeeModel.findOne({
      _id: req.user.user._id,
    }).populate("organizationId");

    console.log("superAdmin", superAdmin);

    const testMId = mongoose.Types.ObjectId("65d86569d845df6738f87646");
    console.log("user is ", req.user.user.organizationId);
    const accountant = await EmployeeModel.findOne({
      organizationId: req.user.user.organizationId,
      profile: {
        $in: ["Accountant"],
      },
    });

    const newShift = new SelectedShiftModel({
      title,
      start,
      end,
      employeeId: req.user.user._id,
      managerId: approverId ? approverId?.managerId : superAdmin?.creatorId,
      accountantId: accountant?._id,
      status: "Pending",
      accountantStatus: "Pending",
      notificationCount: 1
    });
    console.log(req);

    await newShift.save();
    res
      .status(200)
      .json({ success: true, message: "document is created successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//update notification count
exports.updateShiftNotificationCount = catchAssyncError(async (req, res, next) => {
  try {
    const { employeeId } = req.params;

    const shifts = await SelectedShiftModel.find({ employeeId: employeeId });

    if (shifts.length === 0) {
      return res.status(404).json({ success: false, message: "No shifts found for this employee" });
    }

    // Update notificationCount for each shift
    const updatePromises = shifts.map(async (shift) => {
      shift.notificationCount = 0;
      return shift.save();
    });

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: "Notification counts reset successfully!",
      data: shifts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.updateShiftRequest = catchAssyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("my shift Id");

    const { title, start, end } = req.body;
    console.log("shiftData", title, start, end);
    const requiredFields = {};
    if (title) requiredFields.title = title;
    if (start) requiredFields.start = start;
    if (end) requiredFields.end = end;
    (requiredFields.status = "Pending"),
      (requiredFields.accountantStatus = "Pending");
    const newShiftReq = await SelectedShiftModel.findByIdAndUpdate(
      { _id: id },
      { $set: requiredFields },
      { new: true }
    );

    res.status(200).json({ success: true, newShiftReq });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getShiftRequest = catchAssyncError(async (req, res) => {
  try {
    const employeeId = req.user.user._id;
    const { status, minDate, maxDate, skip } = req.query;
    let query = { employeeId };
    if (status && status?.length > 0) {
      query.status = status;
    }
    if (minDate && maxDate) {
      query.start = {
        $gte: minDate,
        $lte: maxDate,
      };
    }
    const requests = await SelectedShiftModel.find(query)
      .populate("employeeId")
      .sort({ createdAt: -1 })
      .limit(skip ? 6 : undefined)
      .skip(skip ? Number(skip) * 6 : 0);

    res.status(200).json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//employee side notification count change api
exports.getShiftNotificationCountChange = catchAssyncError(async (req, res) => {
  try {
    const employeeId = req.user.user._id;
    const { status, minDate, maxDate, skip } = req.query;
    let query = { employeeId };

    if (status && status.length > 0) {
      query.status = status;
    }

    if (minDate && maxDate) {
      query.end = {
        $gte: new Date(minDate),
        $lte: new Date(maxDate),
      };
    }

    const requests = await SelectedShiftModel.find(query)
      .populate("employeeId")
      .sort({ createdAt: -1 })
      .limit(skip ? 6 : undefined)
      .skip(skip ? Number(skip) * 6 : 0);

    await SelectedShiftModel.updateMany(
      { _id: { $in: requests.map(req => req._id) } },
      { $set: { approveRejectNotificationCount: 0 } }
    );
    res.status(200).json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getShiftRequestofEmployee = catchAssyncError(async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { month, year } = req.query;

    // Convert month and year strings to numbers
    const numericMonth = parseInt(month);
    const numericYear = parseInt(year);

    console.log({ numericMonth, numericYear });

    // Ensure that month is between 1 and 12
    if (isNaN(numericMonth) || numericMonth < 1 || numericMonth > 12) {
      throw new Error("Invalid month value");
    }

    // Create UTC dates with numeric month and year
    const startDate = new Date(Date.UTC(numericYear, numericMonth - 1, 1));
    const endDate = new Date(
      Date.UTC(numericYear, numericMonth, 0, 23, 59, 59)
    );

    console.log({ startDate, endDate });

    // Perform MongoDB aggregation
    const shiftRequests = await SelectedShiftModel.aggregate([
      {
        $match: {
          employeeId: mongoose.Types.ObjectId(employeeId),
          start: { $gte: startDate, $lte: endDate },
          status: "Approved",
        },
      },
    ]);

    console.log("shift requests", shiftRequests);

    // Send response with the array of shift requests
    res.status(200).json({ shiftRequests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.getShiftRequestForManager = catchAssyncError(async (req, res) => {
  try {
    let userId;
    if (req?.user?.user?.profile?.includes("Delegate-Super-Admin")) {
      userId = req.user.user.creatorId;
    } else {
      userId = req.user.user._id;
    }
    console.log(`🚀 ~ req.user.user._id;:`, req.user.user._id);
    const requests = await SelectedShiftModel.find({
      status: "Pending",
      managerId: userId,
    }).populate("employeeId");
    console.log(`🚀 ~ requests:`, requests);

    let tempArray = [];
    const arrayOfEmployee = requests
      .map((item) => {
        if (item.employeeId && !tempArray.includes(item.employeeId._id)) {
          tempArray.push(item.employeeId._id);
          return item.employeeId;
        }
      })
      .filter((item) => item !== undefined);

    console.log(arrayOfEmployee);
    res.status(200).json({ success: true, requests, arrayOfEmployee });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// exports.getShiftRequestForAccountant = catchAssyncError(async (req, res) => {
//   try {
//     const testId = mongoose.Types.ObjectId(req.user.user._id);
//     // const { organizationId } = req.query;
//     const existingAllowance = await ShiftAllowanceModal.findOne({
//       organizationId: req.user.user.organizationId,
//     });
//     if (existingAllowance.check === true) {
//       const newReq = await SelectedShiftModel.find({
//         accountantId: testId,
//         accountantStatus: "Pending",
//         status: "Approved",
//       }).populate("employeeId");

//       console.log("accountant shiftReq", newReq);

//       let tempArray = [];
//       const arrayOfEmployee = newReq
//         .map((item) => {
//           if (item.employeeId && !tempArray.includes(item.employeeId._id)) {
//             tempArray.push(item.employeeId._id);
//             return item.employeeId;
//           }
//         })
//         .filter((item) => item !== undefined);

//       res.status(200).json({ success: true, newReq, arrayOfEmployee });
//     }
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });
exports.getShiftRequestForAccountant = catchAssyncError(async (req, res) => {
  const { organisationId } = req.params; // Get organisationId from params
  const loggedInAccountantEmail = req.user.user.email; // Get the logged-in accountant's email
  console.log("OrganisationId:", organisationId);

  try {
    const existingAllowance = await ShiftAllowanceModal.findOne({
      organizationId: organisationId,
    });

    if (existingAllowance && existingAllowance.check === true) {
      const newReq = await SelectedShiftModel.find({
        organizationId: organisationId,
        accountantStatus: "Pending",
        status: "Approved",
      }).populate("employeeId");

      console.log("Accountant shift requests:", newReq);

      let tempArray = [];
      const arrayOfEmployee = newReq
        .map((item) => {
          if (
            item.employeeId &&
            item.employeeId.organizationId.toString() === organisationId &&
            item.employeeId.email !== loggedInAccountantEmail &&
            !tempArray.includes(item.employeeId._id)
          ) {
            tempArray.push(item.employeeId._id);
            return item.employeeId;
          }
        })
        .filter((item) => item !== undefined);  // Remove undefined entries

      res.status(200).json({ success: true, newReq, arrayOfEmployee });
    } else {
      res.status(404).json({ success: false, message: "No allowance found or check is false" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.getShiftRequestForEmployee = catchAssyncError(async (req, res) => {
  try {
    const { employeeId } = req.params;
    const testId = mongoose.Types.ObjectId(req.user.user._id);
    const requests = await SelectedShiftModel.find({
      employeeId,
      status: "Pending",
      accountantStatus: "Pending",
      managerId: testId,
    }).populate("employeeId");
    res.status(200).json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// exports.getShiftRequestForEmployee2 = catchAssyncError(async (req, res) => {
//   try {
//     const { employeeId } = req.params;
//     const testId = mongoose.Types.ObjectId(req.user.user._id);
//     const existingAllowance = await ShiftAllowanceModal.findOne({
//       organizationId: req.user.user.organizationId,
//     });

//     const newReq = await SelectedShiftModel.find({
//       employeeId,
//       accountantId: testId,
//       status: "Approved",
//       accountantStatus: "Pending",
//     }).populate("employeeId");

//     await SelectedShiftModel.updateMany(
//       { _id: { $in: newReq.map(req => req._id) } },
//       { $set: { notificationAccCount: 0 } }
//     );

//     res.status(200).json({ success: true, newReq });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
exports.getShiftRequestForEmployee2 = catchAssyncError(async (req, res) => {
  try {
    const { employeeId, organisationId } = req.params;
    const existingAllowance = await ShiftAllowanceModal.findOne({
      organizationId: organisationId,
    });

    if (existingAllowance && existingAllowance.check === true) {
      const newReq = await SelectedShiftModel.find({
        employeeId,
        organizationId: organisationId,
        status: "Approved",
        accountantStatus: "Pending",
      }).populate("employeeId");

      await SelectedShiftModel.updateMany(
        { _id: { $in: newReq.map(req => req._id) } },
        { $set: { notificationAccCount: 0 } }
      );

      return res.status(200).json({ success: true, newReq });
    } else {
      return res.status(404).json({ success: false, message: "No allowance found or check is false" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// exports.getCountForAcc = catchAssyncError(async (req, res) => {
//   try {
//     const testId = mongoose.Types.ObjectId(req.user.user._id);
//     const newReq = await SelectedShiftModel.find({
//       accountantId: testId,
//       status: "Approved",
//       accountantStatus: "Pending",
//     }).populate("employeeId");

//     res.status(200).json({ success: true, newReq });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
exports.getCountForAcc = catchAssyncError(async (req, res) => {
  try {
    const { organisationId } = req.params;
    const testId = mongoose.Types.ObjectId(req.user.user._id);

    const existingAllowance = await ShiftAllowanceModal.findOne({
      organizationId: organisationId,
    });

    if (existingAllowance && existingAllowance.check === true) {
      const newReq = await SelectedShiftModel.find({
        organizationId: organisationId,
        status: "Approved",
        accountantStatus: "Pending",
      }).populate("employeeId");

      return res.status(200).json({ success: true, newReq });
    } else {
      return res.status(404).json({ success: false, message: "No allowance found or check is false" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.saveAmountShiftAllowance = catchAssyncError(async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    console.log("shift data", data);
    const existingAllowance = await ShiftAllowanceModal.findOne({
      organizationId: id,
    });

    if (!existingAllowance) {
      const allowanceModel = await ShiftAllowanceModal.create({
        check: data.dualWorkflow,
        organizationId: id,
      });
      res.status(200).json({ success: true, allowanceModel });
    } else {
      existingAllowance.check = data.dualWorkflow;
      await existingAllowance.save();
      res.status(200).json({ success: true, existingAllowance });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.getShiftAllowanceForOrg = catchAssyncError(async (req, res) => {
  try {
    const { id } = req.params;
    const existingAllowance = await ShiftAllowanceModal.findOne({
      organizationId: id,
    });
    res.status(200).json({ success: true, existingAllowance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.deleteShiftRequest = catchAssyncError(async (req, res) => {
  try {
    const { id } = req.params;
    const validId = mongoose.Types.ObjectId(id);

    const existingShift = await SelectedShiftModel.findById(validId);
    console.log("existing shift", existingShift);

    if (existingShift.status === "Approved") {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      const shiftEndDate = new Date(existingShift.end);

      const shiftEndMonth = shiftEndDate.getMonth() + 1;
      const shiftEndYear = shiftEndDate.getFullYear();

      const earliestDeletionMonth = currentMonth === 12 ? 1 : currentMonth + 1;
      const earliestDeletionYear =
        currentMonth === 12 ? currentYear + 1 : currentYear;

      const isAfterEarliestDeletionMonth =
        shiftEndYear > earliestDeletionYear ||
        (shiftEndYear === earliestDeletionYear &&
          shiftEndMonth >= earliestDeletionMonth);

      if (!isAfterEarliestDeletionMonth) {
        return res.status(403).json({
          success: false,
          message: "cannot delete the approved shift in the previous month",
        });
      }
    }

    const deletedShift = await SelectedShiftModel.findByIdAndDelete(validId);
    if (!deletedShift) {
      return res.status(404).json({
        success: false,
        message: "Shift not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//Accept shift request
exports.acceptShiftRequest = catchAssyncError(async (req, res, next) => {
  try {
    const { id } = req.params;

    const { message } = req.body;
    const userId = req.user.user._id;

    const user = await EmployeeModel.findOne({
      _id: userId,
      profiles: { $in: ["Manager"] },
    });

    if (user) {
      const shiftRequest = await SelectedShiftModel.findOneAndUpdate(
        { _id: id },
        {
          status: "Approved",
          accNotificationCount: 1,
          approveRejectNotificationCount: 1,
          // notificationAccCount: 1
        },
        { new: true }
      );

      if (shiftRequest) {
        res.status(200).json({
          shiftRequest,
          message: "Shift request accepted successfully.",
        });
      } else {
        res.status(404).json({ message: "Leave request not found." });
      }
    } else {
      res.status(403).json({ message: error.message });
    }
  } catch (error) {
    console.error(
      `🚀 ~ file: leave-requesation-controller.js:222 ~ error:`,
      error
    );
    res.status(500).json({ message: error.message });
  }
});

exports.rejectShiftRequest = catchAssyncError(async (req, res, next) => {
  try {
    const { message } = req.body;
    const { id } = req.params;
    const userId = req.user.user._id;
    const user = await EmployeeModel.findOne({
      _id: userId,
      profiles: { $in: ["Manager"] },
    });

    if (user) {
      const shiftRequest = await SelectedShiftModel.findByIdAndUpdate(
        id,
        {
          status: "Rejected",
          messageM: message || "Your Request is rejected",
        },
        { new: true }
      );

      if (shiftRequest) {
        res.status(200).json({
          shiftRequest,
          message: "Shift request rejected successfully.",
        });
      } else {
        res.status(404).json({ message: "Shift request not found." });
      }
    } else {
      res.status(403).json({ message: error.message });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    s;
  }
});
exports.rejectShiftRequestAccountant = catchAssyncError(
  async (req, res, next) => {
    try {
      const { message } = req.body;
      const { id } = req.params;
      const userId = req.user.user._id;
      const user = await EmployeeModel.findOne({
        _id: userId,
        profiles: { $in: ["Accountant"] },
      });

      if (user) {
        const shiftRequest = await SelectedShiftModel.findByIdAndUpdate(
          id,
          {
            accountantStatus: "Rejected",
            messageA: message || "Your Request is rejected",
          },
          { new: true }
        );

        if (shiftRequest) {
          res.status(200).json({
            shiftRequest,
            message: "Shift request rejected successfully.",
          });
        } else {
          res.status(404).json({ message: "Shift request not found." });
        }
      } else {
        res.status(403).json({ message: error.message });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

exports.acceptShiftRequestAccountant = catchAssyncError(
  async (req, res, next) => {
    try {
      const { message } = req.body;
      const { id } = req.params;
      const userId = req.user.user._id;
      const user = await EmployeeModel.findOne({
        _id: userId,
        profiles: { $in: ["Accountant"] },
      });

      if (user) {
        const shiftRequest = await SelectedShiftModel.updateOne(
          { _id: id },
          {
            accountantStatus: "Approved",
            approveRejectNotificationCount: 1
          },
          { new: true }
        );

        if (shiftRequest) {
          res.status(200).json({
            shiftRequest,
            message: "Shift request accepted successfully.",
          });
        } else {
          res.status(404).json({ message: "Leave request not found." });
        }
      } else {
        res.status(403).json({ message: error.message });
      }
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
);
