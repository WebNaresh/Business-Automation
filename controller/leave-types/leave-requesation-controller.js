// createLeave a User
const catchAssyncError = require("../../middleware/catchAssyncError");
const {
  EmployeeManagementModel,
} = require("../../models/employeManager/employeeManagementSchema");
const {
  AttendanceModel,
} = require("../../models/leaves/leave-requesation-schema");

const { LeaveTypeDetailModel } = require("../../models/leaves/leave-schma");
const {
  getLeaveTypesFunction,
  getLeaveTypesFunctionWithoutDefault,
  getLeaveTypesFunctionWithDefault,
} = require("./leave-controller");
const { default: mongoose } = require("mongoose");
const dayjs = require("dayjs");
const { EmployeeModel } = require("../../models/employeeSchema");
const { LeaveManager } = require("../../utils/leave-function");
const { checkHoliday } = require("../holidayController");
const {
  EmployeeSummaryModel,
} = require("../../models/employeeSummarySchema/employeeSummarySchema");
const { DepartmentModel } = require("../../models/Department/departmentSchema");
const moment = require("moment");

async function hasOverlappingLeave(employeeId, start, end) {
  const overlappingLeave = await AttendanceModel.findOne({
    employeeId: employeeId,
    $or: [
      { start: { $gte: start, $lt: end } },
      { end: { $gt: start, $lte: end } },
      { $and: [{ start: { $lte: start } }, { end: { $gte: end } }] },
    ],
    status: { $in: ["Approved", "Pending"] },
  });

  return !!overlappingLeave;
}
const leaveManager = new LeaveManager();

exports.createLeave = catchAssyncError(async (req, res, next) => {
  try {
    const { start, end, color, leaveTypeDetailsId, _id } = req.body;
    const { role = "Employee", empId } = req.query;
    console.log(`🚀 ~ role:`, role);
    console.log("leaveTypeDetailsId", leaveTypeDetailsId);

    if (!start || !color || !leaveTypeDetailsId) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    console.log(`🚀 ~ _id:`, _id);
    if (_id) {
      console.log("this is running");
      const leaveTypeDetails = await LeaveTypeDetailModel.findById(
        leaveTypeDetailsId
      ).populate("organisationId");

      const approverId = await EmployeeManagementModel.findOne({
        reporteeIds: { $in: [empId ? empId : req.user.user._id] },
      });
      let mainApprover;

      if (!approverId) {
        mainApprover = await leaveTypeDetails.organisationId.creator;
      } else {
        mainApprover = approverId.managerId;
      }
      const oldLeave = await AttendanceModel.findByIdAndUpdate(
        _id,
        {
          employeeId: empId ? empId : req.user.user._id,
          description: leaveTypeDetails.leaveName,
          title: leaveTypeDetails.leaveName,
          start,
          end,
          color: role === "Manager" ? "green" : "#f2a81b",
          leaveTypeDetailsId,
          approverId: mainApprover,
          status: role === "Manager" ? "Approved" : "Pending",
          notificationCount: 1,
        },
        { new: true }
      );
      return res.status(201).json({
        message: "Leave request created successfully.",
        data: oldLeave,
      });
    } else {
      // Validate required fields

      // Check if there are overlapping leave dates
      const hasOverlap = await hasOverlappingLeave(
        role !== "Employee" ? empId : req.user.user._id,
        start,
        end
      );

      if (hasOverlap) {
        return res
          .status(400)
          .json({ message: "Leave request conflicts with existing leaves." });
      }

      // Check if the user has already applied for leave in the given range
      const existingLeave = await AttendanceModel.findOne({
        employeeId: req.user.user._id,
        start: { $lte: start },
        end: { $gte: end },
        status: { $in: ["Approved", "Pending"] },
      });

      if (existingLeave) {
        return res
          .status(400)
          .json({ message: "Leave request conflicts with existing leaves." });
      }

      const approverId = await EmployeeManagementModel.findOne({
        reporteeIds: { $in: [role === "HR" ? empId : req.user.user._id] },
      });

      // .populate("managerId.organizationId");
      const leaveTypeDetails = await LeaveTypeDetailModel.findById(
        leaveTypeDetailsId
      ).populate("organisationId");

      if (!approverId) {
        mainApprover = await leaveTypeDetails.organisationId.creator;
      } else {
        mainApprover = approverId.managerId;
      }

      let leaveRequest;
      if (leaveTypeDetails.leaveName === "Public Holiday") {
        const startDate = dayjs(start);
        const endDate = dayjs(end);
        const dayDifference = endDate.diff(startDate, "day");
        if (dayDifference !== 1) {
          return res.status(400).json({
            message: "date difference should only one day",
          });
        }
        const isHoliday = await checkHoliday(
          start,
          end,
          req.user.user.organizationId
        );

        if (isHoliday === null) {
          return res.status(403).json({
            message: "Sorry but it is not a holiday ",
          });
        }

        leaveRequest = new AttendanceModel({
          employeeId: role !== "Employee" ? empId : req.user.user._id,
          description: isHoliday.name,
          title: leaveTypeDetails.leaveName,
          start,
          end,
          color: role === "Manager" ? "green" : "#f2a81b",
          leaveTypeDetailsId,
          approverId: mainApprover,
          notificationCount: 1,
          status: role === "Manager" ? "Approved" : "Pending",
          creatorId: req.user.user._id,
        });
      } else {
        leaveRequest = new AttendanceModel({
          employeeId: role !== "Employee" ? empId : req.user.user._id,
          description: leaveTypeDetails.leaveName,
          title: leaveTypeDetails.leaveName,
          start,
          end,
          color: role === "Manager" ? "green" : "#f2a81b",
          leaveTypeDetailsId,
          approverId: mainApprover,
          notificationCount: 1,
          status: role === "Manager" ? "Approved" : "Pending",
          creatorId: req.user.user._id,
        });
      }

      // Save the leave request to the database
      console.log(`🚀 ~ leaveRequest:`, leaveRequest);
      const savedLeaveRequest = await leaveRequest.save();

      // Respond with success message and the saved leave request
      res.status(201).json({
        message: "Leave request created successfully",
        data: savedLeaveRequest,
      });
    }
  } catch (error) {
    // Handle errors (e.g., validation errors or other issues)
    console.error("Error creating leave request:", error.message);
    res
      .status(500)
      .json({ message: `Failed to create leave request: ${error.message}` });
  }
});

//update notification count
exports.updateLeaveNotificationCount = catchAssyncError(
  async (req, res, next) => {
    try {
      const { employeeId } = req.params;

      const leave = await AttendanceModel.find({
        employeeId: employeeId,
      }).populate(["employeeId", "leaveTypeDetailsId", "creatorId"]);

      if (leave.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No leaves found for this employee",
        });
      }

      // Update notificationCount for each shift
      const updatePromises = leave.map(async (leave) => {
        leave.notificationCount = 0;
        return leave.save();
      });

      await Promise.all(updatePromises);

      res.status(200).json({
        success: true,
        message: "Notification counts reset successfully!",
        data: leave,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

exports.getAllLeave = catchAssyncError(async (req, res, next) => {
  try {
    // Check if the user has isApprover set to true in any of their roles
    let userId;

    const { organizationId } = req.query;

    if (req.user.user.profile.includes("Delegate-Super-Admin")) {
      userId = req.user.user.creatorId;
    } else {
      userId = req.user.user._id;
    }

    let query = {
      approverId: userId,
      status: { $in: ["Pending", "Deleted"] },
    };

    const isApprover = await EmployeeManagementModel.findOne({
      managerId: req.user.user._id,
    }).populate("managerId");

    if (
      isApprover ||
      req?.user?.user?.profile?.includes("Super-Admin") ||
      req?.user?.user?.profile?.includes("Delegate-Super-Admin")
    ) {
      // User is an approver, allow the request to proceed
      const leaveRequests = await AttendanceModel.find(query)
        .populate(["employeeId", "leaveTypeDetailsId", "creatorId"])
        .sort({ createdAt: -1 });

      const tempArray = [];
      const arrayOfEmployee = leaveRequests.map((item) => {
        console.log(
          `🚀 ~ file: leave-requesation-controller.js:235 ~ item:`,
          item
        );
        if (organizationId) {
          if (
            item.employeeId !== null &&
            !tempArray.includes(item.employeeId._id) &&
            item?.employeeId?.organizationId.toString() === organizationId
          ) {
            tempArray.push(item.employeeId._id);
            return item.employeeId;
          }
        } else {
          if (
            item.employeeId !== null &&
            !tempArray.includes(item.employeeId._id)
          ) {
            tempArray.push(item.employeeId._id);
            return item.employeeId;
          }
        }
      });

      // Send the leave requests in the response
      res.status(200).json({ leaveRequests, arrayOfEmployee });
    } else {
      // User is not an approver, send a forbidden response
      res
        .status(403)
        .json({ message: "Access forbidden. User is not an approver." });
    }
  } catch (error) {
    console.error(`🚀 ~ error:`, error);
    // Handle errors and send an error response
    res.status(500).json({ message: "Server Error" || error.message });
  }
});

exports.getNotificationForEmps = catchAssyncError(async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    console.log("employeeId", employeeId);
    const isApprover = await EmployeeManagementModel.findOne({
      managerId: req.user.user._id,
    }).populate("managerId");
    let userId;
    if (req?.user?.user?.profile?.includes("Delegate-Super-Admin")) {
      userId = req.user.user.creatorId;
    } else {
      userId = req.user.user._id;
    }

    if (
      isApprover ||
      req?.user?.user?.profile?.includes("Super-Admin") ||
      req?.user?.user?.profile?.includes("Delegate-Super-Admin")
    ) {
      // get pending and deleted leave requests
      const leaveRequests = await AttendanceModel.find({
        employeeId,
        approverId: userId,
        status: {
          $in: ["Pending", "Deleted"],
        },
      })
        .populate(["employeeId", "leaveTypeDetailsId", "creatorId"])
        .sort({ createdAt: -1 });

      res.status(200).json({ leaveRequests });
    } else {
      res
        .status(403)
        .json({ message: "Access forbidden. User is not an approver." });
    }
  } catch (error) {
    console.error(`🚀 ~ error:`, error);
    res.status(500).json({ message: error.message });
  }
});

exports.acceptLeaveRequest = catchAssyncError(async (req, res, next) => {
  try {
    const { leaveRequestId } = req.params;

    const { message } = req.body; // Extract the message from the request body
    const userId = req.user.user._id; // Get the user ID from the request object

    // Check if the user is a manager
    const user = await EmployeeModel.findOne({
      _id: userId,
      profiles: { $in: ["Manager"] },
    });

    if (user) {
      const leaveRequest = await AttendanceModel.updateOne(
        { _id: leaveRequestId },
        {
          $set: {
            status: "Approved",
            approveRejectNotificationCount: 1,
            message: message || "Your Request is successfully approved",
            color: "green",
          },
        },
        { new: true }
      );

      if (leaveRequest) {
        res.status(200).json({
          leaveRequest,
          message: "Leave request accepted successfully.",
        });
      } else {
        res.status(404).json({ message: "Leave request not found." });
      }
    } else {
      res
        .status(403)
        .json({ message: "Access forbidden. User is not a Manager." });
    }
  } catch (error) {
    console.error(
      `🚀 ~ file: leave-requesation-controller.js:222 ~ error:`,
      error
    );
    res.status(500).json({ message: "Error accepting leave request." });
  }
});
exports.acceptDeleteRequest = catchAssyncError(async (req, res, next) => {
  try {
    const { leaveRequestId } = req.params;
    const userId = req.user.user._id; // Get the user ID from the request object

    // Check if the user is a manager
    const user = await EmployeeModel.findOne({
      _id: userId,
      profiles: { $in: ["Manager"] },
    });

    if (user) {
      const leaveRequest = await AttendanceModel.findByIdAndDelete(
        leaveRequestId
      );

      if (leaveRequest) {
        res.status(200).json({
          leaveRequest,
          message: "Leave request deleted successfully.",
        });
      } else {
        res.status(404).json({ message: "Leave request not found." });
      }
    } else {
      res
        .status(403)
        .json({ message: "Access forbidden. User is not a Manager." });
    }
  } catch (error) {
    console.error(
      `🚀 ~ file: leave-requesation-controller.js:222 ~ error:`,
      error
    );
    res.status(500).json({ message: "Error accepting leave request." });
  }
});

exports.rejectDeleteRequest = catchAssyncError(async (req, res, next) => {
  const { leaveRequestId } = req.params;
  const userId = req.user.user._id; // Get the user ID from the request object

  // Check if the user is a manager
  const user = await EmployeeModel.findOne({
    _id: userId,
    profiles: { $in: ["Manager"] },
  });

  if (user) {
    const leaveRequest = await AttendanceModel.findByIdAndUpdate(
      leaveRequestId,
      {
        $set: {
          status: "Approved",
          message: "Your Request is successfully rejected",
          color: "green",
        },
      },
      { new: true }
    );

    if (leaveRequest) {
      res.status(200).json({
        leaveRequest,
        message: "Leave request rejected successfully.",
      });
    } else {
      res.status(404).json({ message: "Leave request not found." });
    }
  } else {
    res
      .status(403)
      .json({ message: "Access forbidden. User is not a Manager." });
  }
});

exports.rejectLeaveRequest = catchAssyncError(async (req, res, next) => {
  try {
    const { message } = req.body; // Extract the message from the request body
    const { leaveRequestId } = req.params;
    const userId = req.user.user._id; // Get the user ID from the request object

    // Check if the user is a manager
    const user = await EmployeeModel.findOne({
      _id: userId,
      profiles: { $in: ["Manager"] },
    });

    if (user) {
      const leaveRequest = await AttendanceModel.findByIdAndUpdate(
        leaveRequestId,
        {
          $set: {
            status: "Rejected",
            message: message || "Your Request is successfully rejected",
            color: "red",
          },
        },
        { new: true }
      );

      if (leaveRequest) {
        res.status(200).json({
          leaveRequest,
          message: "Leave request rejected successfully.",
        });
      } else {
        res.status(404).json({ message: "Leave request not found." });
      }
    } else {
      res
        .status(403)
        .json({ message: "Access forbidden. User is not a Manager." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error rejecting leave request." });
    s;
  }
});

exports.remainingLeave = catchAssyncError(async (req, res, next) => {
  try {
    const totalLeaves = await AttendanceModel.find({
      employeeId: req.user.user._id,
      status: { $in: ["Approved", "Pending"] },
    });
    const organisationalLeaveTypes = await getLeaveTypesFunction(
      req.user.user.organizationId
    );
    res.status(200).json({
      totalLeaves,
      organisationalLeaveTypes,
    });
  } catch (error) {
    console.error(`🚀 ~ error:`, error);
    res.status(500).json({ message: "Error processing leave request." });
  }
});

exports.getEmployeeSummaryForCurrentMonth = catchAssyncError(
  async (req, res, next) => {
    try {
      // Assuming req.user.user contains the employee information, adapt this as needed

      // Your logic to fetch the monthly leave summary based on the employeeId
      const leaveTypes = await getLeaveTypesFunctionWithoutDefault(
        req.user.user.organizationId
      );
      const leaveTypesWithDefaultTypes = await getLeaveTypesFunctionWithDefault(
        req.user.user.organizationId
      );

      const currentMonthLeaves = await leaveManager.getMonthLeave(
        req.user.user._id
      );
      const currentYearLeaves = await leaveManager.getYearLeaves(
        req.user.user._id
      );

      res.status(200).json({
        leaveTypes,
        currentMonthLeaves,
        currentYearLeaves,
        leaveTypesWithDefaultTypes,
      });
    } catch (error) {
      console.error(`Error:`, error);
      res.status(500).json({ message: "Error fetching remaining leaves." });
    }
  }
);

exports.deleteLeaveRequest = catchAssyncError(async (req, res, next) => {
  try {
    const { leaveRequestId } = req.params;
    const { role, empId } = req.query;
    console.log(`🚀 ~ empId:`, empId);
    const { deleteReason } = req.body;
    const leaveRequest1 = await AttendanceModel.findById(leaveRequestId);
    console.log(`🚀 ~ leaveRequest1:`, leaveRequest1);
    if (!leaveRequest1)
      return res.status(404).json({ message: "Leave request not found." });

    if (leaveRequest1.status === "Pending") {
      await AttendanceModel.deleteOne({ _id: leaveRequestId });
      return res.status(201).json({
        message: "Leave Deleted successfully",
      });
    }
    const populated = await req.user.user.populate("organizationId");
    const organisation = populated.organizationId;

    const approverId = await EmployeeManagementModel.findOne({
      reporteeIds: { $in: [empId ? empId : req.user.user._id] },
    });

    let mainApprover;

    if (!approverId) {
      mainApprover = await organisation.creator;
    } else {
      mainApprover = approverId.managerId;
    }

    const leaveRequest = await AttendanceModel.findByIdAndUpdate(
      leaveRequestId,
      {
        $set: {
          status: role === "Manager" ? "Approved" : "Deleted",
          approverId: mainApprover,
          message: deleteReason,
          creatorId: req.user.user._id,
        },
      }
    );

    if (leaveRequest) {
      res.status(200).json({
        leaveRequest,
        message: "Leave request deleted successfully.",
      });
    } else {
      return res.status(404).json({ message: "Leave request not found." });
    }
  } catch (error) {
    console.error(`🚀 ~ error:`, error);
    res.status(500).json({ message: "Error deleting leave request." });
  }
});

exports.getEmployeeLeaveTable = catchAssyncError(async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();

    const leaveTypes = await getLeaveTypesFunctionWithoutDefault(
      req.user.user.organizationId
    );
    let currentYearLeaves = await leaveManager.getYearTable(req.user.user._id);
    const employee = await EmployeeModel.findById(req.user.user._id);

    currentYearLeaves.forEach((leave) => {
      const correspondingLeaveType = leaveTypes?.find((item) => {
        return (
          item?._id.toString() === leave.leaveTypeDetailsId?._id.toString() &&
          (leave?.status === "Pending" || leave?.status === "Approved")
        );
      });

      if (correspondingLeaveType) {
        const startDate = dayjs(leave.start);
        const endDate = dayjs(leave.end);
        let dayDifference = endDate.diff(startDate, "day") + 1;

        if (moment(leave.start).isSame(leave.end)) {
          dayDifference = 1;
        }
        correspondingLeaveType.count -= dayDifference;
      }
    });
    let totalC = 0;

    const joiningDate = new Date(employee?.joining_date);

    const joiningYear = joiningDate.getFullYear();
    const month = joiningDate.getMonth();
    console.log(joiningYear, month);

    if (joiningYear === currentYear) {
      leaveTypes.map(
        (item) => (item.count -= Math.round((item.count / 12) * month))
      );
    }
    leaveTypes.map((item) => (item.count = item.count <= 0 ? 0 : item.count));
    console.log(`🚀 ~ leaveTypes:`, leaveTypes);

    leaveTypes?.map((value) => {
      return (totalC += value.count);
    });

    res.status(200).json({
      leaveTypes,
      totalCoutn: totalC,
    });
  } catch (error) {
    console.error(`Error:`, error);
    res.status(500).json({ message: "Error fetching remaining leaves." });
  }
});

exports.getLeaveTableForEmployee = catchAssyncError(async (req, res, next) => {
  try {
    const { id, organizationId } = req.params;
    const currentYear = new Date().getFullYear();

    const leaveTypes = await getLeaveTypesFunctionWithoutDefault(
      organizationId
    );

    let currentYearLeaves = await leaveManager.getYearTable(id);

    const employee = await EmployeeModel.findById(id);

    currentYearLeaves.forEach((leave) => {
      const correspondingLeaveType = leaveTypes?.find((item) => {
        return (
          item?._id.toString() === leave.leaveTypeDetailsId?._id.toString() &&
          (leave?.status === "Pending" || leave?.status === "Approved")
        );
      });

      if (correspondingLeaveType) {
        const startDate = dayjs(leave.start);
        const endDate = dayjs(leave.end);
        let dayDifference = endDate.diff(startDate, "day") + 1;

        if (moment(leave.start).isSame(leave.end)) {
          dayDifference = 1;
        }
        correspondingLeaveType.count -= dayDifference;
      }
    });
    // console.log(`🚀 ~ test:`, test);

    let totalC = 0;

    //  Check if the year matches the current year

    // Parse the joining_date to a Date object
    const joiningDate = new Date(employee?.joining_date);

    // Extract the year from the Date object
    const joiningYear = joiningDate.getFullYear();
    const month = joiningDate.getMonth();
    console.log(joiningYear, month);

    if (joiningYear === currentYear) {
      leaveTypes.map(
        (item) => (item.count -= Math.round((item.count / 12) * month))
      );
    }
    leaveTypes.map((item) => (item.count = item.count <= 0 ? 0 : item.count));

    leaveTypes?.map((value) => {
      return (totalC += value.count);
    });

    console.log(`🚀 ~ leaveTypes:`, leaveTypes);
    res.status(200).json({
      leaveTypes,
      totalCoutn: totalC,
    });
  } catch (error) {
    console.error(`Error:`, error);
    res.status(500).json({ message: "Error fetching remaining leaves." });
  }
});

exports.getEmployeeNotificationWithFilter = catchAssyncError(
  async (req, res, next) => {
    try {
      const { employeeId } = req.params;
      const { status, leaveTypeDetailsId, minDate, maxDate, skip } = req.query;
      let query = { employeeId };

      if (status.length > 0) {
        query.status = status;
      }
      if (leaveTypeDetailsId.length > 0) {
        query.leaveTypeDetailsId = leaveTypeDetailsId;
      }
      if (minDate && maxDate) {
        query.start = {
          $gte: minDate,
          $lte: maxDate,
        };
      }

      const leaveRequests = await AttendanceModel.find(query)
        .populate(["employeeId", "leaveTypeDetailsId", "creatorId"])
        .sort({ createdAt: -1 })
        .limit(6)
        .skip(Number(skip) * 6);

      res.status(200).json({ leaveRequests });
    } catch (error) {
      console.error(`🚀 ~ error:`, error);
      res.status(500).json({ message: error.message });
    }
  }
);

//employee side notification count change api
exports.getEmployeeNotificationCountWithFilter = catchAssyncError(
  async (req, res, next) => {
    try {
      const { employeeId } = req.params;
      const { status, leaveTypeDetailsId, minDate, maxDate, skip } = req.query;
      let query = { employeeId };

      if (status && status.length > 0) {
        query.status = status;
      }
      if (leaveTypeDetailsId && leaveTypeDetailsId.length > 0) {
        query.leaveTypeDetailsId = leaveTypeDetailsId;
      }
      if (minDate && maxDate) {
        query.start = {
          $gte: minDate,
          $lte: maxDate,
        };
      }

      const leaveRequests = await AttendanceModel.find(query)
        .populate(["employeeId", "leaveTypeDetailsId", "creatorId"])
        .sort({ createdAt: -1 })
        .limit(6)
        .skip(Number(skip) * 6);

      const requestIds = leaveRequests.map((req) => req._id);
      await AttendanceModel.updateMany(
        { _id: { $in: requestIds } },
        { $set: { approveRejectNotificationCount: 0 } }
      );

      res.status(200).json({ leaveRequests });
    } catch (error) {
      console.error(`🚀 ~ error:`, error);
      res.status(500).json({ message: error.message });
    }
  }
);

exports.getEmployeeSummaryTable = catchAssyncError(async (req, res, next) => {
  try {
    const leaveTypesWithDefaultTypes = await getLeaveTypesFunctionWithDefault(
      req.user.user.organizationId
    );
    const currentMonthLeaves = await leaveManager.getMonthLeave(
      req.user.user._id
    );

    leaveTypesWithDefaultTypes.leaveTypes.forEach((item) => (item.count = 0));

    currentMonthLeaves.forEach((leave) => {
      const correspondingLeaveType = leaveTypesWithDefaultTypes.leaveTypes.find(
        (item) =>
          item._id.toString() === leave.leaveTypeDetailsId._id.toString()
      );

      if (correspondingLeaveType) {
        const startDate = dayjs(leave.start);
        const endDate = dayjs(leave.end);
        const dayDifference = endDate.diff(startDate, "day");

        correspondingLeaveType.count += dayDifference;
      }
    });
    let totalC = 0;
    leaveTypesWithDefaultTypes.leaveTypes?.map((value) => {
      return (totalC += value.count);
    });
    res.status(200).json({
      totalCoutn: totalC,
      leaveTypeDetailsArray: leaveTypesWithDefaultTypes.leaveTypes,
    });
  } catch (error) {
    console.error(`Error:`, error);
    res.status(500).json({ message: "Error fetching remaining leaves." });
  }
});

exports.getEmployeeCurrentYearLeave = catchAssyncError(
  async (req, res, next) => {
    try {
      const leaveTypesWithDefaultTypes = await getLeaveTypesFunctionWithDefault(
        req.user.user.organizationId
      );

      const LeaveTypedEdited = leaveTypesWithDefaultTypes.leaveTypes.filter(
        (value) => value.count !== 0
      );
      const currentYearLeaves = await leaveManager.getYearLeaves(
        req.user.user._id
      );
      res.status(200).json({
        currentYearLeaves,
        LeaveTypedEdited,
      });
    } catch (error) {
      console.error(`Error:`, error);
      res.status(500).json({ message: "Error fetching remaining leaves." });
    }
  }
);

exports.getOrgEmployeeYearLeave = catchAssyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const leaveTypesWithDefaultTypes = await getLeaveTypesFunctionWithDefault(
      req.user.user.organizationId
    );

    const LeaveTypedEdited = leaveTypesWithDefaultTypes.leaveTypes.filter(
      (value) => value.count !== 0
    );

    const currentYearLeaves = await leaveManager.getYearLeaves(id);
    res.status(200).json({
      currentYearLeaves,
      LeaveTypedEdited,
    });
  } catch (error) {
    console.error(`Error:`, error);
    res.status(500).json({ message: "Error fetching remaining leaves." });
  }
});

exports.getLeavesByMonth = catchAssyncError(async (req, res, next) => {
  try {
    const userId = mongoose.Types.ObjectId(req.user.user._id);

    const leavesByMonth = await AttendanceModel.aggregate([
      {
        $match: {
          employeeId: userId,
        },
      },
      {
        $lookup: {
          from: "leavetypedetails",
          localField: "leaveTypeDetailsId",
          foreignField: "_id",
          as: "leaveTypeDetails",
        },
      },
      // Optionally, add a $unwind stage if needed
      {
        $unwind: {
          path: "$leaveTypeDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          dateDifference: {
            $add: [
              {
                $divide: [
                  { $subtract: ["$end", "$start"] },
                  24 * 60 * 60 * 1000 + 1,
                ],
              },
              1,
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          employeeId: 1,
          description: 1,
          title: 1,
          start: 1,
          color: 1,
          end: 1,
          status: 1,
          message: 1,
          approverId: 1,
          leaveTypeDetails: {
            leaveName: "$leaveTypeDetails.leaveName",
            isActive: "$leaveTypeDetails.isActive",
            color: "$leaveTypeDetails.color",
            count: "$leaveTypeDetails.count",
            organisationId: "$leaveTypeDetails.organisationId",
          },
          createdAt: 1,
          updatedAt: 1,
          dateDifference: 1,
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$start" },
            year: { $year: "$start" },
          },
          count: { $sum: 1 },
          leaves: { $push: "$$ROOT" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    return res.status(200).json({
      leavesByMonth,
      message: "Leaves by month for the last 12 months",
    });
  } catch (error) {
    console.error(`🚀 ~ error:`, error);
    res.status(500).json({ message: "Server Error" || error.message });
  }
});

exports.getEmployeeLast3Leaves = catchAssyncError(async (req, res, next) => {
  try {
    const notInclude = ["Available", "Work From Home", "Public Holiday"];
    const leaves = await AttendanceModel.find({
      employeeId: req.user.user._id,
      title: { $nin: notInclude },
    })
      .sort({ createdAt: -1 }) // Sorting by timestamp in descending order
      .limit(3); // Limiting the result to the last 3 leaves

    res.status(200).json({
      leaves,
      message: "Last 3 leaves fetched successfully",
    });
  } catch (error) {
    console.error(`🚀 ~ error:`, error);
    res.status(500).json({ message: "Server Error" || error.message });
  }
});

exports.getOrganizationAttendence = catchAssyncError(async (req, res, next) => {
  const { organisationId } = req.params;
  const date = new Date();

  try {
    const employeeIds = await EmployeeModel.find({
      "summury.year": { $eq: 2024 },
      organizationId: organisationId,
    }).select("_id");
    console.log(`🚀 ~ employeeIds:`, employeeIds);

    const summaryModel = await EmployeeSummaryModel.find({
      employeeId: {
        $in: employeeIds.map((emplooyee) => emplooyee._id),
      },
    }).populate([
      "summary.availableDays",
      "summary.paidleaveDays",
      "summary.unpaidleaveDays",
    ]);

    console.log(summaryModel, "summerizedData");

    // Create a map to store the combined summaries by employeeId, month, and year
    const combinedSummariesMap = new Map();
    // Iterate through the data and combine summaries
    summaryModel.forEach((employee) => {
      const { summary } = employee;

      // Update the totalAvailableDays based on the actual available days in the summary
      summary.forEach((monthlySummary) => {
        const { month, year, availableDays, paidleaveDays, unpaidleaveDays } =
          monthlySummary;
        const key = `${month}_${year}`;

        // Update the totalAvailableDays for the existing key
        if (combinedSummariesMap.has(key)) {
          const existingSummary = combinedSummariesMap.get(key);
          existingSummary.availableDays.push(...availableDays);
          existingSummary.paidleaveDays.push(...paidleaveDays);
          existingSummary.unpaidleaveDays.push(...unpaidleaveDays);
        } else {
          combinedSummariesMap.set(key, {
            month,
            year,
            availableDays,
            paidleaveDays,
            unpaidleaveDays,
          });
        }
      });
    });

    const combinedSummaries = Array.from(combinedSummariesMap.values());
    let processedData = [];
    combinedSummaries.forEach((employeeData) => {
      function calculateLeaveDays(leaveType, daysArray) {
        let totalDays = 0;
        daysArray.forEach((days) => {
          const start = new Date(days.start);

          const end = new Date(days.end);
          const durationInDays = Math.floor(
            (end - start) / (1000 * 60 * 60 * 24)
          );
          totalDays += durationInDays;
        });

        return { [leaveType]: totalDays };
      }

      const available = calculateLeaveDays(
        "availableDays",
        employeeData.availableDays
      ).availableDays;

      const paidleaveDays = calculateLeaveDays(
        "paidleaveDays",
        employeeData.paidleaveDays
      ).paidleaveDays;

      const unpaidleaveDays = calculateLeaveDays(
        "unpaidleaveDays",
        employeeData.unpaidleaveDays
      ).unpaidleaveDays;
      const count = getDaysInMonth(employeeData.month, employeeData.year);
      function getDaysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
      }
      const absent = paidleaveDays + unpaidleaveDays;

      const PresentPercent = (available / (count * employeeIds.length)) * 100;
      const absentPercent = (absent / (count * employeeIds.length)) * 100;
      // Usage example:
      const monthInfo = {
        month: employeeData.month,
        year: employeeData.year,
        PresentPercent,
        absentPercent,
        available,
        paidleaveDays,
        unpaidleaveDays,
      };
      processedData.push(monthInfo);
    });

    const sortedData = processedData.sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return b.month - a.month;
    });

    return res.json(sortedData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.getOrganizationAttendenceByYear = catchAssyncError(
  async (req, res, next) => {
    try {
      const { organisationId: organizationId, year } = req.params;
      const employeeIds = await EmployeeModel.find({ organizationId }).select(
        "_id"
      );

      const summaryModel = await EmployeeSummaryModel.find({
        employeeId: {
          $in: employeeIds.map((emplooyee) => emplooyee._id),
        },
      }).populate([
        "summary.availableDays",
        "summary.paidleaveDays",
        "summary.unpaidleaveDays",
      ]);

      // Create a map to store the combined summaries by employeeId, month, and year
      const combinedSummariesMap = new Map();
      // Iterate through the data and combine summaries
      summaryModel.forEach((employee) => {
        const { summary } = employee;

        summary.forEach((monthlySummary) => {
          const {
            month,
            year: dbYear,
            availableDays,
            paidleaveDays,
            unpaidleaveDays,
          } = monthlySummary;
          if (dbYear === parseInt(year)) {
            console.log(year === parseInt(year), year, parseInt(year));
            const key = `${month}_${year}`;

            // Update the totalAvailableDays for the existing key
            if (combinedSummariesMap.has(key)) {
              const existingSummary = combinedSummariesMap.get(key);
              existingSummary.availableDays.push(...availableDays);
              existingSummary.paidleaveDays.push(...paidleaveDays);
              existingSummary.unpaidleaveDays.push(...unpaidleaveDays);
            } else {
              combinedSummariesMap.set(key, {
                month,
                year,
                availableDays,
                paidleaveDays,
                unpaidleaveDays,
              });
            }
          }
        });
      });

      const combinedSummaries = Array.from(combinedSummariesMap.values());
      let processedData = [];
      combinedSummaries.forEach((employeeData) => {
        function calculateLeaveDays(leaveType, daysArray) {
          let totalDays = 0;
          daysArray.forEach((days) => {
            const start = new Date(days.start);

            const end = new Date(days.end);
            const durationInDays = Math.floor(
              (end - start) / (1000 * 60 * 60 * 24)
            );
            totalDays += durationInDays;
          });

          return { [leaveType]: totalDays };
        }

        const available = calculateLeaveDays(
          "availableDays",
          employeeData.availableDays
        ).availableDays;

        const paidleaveDays = calculateLeaveDays(
          "paidleaveDays",
          employeeData.paidleaveDays
        ).paidleaveDays;

        const unpaidleaveDays = calculateLeaveDays(
          "unpaidleaveDays",
          employeeData.unpaidleaveDays
        ).unpaidleaveDays;
        const count = getDaysInMonth(employeeData.month, employeeData.year);
        function getDaysInMonth(month, year) {
          return new Date(year, month, 0).getDate();
        }
        const absent = paidleaveDays + unpaidleaveDays;

        console.log(available, absent, count, employeeIds.length);
        const PresentPercent = (available / (count * employeeIds.length)) * 100;
        const absentPercent = (absent / (count * employeeIds.length)) * 100;
        // Usage example:
        const monthInfo = {
          month: employeeData.month,
          year: employeeData.year,
          PresentPercent,
          absentPercent,
          available,
          paidleaveDays,
          unpaidleaveDays,
        };
        processedData.push(monthInfo);
      });

      const sortedData = processedData.sort((a, b) => {
        if (a.year !== b.year) {
          return a.year - b.year;
        }
        return b.month - a.month;
      });

      return res.json(sortedData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

exports.getDepartmentAttendence = catchAssyncError(async (req, res, next) => {
  const { departmentId, year } = req.params;
  try {
    const employeeIds = await EmployeeModel.find({
      deptname: {
        $in: departmentId,
      },
    }).select("_id");

    const summaryModel = await EmployeeSummaryModel.find({
      employeeId: {
        $in: employeeIds.map((emplooyee) => emplooyee._id),
      },
    }).populate([
      "summary.availableDays",
      "summary.paidleaveDays",
      "summary.unpaidleaveDays",
    ]);
    console.log(`🚀 ~ summaryModel:`, summaryModel);

    // Create a map to store the combined summaries by employeeId, month, and year
    const combinedSummariesMap = new Map();

    summaryModel.forEach((employee) => {
      const { summary } = employee;

      summary.forEach((monthlySummary) => {
        const {
          month,
          year: dbYear,
          availableDays,
          paidleaveDays,
          unpaidleaveDays,
        } = monthlySummary;
        if (dbYear === parseInt(year)) {
          console.log(year === parseInt(year), year, parseInt(year));
          const key = `${month}_${year}`;

          // Update the totalAvailableDays for the existing key
          if (combinedSummariesMap.has(key)) {
            const existingSummary = combinedSummariesMap.get(key);
            existingSummary.availableDays.push(...availableDays);
            existingSummary.paidleaveDays.push(...paidleaveDays);
            existingSummary.unpaidleaveDays.push(...unpaidleaveDays);
          } else {
            combinedSummariesMap.set(key, {
              month,
              year,
              availableDays,
              paidleaveDays,
              unpaidleaveDays,
            });
          }
        }
      });
    });
    const combinedSummaries = Array.from(combinedSummariesMap.values());
    let processedData = [];
    combinedSummaries.forEach((employeeData) => {
      function calculateLeaveDays(leaveType, daysArray) {
        let totalDays = 0;
        daysArray.forEach((days) => {
          const start = new Date(days.start);

          const end = new Date(days.end);
          const durationInDays = Math.floor(
            (end - start) / (1000 * 60 * 60 * 24) + 1
          );
          totalDays += durationInDays;
        });

        return { [leaveType]: totalDays };
      }

      const available = calculateLeaveDays(
        "availableDays",
        employeeData.availableDays
      ).availableDays;

      const paidleaveDays = calculateLeaveDays(
        "paidleaveDays",
        employeeData.paidleaveDays
      ).paidleaveDays;

      const unpaidleaveDays = calculateLeaveDays(
        "unpaidleaveDays",
        employeeData.unpaidleaveDays
      ).unpaidleaveDays;
      const count = getDaysInMonth(employeeData.month, employeeData.year);
      function getDaysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
      }
      const absent = paidleaveDays + unpaidleaveDays;

      const PresentPercent = (available / (count * employeeIds.length)) * 100;
      const absentPercent = (absent / (count * employeeIds.length)) * 100;
      // Usage example:
      const monthInfo = {
        month: employeeData.month,
        year: employeeData.year,
        PresentPercent,
        absentPercent,
        available,
        paidleaveDays,
        unpaidleaveDays,
      };
      processedData.push(monthInfo);
    });

    const sortedData = processedData.sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return b.month - a.month;
    });

    return res.json(sortedData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.getLocationAttendence = catchAssyncError(async (req, res, next) => {
  const { locationId, year } = req.params;

  try {
    const department = await DepartmentModel.find({
      departmentLocation: locationId,
    }).select("_id");

    const employeeIds = await EmployeeModel.find({
      deptname: {
        $in: department.map((d) => d._id),
      },
    }).select("_id");

    const summaryModel = await EmployeeSummaryModel.find({
      employeeId: {
        $in: employeeIds.map((emplooyee) => emplooyee._id),
      },
    }).populate([
      "summary.availableDays",
      "summary.paidleaveDays",
      "summary.unpaidleaveDays",
    ]);

    // Create a map to store the combined summaries by employeeId, month, and year
    const combinedSummariesMap = new Map();

    summaryModel.forEach((employee) => {
      const { summary } = employee;

      summary.forEach((monthlySummary) => {
        const {
          month,
          year: dbYear,
          availableDays,
          paidleaveDays,
          unpaidleaveDays,
        } = monthlySummary;
        if (dbYear === parseInt(year)) {
          console.log(year === parseInt(year), year, parseInt(year));
          const key = `${month}_${year}`;

          // Update the totalAvailableDays for the existing key
          if (combinedSummariesMap.has(key)) {
            const existingSummary = combinedSummariesMap.get(key);
            existingSummary.availableDays.push(...availableDays);
            existingSummary.paidleaveDays.push(...paidleaveDays);
            existingSummary.unpaidleaveDays.push(...unpaidleaveDays);
          } else {
            combinedSummariesMap.set(key, {
              month,
              year,
              availableDays,
              paidleaveDays,
              unpaidleaveDays,
            });
          }
        }
      });
    });
    const combinedSummaries = Array.from(combinedSummariesMap.values());
    let processedData = [];
    combinedSummaries.forEach((employeeData) => {
      function calculateLeaveDays(leaveType, daysArray) {
        let totalDays = 0;
        daysArray.forEach((days) => {
          const start = new Date(days.start);

          const end = new Date(days.end);
          const durationInDays = Math.floor(
            (end - start) / (1000 * 60 * 60 * 24) + 1
          );
          totalDays += durationInDays;
        });

        return { [leaveType]: totalDays };
      }

      const available = calculateLeaveDays(
        "availableDays",
        employeeData.availableDays
      ).availableDays;

      const paidleaveDays = calculateLeaveDays(
        "paidleaveDays",
        employeeData.paidleaveDays
      ).paidleaveDays;

      const unpaidleaveDays = calculateLeaveDays(
        "unpaidleaveDays",
        employeeData.unpaidleaveDays
      ).unpaidleaveDays;
      const count = getDaysInMonth(employeeData.month, employeeData.year);
      function getDaysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
      }
      const absent = paidleaveDays + unpaidleaveDays;

      const PresentPercent = (available / (count * employeeIds.length)) * 100;
      const absentPercent = (absent / (count * employeeIds.length)) * 100;
      // Usage example:
      const monthInfo = {
        month: employeeData.month,
        year: employeeData.year,
        PresentPercent,
        absentPercent,
        available,
        paidleaveDays,
        unpaidleaveDays,
      };
      processedData.push(monthInfo);
    });

    const sortedData = processedData.sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return b.month - a.month;
    });

    return res.json(sortedData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.getManagerEmployeeAttendence = catchAssyncError(
  async (req, res, next) => {
    const { year, month } = req.params;
    try {
      const employeesUnderManager = await EmployeeManagementModel.findOne({
        managerId: req.user.user._id,
      }).populate("reporteeIds");

      const summaryModel = await EmployeeSummaryModel.find({
        employeeId: {
          $in: employeesUnderManager?.reporteeIds?.map((ele) => ele._id),
        },
      })
        .populate([
          "summary.availableDays",
          "summary.paidleaveDays",
          "summary.unpaidleaveDays",
        ])
        .populate("employeeId");

      let processedData = [];

      let empId;

      summaryModel.forEach((ele) => {
        empId = ele?.employeeId?._id;
        empName = `${ele?.employeeId.first_name} ${ele?.employeeId.last_name}`;

        ele.summary.forEach((monthData) => {
          if (
            monthData.month === parseInt(month) &&
            monthData.year === parseInt(year)
          ) {
            function calculateLeaveDays(leaveType, daysArray) {
              let totalDays = 0;

              daysArray.forEach((days) => {
                const start = new Date(days.start);
                const end = new Date(days.end);
                const durationInDays = Math.floor(
                  (end - start) / (1000 * 60 * 60 * 24)
                );
                totalDays += durationInDays;
              });

              return { [leaveType]: totalDays };
            }

            const monthInfo = {
              empId: empId,
              employeeId: ele?.employeeId?.empId,
              empName,
              email: ele?.employeeId?.email,
              month: monthData.month,
              year: monthData.year,
              ...calculateLeaveDays("availableDays", monthData.availableDays),
              ...calculateLeaveDays("paidleaveDays", monthData.paidleaveDays),
              ...calculateLeaveDays(
                "unpaidleaveDays",
                monthData.unpaidleaveDays
              ),
            };
            processedData.push(monthInfo);
          }
        });
      });

      const newData = processedData;
      employeesUnderManager?.reporteeIds?.forEach((ele) => {
        console.log(`🚀 ~ ele:`, ele);
        const isExists = processedData.some(
          (item) => item.empId.toString() === ele._id.toString()
        );

        if (!isExists) {
          newData.push({
            empId: ele._id,
            empName: `${ele.first_name} ${ele.last_name}`,
            month: parseInt(month),
            year: parseInt(year),
            availableDays: 0,
            paidleaveDays: 0,
            unpaidleaveDays: 0,
          });
        }
      });

      //     processedData.filter(
      //       (item) => item.empId.toString() !== ele._id.toString()
      //     )
      //   );
      //   console.log("end");
      // });
      // employeesUnderManager?.reporteeIds?.forEach((ele) => {
      //   console.log("start");
      //   console.log(ele._id);
      //   console.log(
      //     processedData.forEach((item) => console.log("Ids :", item.empName))
      //   );
      //   console.log("end");
      //   let isDataAlreadyExists = processedData.some(
      //     (item) => item.empId.toString() !== ele._id.toString()
      //   );

      //   if (isDataAlreadyExists) {
      //     newData.push({
      //       empId: ele._id,
      //       empName: `${ele.first_name} ${ele.last_name}`,
      //       month: parseInt(month),
      //       year: parseInt(year),
      //       availableDays: 0,
      //       paidleaveDays: 0,
      //       unpaidleaveDays: 0,
      //     });
      //   }
      // });

      return res.json(newData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

exports.getManagerAttendence = catchAssyncError(async (req, res, next) => {
  const { managerId, year } = req.params;

  try {
    const employeesUnderManager = await EmployeeManagementModel.findOne({
      managerId: managerId,
    });

    const employeeIds = employeesUnderManager.reporteeIds.map((item) => item);

    const summaryModel = await EmployeeSummaryModel.find({
      employeeId: {
        $in: employeesUnderManager?.reporteeIds,
      },
    }).populate([
      "summary.availableDays",
      "summary.paidleaveDays",
      "summary.unpaidleaveDays",
    ]);

    const combinedSummariesMap = new Map();

    summaryModel.forEach((employee) => {
      const { summary } = employee;

      summary.forEach((monthlySummary) => {
        const {
          month,
          year: dbYear,
          availableDays,
          paidleaveDays,
          unpaidleaveDays,
        } = monthlySummary;
        if (dbYear === parseInt(year)) {
          console.log(year === parseInt(year), year, parseInt(year));
          const key = `${month}_${year}`;

          // Update the totalAvailableDays for the existing key
          if (combinedSummariesMap.has(key)) {
            const existingSummary = combinedSummariesMap.get(key);
            existingSummary.availableDays.push(...availableDays);
            existingSummary.paidleaveDays.push(...paidleaveDays);
            existingSummary.unpaidleaveDays.push(...unpaidleaveDays);
          } else {
            combinedSummariesMap.set(key, {
              month,
              year,
              availableDays,
              paidleaveDays,
              unpaidleaveDays,
            });
          }
        }
      });
    });
    const combinedSummaries = Array.from(combinedSummariesMap.values());
    let processedData = [];
    combinedSummaries.forEach((employeeData) => {
      function calculateLeaveDays(leaveType, daysArray) {
        let totalDays = 0;
        daysArray.forEach((days) => {
          const start = new Date(days.start);

          const end = new Date(days.end);
          const durationInDays = Math.floor(
            (end - start) / (1000 * 60 * 60 * 24) + 1
          );
          totalDays += durationInDays;
        });

        return { [leaveType]: totalDays };
      }

      const available = calculateLeaveDays(
        "availableDays",
        employeeData.availableDays
      ).availableDays;

      const paidleaveDays = calculateLeaveDays(
        "paidleaveDays",
        employeeData.paidleaveDays
      ).paidleaveDays;

      const unpaidleaveDays = calculateLeaveDays(
        "unpaidleaveDays",
        employeeData.unpaidleaveDays
      ).unpaidleaveDays;
      const count = getDaysInMonth(employeeData.month, employeeData.year);
      function getDaysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
      }
      const absent = paidleaveDays + unpaidleaveDays;

      const PresentPercent = (available / (count * employeeIds.length)) * 100;
      const absentPercent = (absent / (count * employeeIds.length)) * 100;
      // Usage example:
      const monthInfo = {
        month: employeeData.month,
        year: employeeData.year,
        PresentPercent,
        absentPercent,
        available,
        paidleaveDays,
        unpaidleaveDays,
      };
      processedData.push(monthInfo);
    });

    const sortedData = processedData.sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return b.month - a.month;
    });

    return res.json(sortedData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.getAllLeaveByYear = catchAssyncError(async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const getEmployeeLeaves = await EmployeeSummaryModel.find({
      employeeId: employeeId,
    })
      .populate("summary.availableDays")
      .populate("summary.paidleaveDays")
      .populate("summary.unpaidleaveDays")
      .sort({ "summary.month": 1 });

    let processedData = [];
    getEmployeeLeaves.forEach((employeeData) => {
      employeeData.summary.forEach((monthData) => {
        function calculateLeaveDays(leaveType, daysArray) {
          let totalDays = 0;

          daysArray.forEach((days) => {
            const start = new Date(days.start);
            const end = new Date(days.end);
            const durationInDays = Math.floor(
              (end - start) / (1000 * 60 * 60 * 24)
            );
            totalDays += durationInDays;
          });

          return { [leaveType]: totalDays };
        }

        //  Usage example:
        const monthInfo = {
          month: monthData.month,
          year: monthData.year,
          ...calculateLeaveDays("availableDays", monthData.availableDays),
          ...calculateLeaveDays("paidleaveDays", monthData.paidleaveDays),
          ...calculateLeaveDays("unpaidleaveDays", monthData.unpaidleaveDays),
        };
        console.log(`🚀 ~ monthInfo:`, monthInfo);

        processedData.push(monthInfo);
      });
    });

    const sortedData = processedData.sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }

      return b.month - a.month;
    });

    return res.json(sortedData);
  } catch (error) {
    console.error(error);
  }
});

exports.getAllLeaveForManager = catchAssyncError(async (req, res, next) => {
  try {
    const { _id: managerId } = req.user.user;
    const { month, year } = req.query;

    const getEmployeeUnderManager = await EmployeeManagementModel.find({
      managerId: managerId,
    }).populate("reporteeIds");

    const reporteeIds = getEmployeeUnderManager.map(
      (manager) => manager.reporteeIds
    );
    const getEmployeeLeaves = await EmployeeSummaryModel.find({
      $in: { employeeId: reporteeIds },
    })
      .populate("summary.availableDays")
      .populate("summary.paidleaveDays")
      .populate("summary.unpaidleaveDays")
      .populate("employeeId")
      .sort({ "summary.month": 1 });
    console.log(`🚀 ~ getEmployeeLeaves:`, getEmployeeLeaves);

    let processedData = [];

    console.log(Number(month));
    getEmployeeLeaves.forEach((employeeData) => {
      const monthData = employeeData.summary.find(
        (data) => data.month === Number(month) && data.year === Number(year)
      );

      if (monthData) {
        function calculateLeaveDays(leaveType, daysArray) {
          let totalDays = 0;

          daysArray.forEach((days) => {
            const start = new Date(days.start);
            const end = new Date(days.end);
            const durationInDays = Math.floor(
              (end - start) / (1000 * 60 * 60 * 24)
            );
            totalDays += durationInDays;
          });

          return { [leaveType]: totalDays };
        }

        const monthInfo = {
          employee: employeeData,
          month: monthData.month,
          year: monthData.year,
          ...calculateLeaveDays("availableDays", monthData.availableDays),
          ...calculateLeaveDays("paidleaveDays", monthData.paidleaveDays),
          ...calculateLeaveDays("unpaidleaveDays", monthData.unpaidleaveDays),
        };

        processedData.push(monthInfo);
      }
    });
    // });

    return res.json(processedData);
  } catch (error) {
    console.error(error);
  }
});

exports.getAllLeaveForYear = catchAssyncError(async (req, res, next) => {
  try {
    const { employeeId, year } = req.params;
    const getEmployeeLeaves = await EmployeeSummaryModel.find({
      employeeId: employeeId,
      "summary.year": Number(year),
    })
      .populate("summary.availableDays")
      .populate("summary.paidleaveDays")
      .populate("summary.unpaidleaveDays")
      .populate("employeeId")
      .sort({ "summary.month": 1 });

    let processedData = [];
    getEmployeeLeaves.forEach((employeeData) => {
      employeeData.summary.forEach((monthData) => {
        function calculateLeaveDays(leaveType, daysArray) {
          let totalDays = 0;

          daysArray.forEach((days) => {
            const start = new Date(days.start);
            const end = new Date(days.end);
            const durationInDays = Math.floor(
              (end - start) / (1000 * 60 * 60 * 24)
            );
            totalDays += durationInDays;
          });

          return { [leaveType]: totalDays };
        }

        // Usage example:
        const monthInfo = {
          month: monthData.month,
          year: monthData.year,
          ...calculateLeaveDays("availableDays", monthData.availableDays),
          ...calculateLeaveDays("paidleaveDays", monthData.paidleaveDays),
          ...calculateLeaveDays("unpaidleaveDays", monthData.unpaidleaveDays),
        };

        processedData.push(monthInfo);
      });
    });

    const sortedData = processedData.sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }

      return b.month - a.month;
    });

    return res.json({ sortedData, getEmployeeLeaves });
  } catch (error) {
    console.error(error);
  }
});

exports.getAbsentEmployee = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const { employeeId } = req.body;
    console.log(
      `🚀 ~ file: leave-requesation-controller.js:1389 ~ employeeId:`,
      employeeId
    );
    const currentDate = new Date();
    const excludeLeave = ["Work From Home", "Public Holiday", "Available"];

    const getAbsent = await AttendanceModel.find({
      organizationId: organizationId,
      title: { $nin: excludeLeave },
      start: { $lt: currentDate },
      end: { $gt: currentDate },
      // giving array and
      employeeId,
    });

    return res.status(200).json(getAbsent.length);
  } catch (error) {
    console.error(error);
  }
});

exports.getDeptAbsentEmployee = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const currentDate = new Date();
    const excludeLeave = ["Work From Home", "Public Holiday", "Available"];

    const id = req.user.user._id;
    const deptHead = await EmployeeModel.findById(id);
    const deptEmployees = await EmployeeModel.find({
      deptname: deptHead.deptname,
      profile: { $nin: ["Department-Head"] },
    });

    const getAbsent = await AttendanceModel.find({
      organizationId: organizationId,
      title: { $nin: excludeLeave },
      start: { $lt: currentDate },
      end: { $gt: currentDate },
      employeeId: { $in: deptEmployees },
    });

    return res.status(200).json(getAbsent.length);
  } catch (error) {
    console.error(error);
  }
});

exports.getManagerAbsentEmployee = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const currentDate = new Date();

    const id = req.user.user._id;
    const managerData = await EmployeeManagementModel.find({
      managerId: id,
    });

    const reporteeIds = managerData
      .map((manager) => manager.reporteeIds)
      .flat();

    const employeesUnderManager = await EmployeeModel.find({
      _id: { $in: reporteeIds },
    });

    const leaveIdsData = employeesUnderManager.map((shift) => shift._id);

    const excludeLeave = ["Work From Home", "Public Holiday", "Available"];

    const getAbsent = await AttendanceModel.find({
      organizationId: organizationId,
      title: { $nin: excludeLeave },
      start: { $lt: currentDate },
      end: { $gt: currentDate },
      employeeId: { $in: leaveIdsData },
    });

    return res.status(200).json(getAbsent.length);
  } catch (error) {
    console.error(error);
  }
});

exports.getAllLeaves = catchAssyncError(async (req, res, next) => {
  try {
    const getLeaves = await AttendanceModel.find({
      employeeId: req.user.user._id,
      status: "Approved",
    });
    return res.status(200).json(getLeaves);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

exports.getEmployeeLeaveByMonth = catchAssyncError(async (req, res, next) => {
  try {
    const { year, month, employeeId } = req.params;

    // Create start and end date objects for the specified month
    let startDate = new Date(year, month - 1, 1); // Month is 0-indexed
    let endDate = new Date(year, month, 0, 23, 59, 59); // Last day of the month

    console.log("start date", startDate);
    console.log("end Date", endDate);

    // Fetch leaves within the specified date range
    let leaves = await AttendanceModel.find({
      employeeId,
      start: { $gte: startDate, $lte: endDate },
      status: { $in: ["Approved"] },
      title: { $nin: ["Available", "Work From Home", "Public Holiday"] },
    });

    console.log("leaves", leaves);

    let paidLeaveDays = 0;
    let unpaidLeaveDays = 0;

    leaves.forEach((leave) => {
      let leaveDays = moment(leave?.end).diff(leave?.start, "days") + 1;
      if (moment(leave?.start).isSame(leave?.end)) {
        leaveDays = 1;
      }
      // Assuming title or some other field indicates whether the leave is paid or unpaid
      if (leave.title !== "Unpaid leave") {
        paidLeaveDays += leaveDays;
      } else if (leave.title === "Unpaid leave") {
        unpaidLeaveDays += leaveDays;
      }
    });

    console.log("paid leave", paidLeaveDays);
    console.log("unpaid leave", unpaidLeaveDays);

    res.status(200).json({
      paidLeaveDays,
      unpaidLeaveDays,
      message: "Leave details fetched successfully",
    });
  } catch (error) {
    console.error(`🚀 ~ error:`, error);
    res.status(500).json({ message: "Server Error" || error.message });
  }
});
