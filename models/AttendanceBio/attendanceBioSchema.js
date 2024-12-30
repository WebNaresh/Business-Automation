const mongoose = require("mongoose");

const attendacneBioSchema = new mongoose.Schema({
  EmployeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  punchingRecords: [
    {
      date: { type: Date, required: true },
      punchingTime: { type: String, required: true },
      punchingStatus: { type: String, required: true },
    },
  ],
});

const AttendanceBioModal = mongoose.model("attendanceBio", attendacneBioSchema);
module.exports = { AttendanceBioModal };
