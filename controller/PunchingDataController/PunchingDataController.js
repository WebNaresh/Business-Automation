const catchAssyncError = require("../../middleware/catchAssyncError");
const {
  PunchingDataModal,
} = require("../../models/PunchingData/PunchingDataSchema");
const {
  EmployeeManagementModel,
} = require("../../models/employeManager/employeeManagementSchema");
const { EmployeeModel } = require("../../models/employeeSchema");
const {
  AttendanceModel,
} = require("../../models/leaves/leave-requesation-schema");

exports.addPunchingData = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const {
      EmployeeId,
      recordDate,
      punchInTime,
      punchOutTime,
      totalHours,
      status,
      justify,
      leave,
      shift,
      overtimeHours,
    } = req.body;

    let punchingsData = await PunchingDataModal.findOne({
      EmployeeId,
      organizationId,
    });

    if (!punchingsData) {
      punchingsData = new PunchingDataModal({
        EmployeeId,
        organizationId,
        punchingData: [],
      });
    }

    // Convert string date inputs to Date objects
    const formattedRecordDate = new Date(recordDate);
    const formattedPunchInTime = punchInTime ? new Date(punchInTime) : null;
    const formattedPunchOutTime = punchOutTime ? new Date(punchOutTime) : null;

    // Check if there is already an entry for the given recordDate
    const existingRecordIndex = punchingsData.punchingData.findIndex(
      (record) =>
        new Date(record.recordDate).toISOString() ===
        formattedRecordDate.toISOString()
    );

    if (existingRecordIndex !== -1) {
      // Return error if record already exists
      return res.status(400).json({
        success: false,
        error: "Record already exists",
        details:
          "Cannot update existing record. Record with the same date already exists.",
      });
    }

    // Add a new record if no existing record found
    punchingsData.punchingData.push({
      recordDate: formattedRecordDate,
      punchInTime: formattedPunchInTime,
      punchOutTime: formattedPunchOutTime,
      totalHours,
      status,
      justify,
      leave,
      shift,
      overtimeHours,
      approvedId: null,
    });

    await punchingsData.save();
    res.status(201).json({
      success: true,
      message: "Hours calculated and saved successfully.",
    });
  } catch (error) {
    console.error("Error adding punching data:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to add punching data.",
      details: error.message,
    });
  }
});

exports.updatePunchingDataByEmployee = catchAssyncError(
  async (req, res, next) => {
    try {
      const { organizationId, unavailableRecordId } = req.params;
      const { justify, leave, shift } = req.body;
      const EmployeeId = req.user.user._id;

      const employeeManagement = await EmployeeManagementModel.findOne({
        organizationId,
        reporteeIds: { $in: [EmployeeId] },
      });
      // Get manager id
      let managerId = null;
      if (employeeManagement) {
        managerId = employeeManagement.managerId;
      }

      // Get HR id
      const hr = await EmployeeModel.findOne({ organizationId, profile: "HR" });
      const hrId = hr ? hr._id : null;

      // Determine the approval ID
      let approvedId = managerId;
      if (!managerId && hrId) {
        approvedId = hrId;
      }

      // Update the punching data document
      const result = await PunchingDataModal.findOneAndUpdate(
        { EmployeeId, organizationId, "punchingData._id": unavailableRecordId },
        {
          $set: {
            "punchingData.$.justify": justify,
            "punchingData.$.leave": leave,
            "punchingData.$.shift": shift,
            "punchingData.$.approvedId": approvedId,
          },
          $inc: { "punchingData.$.notificationCount": 1 },
        },
        { new: true }
      );

      if (!result) {
        return res.status(404).json({
          success: false,
          error: "Punching data not found for the given record date.",
        });
      }
      res.status(200).json({
        success: true,
        message: "Punching data updated successfully.",
      });
    } catch (error) {
      console.error("Error updating punching data:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to update punching data.",
        details: error.message,
      });
    }
  }
);

exports.updateApprovalIdByManager = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId, recordId } = req.params;
    let approvalIdData = await PunchingDataModal.findOne({
      organizationId,
      "punchingData._id": recordId,
    });
    if (!approvalIdData) {
      return res.status(404).json({
        success: false,
        error:
          "No records found with the provided organization ID, record ID, and approval ID.",
      });
    }

    const hr = await EmployeeModel.findOne({ organizationId, profile: "HR" });
    const hrId = hr ? hr._id : null;

    const updatedRecord = await PunchingDataModal.findOneAndUpdate(
      { organizationId, "punchingData._id": recordId },
      {
        $set: {
          "punchingData.$.approvedId": hrId,
          "punchingData.$.MaNotificationCount": 1,
        },
      },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedRecord });
  } catch (error) {
    console.error("Error updating approval id:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update approval id.",
      details: error.message,
    });
  }
});

exports.getUnavailableRecordstoApproval = catchAssyncError(
  async (req, res, next) => {
    try {
      const { organizationId } = req.params;
      const loggedInUserId = req.user.user._id;

      const punchingData = await PunchingDataModal.findOne({
        organizationId,
        approvedId: loggedInUserId,
      }).populate("EmployeeId");

      if (!punchingData) {
        return res.status(200).json({ success: true, data: [] });
      }

      const unavailableRecords = punchingData.punchingData.filter(
        (record) => record.status === "Unavailable"
      );

      // Map the unavailable records to include the EmployeeId
      const recordsWithEmployeeId = unavailableRecords.map((record) => ({
        employeeId: punchingData.EmployeeId,
        ...record.toObject(),
      }));

      res.status(200).json({ success: true, data: recordsWithEmployeeId });
    } catch (error) {
      console.error("Error retrieving unavailable records:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve unavailable records.",
        details: error.message,
      });
    }
  }
);

exports.acceptUnavailableRecord = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId, recordId } = req.params;

    let punchingData = await PunchingDataModal.findOne({
      organizationId,
      "punchingData._id": recordId,
    });

    if (!punchingData) {
      return res
        .status(404)
        .json({ success: false, error: "Punching data not found." });
    }

    punchingData.punchingData.forEach((record) => {
      if (record._id.toString() === recordId) {
        record.status = "Available";
        record.HrNotificationCount += 1;
      }
    });
    await punchingData.save();

    res.status(200).json({
      success: true,
      message: "Punching data status updated successfully.",
    });
  } catch (error) {
    console.error("Error updating punching data status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update punching data status.",
      details: error.message,
    });
  }
});

exports.rejectUnavailableRecord = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId, recordId } = req.params;
    let punchingData = await PunchingDataModal.findOne({
      organizationId,
      "punchingData._id": recordId,
    });
    if (!punchingData) {
      return res
        .status(404)
        .json({ success: false, error: "Punching data not found." });
    }

    punchingData.punchingData.forEach((record, index) => {
      if (record._id.toString() === recordId) {
        punchingData.punchingData.splice(index, 1);
      }
    });

    await punchingData.save();
    res
      .status(200)
      .json({ success: true, message: "Record removed successfully." });
  } catch (error) {
    console.error("Error removing record:", error);
    res.status(500).json({
      success: false,
      error: "Failed to remove record.",
      details: error.message,
    });
  }
});

exports.approvedUnpaidLeave = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId, recordId } = req.params;

    let punchingData = await PunchingDataModal.findOne({
      organizationId,
      "punchingData._id": recordId,
    });

    if (!punchingData) {
      return res
        .status(404)
        .json({ success: false, error: "Punching data not found." });
    }

    punchingData.punchingData.forEach((record) => {
      if (record._id.toString() === recordId) {
        record.status = "UnpaidLeave";
      }
    });
    await punchingData.save();

    res
      .status(200)
      .json({ success: true, message: "Approved leaved  successfully." });
  } catch (error) {
    console.error("Error updating punching data status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update punching data status.",
      details: error.message,
    });
  }
});

exports.approvedExtraShift = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId, recordId } = req.params;

    let punchingData = await PunchingDataModal.findOne({
      organizationId,
      "punchingData._id": recordId,
    });

    if (!punchingData) {
      return res
        .status(404)
        .json({ success: false, error: "Punching data not found." });
    }

    punchingData.punchingData.forEach((record) => {
      if (record._id.toString() === recordId) {
        record.status = "Extra Shift";
      }
    });
    await punchingData.save();

    res
      .status(200)
      .json({ success: true, message: "Approved Shift successfully." });
  } catch (error) {
    console.error("Error updating punching data status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update punching data status.",
      details: error.message,
    });
  }
});

exports.getPunchingData = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const punchingData = await PunchingDataModal.find({
      organizationId,
    }).populate("EmployeeId");

    res.status(200).json({ success: true, data: punchingData });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to retrieve punching data.",
      details: error.message,
    });
  }
});

exports.getUnavailableRecords = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const loggedInUserId = req.user?.user?._id;

    if (!loggedInUserId) {
      return res.status(400).json({
        success: false,
        error: "Logged in user ID is missing.",
      });
    }

    const records = await PunchingDataModal.find({
      organizationId,
    }).populate("EmployeeId");

    if (!records || records.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const result = [];
    records.forEach((record) => {
      const unavailableRecords = record.punchingData?.filter(
        (item) =>
          (item.status === "Unavailable" ||
            item.status === "Partial" ||
            item.status === "ExtraShift" ||
            item.status === "Overtime") &&
          item.approvedId &&
          item?.approvedId?.toString() === loggedInUserId?.toString()
      );
      if (unavailableRecords?.length > 0) {
        const employeeId = record.EmployeeId;
        const employeeResult = {
          employeeId,
          unavailableRecords,
        };
        result.push(employeeResult);
      }
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error retrieving unavailable records:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve unavailable records.",
      details: error.message,
    });
  }
});

exports.missedPunchRecordToHr = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const records = await PunchingDataModal.find({ organizationId }).populate(
      "EmployeeId"
    );

    if (!records || records.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }
    const result = [];
    records.forEach((record) => {
      const unavailableRecords = record.punchingData.filter(
        (item) => item.status === "Unavailable"
      );
      if (unavailableRecords.length > 0) {
        const employeeId = record.EmployeeId;
        const employeeResult = {
          employeeId,
          unavailableRecords,
        };
        result.push(employeeResult);
      }
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error retrieving unavailable records:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve unavailable records.",
      details: error.message,
    });
  }
});

exports.getUnavailableRecordsEmployee = catchAssyncError(
  async (req, res, next) => {
    try {
      const { organizationId } = req.params;
      const EmployeeId = req.user.user._id;

      const records = await PunchingDataModal.find({
        organizationId,
        EmployeeId,
      }).populate("EmployeeId");

      if (!records || records?.length === 0) {
        return res.status(200).json({ success: true, data: [] });
      }

      const result = [];
      records.forEach((record) => {
        const unavailableRecords = record.punchingData.filter(
          (item) =>
            item.status === "Unavailable" ||
            item.status === "Partial" ||
            item.status === "Overtime" ||
            item.status === "ExtraShift"
        );
        if (unavailableRecords.length > 0) {
          const employeeId = record.EmployeeId;
          const employeeResult = {
            employeeId,
            unavailableRecords,
          };
          result.push(employeeResult);
        }
      });

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error retrieving unavailable records:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve unavailable records.",
        details: error.message,
      });
    }
  }
);

// exports.getUnavailableRecordsByEmployeeId = catchAssyncError(
//   async (req, res, next) => {
//     try {
//       const { organizationId, EmployeeId } = req.params;
//       const approvedId = req.user.user._id;
//       const records = await PunchingDataModal.find({
//         organizationId,
//         EmployeeId,
//         "punchingData.approvedId": approvedId,
//       }).populate("EmployeeId");

//       if (!records || records.length === 0) {
//         return res.status(200).json({ success: true, data: [] });
//       }
//       const result = [];
//       records.forEach((record) => {
//         const unavailableRecords = record.punchingData?.filter(
//           (item) =>
//             (item.status === "Unavailable" ||
//               item.status === "Partial" ||
//               item.status === "ExtraShift" ||
//               item.status === "Overtime") &&
//             item.approvedId?.toString() === approvedId?.toString()
//         );

//         if (unavailableRecords.length > 0) {
//           const employeeId = record.EmployeeId;
//           const employeeResult = {
//             employeeId,
//             unavailableRecords,
//           };
//           result.push(employeeResult);
//         }
//       });

//       res.status(200).json({ success: true, data: result });
//     } catch (error) {
//       console.error("Error retrieving unavailable records:", error);
//       res.status(500).json({
//         success: false,
//         error: "Failed to retrieve unavailable records.",
//         details: error.message,
//       });
//     }
//   }
// );

exports.getUnavailableRecordsByEmployeeId = catchAssyncError(
  async (req, res, next) => {
    try {
      const { organizationId, EmployeeId } = req.params;
      const approvedId = req.user.user._id;

      // Fetch the records
      const records = await PunchingDataModal.find({
        organizationId,
        EmployeeId,
        "punchingData.approvedId": approvedId,
      }).populate("EmployeeId");

      if (!records || records.length === 0) {
        return res.status(200).json({ success: true, data: [] });
      }

      // Process the records
      const result = await Promise.all(
        records.map(async (record) => {
          const unavailableRecords = record.punchingData?.filter(
            (item) =>
              (item.status === "Unavailable" ||
                item.status === "Partial" ||
                item.status === "ExtraShift" ||
                item.status === "Overtime") &&
              item.approvedId?.toString() === approvedId?.toString()
          );

          if (unavailableRecords.length > 0) {
            // Update the notificationCount to 0 for the filtered records
            await PunchingDataModal.updateMany(
              {
                _id: record._id,
                "punchingData._id": {
                  $in: unavailableRecords.map((item) => item._id),
                },
              },
              {
                $set: {
                  "punchingData.$.notificationCount": 0,
                  "punchingData.$.MaNotificationCount": 0,
                },
              }
            );

            return {
              employeeId: record.EmployeeId,
              unavailableRecords: unavailableRecords.map((item) => ({
                ...item._doc,
                notificationCount: 0,
              })),
            };
          }
        })
      );

      const filteredResult = result.filter((item) => item !== undefined);

      res.status(200).json({ success: true, data: filteredResult });
    } catch (error) {
      console.error("Error retrieving unavailable records:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve unavailable records.",
        details: error.message,
      });
    }
  }
);


exports.getMissedPunchNotificationToEmployee = catchAssyncError(
  async (req, res, next) => {
    try {
      const EmployeeId = req.user.user._id;

      const organizationId = req.user.user.organizationId;

      const hr = await EmployeeModel.findOne({ organizationId, profile: "HR" });
      const approvedId = hr ? hr._id : null;

      const records = await PunchingDataModal.find({
        organizationId: organizationId,
        EmployeeId: EmployeeId,
      }).populate("punchingData.approvedId");

      if (!records || records.length === 0) {
        return res.status(200).json({ success: true, data: [] });
      }

      const result = [];
      records.forEach((record) => {
        const unavailableRecords = record.punchingData.filter(
          (item) =>
            (item.status === "Available" && item.approvedId !== null) ||
            item.status === "Leave"
        );
        if (unavailableRecords.length > 0) {
          const employeeId = record.EmployeeId;
          const employeeResult = {
            employeeId,
            unavailableRecords,
          };
          result.push(employeeResult);
        }
      });

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error retrieving unavailable records:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve unavailable records.",
        details: error.message,
      });
    }
  }
);

//get update notification count
exports.getMissedPunchUpdateNotificationToEmployee = catchAssyncError(
  async (req, res, next) => {
    try {
      const EmployeeId = req.user.user._id;
      const organizationId = req.user.user.organizationId;

      // Find the HR profile in the organization
      const hr = await EmployeeModel.findOne({ organizationId, profile: "HR" });
      const approvedId = hr ? hr._id : null;

      // Find the punching data records for the employee
      const records = await PunchingDataModal.find({
        organizationId: organizationId,
        EmployeeId: EmployeeId,
      }).populate("punchingData.approvedId");

      if (!records || records.length === 0) {
        return res.status(200).json({ success: true, data: [] });
      }

      // Prepare result array
      const result = [];
      const updatePromises = [];

      records.forEach((record) => {
        const unavailableRecords = record.punchingData.filter(
          (item) =>
            (item.status === "Available" && item.approvedId !== null) ||
            item.status === "Leave"
        );

        if (unavailableRecords.length > 0) {
          const employeeId = record.EmployeeId;
          const employeeResult = {
            employeeId,
            unavailableRecords,
          };
          result.push(employeeResult);

          // Add update promise to reset HrNotificationCount
          updatePromises.push(
            PunchingDataModal.updateMany(
              {
                _id: record._id,
                "punchingData._id": {
                  $in: unavailableRecords.map((r) => r._id),
                },
              },
              { $set: { "punchingData.$[elem].HrNotificationCount": 0 } },
              {
                arrayFilters: [
                  { "elem._id": { $in: unavailableRecords.map((r) => r._id) } },
                ],
              }
            )
          );
        }
      });

      // Execute all update operations
      await Promise.all(updatePromises);

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error retrieving unavailable records:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve unavailable records.",
        details: error.message,
      });
    }
  }
);

exports.deletePunchingRecord = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId, recordId } = req.params;

    console.log({ organizationId, recordId });

    let punchingData = await PunchingDataModal.findOne({
      organizationId,
      "punchingData._id": recordId,
    });
    if (!punchingData) {
      return res
        .status(404)
        .json({ success: false, error: "Punching data not found." });
    }

    punchingData.punchingData.forEach((record, index) => {
      if (record._id.toString() === recordId) {
        punchingData.punchingData.splice(index, 1);
      }
    });

    await punchingData.save();
    res
      .status(200)
      .json({ success: true, message: "Record removed successfully." });
  } catch (error) {
    console.error("Error removing record:", error);
    res.status(500).json({
      success: false,
      error: "Failed to remove record.",
      details: error.message,
    });
  }
});

exports.getMachinePunchingRecordofEmployee = catchAssyncError(
  async (req, res, next) => {
    try {
      const EmployeeId = req.user.user._id;
      const organizationId = req.user.user.organizationId;

      const records = await PunchingDataModal.find({
        organizationId: organizationId,
        EmployeeId: EmployeeId,
      }).populate("EmployeeId");

      if (!records || records.length === 0) {
        return res.status(200).json({ success: true, data: [] });
      }

      const result = [];
      records.forEach((record) => {
        const availableRecords = record.punchingData.filter(
          (item) =>
            item.status === "Available" ||
            item.status === "Leave" ||
            item.status === "ExtraShift"
        );

        if (availableRecords.length > 0) {
          const employeeId = record.EmployeeId;
          const employeeResult = {
            employeeId,
            availableRecords,
          };
          result.push(employeeResult);
        }
      });

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error retrieving available records:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve available records.",
        details: error.message,
      });
    }
  }
);

exports.getEmployeeLeaveByDate = catchAssyncError(async (req, res, next) => {
  try {
    const { date } = req.params;
    const employeeId = req.user.user._id;
    const targetDate = new Date(date);

    const startOfDay = new Date(targetDate.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setUTCHours(23, 59, 59, 999));

    console.log("Target Date", targetDate);
    console.log("startOfDay", startOfDay);
    console.log("endOfDay", endOfDay);

    // Fetch the leave for the specific date
    const leave = await AttendanceModel.findOne({
      employeeId,
      start: { $lte: endOfDay },
      end: { $gte: startOfDay },
      title: { $nin: ["Available", "Work From Home", "Public Holiday"] },
    });

    console.log("leave", leave);

    if (!leave) {
      return res.status(404).json({
        message: "No leave found for the specified date",
      });
    }

    res.status(200).json({
      leave,
      message: "Leave details fetched successfully",
    });
  } catch (error) {
    console.error(`🚀 ~ error:`, error);
    res.status(500).json({ message: "Server Error" || error.message });
  }
});

exports.getOthrOfEmployee = catchAssyncError(async (req, res, next) => {
  try {
    const { EmployeeId, organizationId } = req.params;
    const { startDate, endDate } = req.query;

    // Convert query params to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    console.log("startDate", start);
    console.log("endDate", end);

    // Ensure end date is inclusive
    end.setHours(23, 59, 59, 999);

    const records = await PunchingDataModal.find({
      organizationId: organizationId,
      EmployeeId: EmployeeId,
    });

    if (!records || records.length === 0) {
      return res.status(404).json({ message: "No punching data found." });
    }

    console.log("records", records);

    // Filter through the records to find ones with "Overtime" status and within the date range
    const result = [];
    records.forEach((record) => {
      const availableRecords = record.punchingData.filter(
        (punch) =>
          punch.status === "Overtime" &&
          new Date(punch.recordDate) >= start &&
          new Date(punch.recordDate) <= end
      );

      if (availableRecords.length > 0) {
        result.push(...availableRecords);
      }
    });

    console.log("result", result);

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No overtime data found for the given date range." });
    }

    // Sum up the overtime hours, rounding down to the nearest whole number
    const totalOvertimeHours = result.reduce((total, punch) => {
      return total + Math.floor(punch.overtimeHours || 0); // Use Math.floor to round down
    }, 0);

    console.log("totalOvertimeHours", totalOvertimeHours);

    // Return the total overtime hours, count of overtime records, and the filtered overtime records
    return res.status(200).json({
      totalOvertimeHours,
      overtimeRecords: result,
      overtimeRecordCount: result.length,
    });
  } catch (error) {
    console.error("Error fetching overtime data:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});
