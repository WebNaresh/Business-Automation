const mongoose = require("mongoose");

const LeaveTypeDetailSchema = new mongoose.Schema({
  leaveName: {
    type: String,
     required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  color: { type: String, required: true },
  count: { type: Number, default: 0 },
  organisationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
});
const LeaveTypeDetailModel = mongoose.model(
  "LeaveTypeDetail",
  LeaveTypeDetailSchema
);

const LeaveTypeSchema = new mongoose.Schema(
  {
    leaveTypes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LeaveTypeDetail",
        required: true,
      },
    ],
    organisationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
  },
  { timestamps: true }
);

// Middleware to remove the deleted LeaveTypeDetail from LeaveTypeSchema
LeaveTypeDetailSchema.pre("remove", { document: true }, async function (next) {
  const leaveTypeModel = mongoose.model("LeaveType");

  try {
    // Remove the deleted LeaveTypeDetail from the associated LeaveTypeSchema
    await leaveTypeModel.updateOne(
      { leaveTypes: this._id },
      { $pull: { leaveTypes: this._id } }
    );
    next();
  } catch (error) {
    next(error);
  }
});

LeaveTypeSchema.pre("remove", { document: true }, async function (next) {
  const LeaveTypeDetailModel = mongoose.model("LeaveTypeDetail");

  try {
    // Remove the deleted LeaveTypeDetail from the associated LeaveTypeSchema
    await LeaveTypeDetailModel.deleteMany({
      organisationId: this.organisationId,
    });
    next();
  } catch (error) {
    next(error);
  }
});
const LeaveTypeModel = mongoose.model("LeaveType", LeaveTypeSchema);

module.exports = { LeaveTypeModel, LeaveTypeDetailModel };
