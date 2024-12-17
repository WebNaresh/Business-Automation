const catchAssyncError = require("../../middleware/catchAssyncError");
const {
  AttendanceBioModal,
} = require("../../models/AttendanceBio/attendanceBioSchema");

exports.addAttendanceData = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const { EmployeeId, punchingRecords } = req.body;

    const existingAttendance = await AttendanceBioModal.findOne({
      EmployeeId: EmployeeId,
      organizationId: organizationId
    });

    if (existingAttendance) {
      existingAttendance.punchingRecords.push(...punchingRecords);
      await existingAttendance.save();
    } else {
      const attendance = new AttendanceBioModal({
        EmployeeId: EmployeeId,
        organizationId: organizationId,
        punchingRecords: punchingRecords
      });
      await attendance.save();
    }

    res.status(201).json({ success: true, message: "Attendance data added successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to add the attendance data.",
      details: error.message
    });
  }
});

exports.getAllAttendanceData = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const attendanceData = await AttendanceBioModal.find({
      organizationId,
    }).populate("EmployeeId");

    res.status(200).json({ success: true, data: attendanceData });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to retrieve attendance data.",
      details: error.message,
    });
  }
});


exports.getAttendanceDataById = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId, id } = req.params;
    console.log("id", id);
    
    const attendanceData = await AttendanceBioModal.findOne({
      _id: id,
      organizationId: organizationId,
    }).populate("EmployeeId");

    console.log("attendance data", attendanceData);

    if (!attendanceData) {
      return res.status(404).json({
        success: false,
        error: "Attendance data not found for this employee.",
      });
    }

    res.status(200).json({ success: true, data: attendanceData });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to retrieve attendance data.",
      details: error.message,
    });
  }
});
