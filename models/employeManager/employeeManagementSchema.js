const { default: mongoose } = require("mongoose");

const EmployeeManagementSchema = new mongoose.Schema(
  {
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      unique: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    reporteeIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const EmployeeManagementModel = mongoose.model(
  "EmployeeManagementSchema",
  EmployeeManagementSchema
);

module.exports = { EmployeeManagementModel };
