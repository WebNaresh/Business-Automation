const { default: mongoose } = require("mongoose");

const PerfromanceSchema = new mongoose.Schema({
  appraisalStartDate: {
    type: Date,
    required: true,
  },
  appraisalEndDate: {
    type: Date,
    required: true,
  },
  startdate: {
    type: Date,
    required: true,
  },
  enddate: {
    type: Date,
    required: true,
  },
  stages: {
    type: String,
    required: true,
  },
  goals: {
    type: Array,
    required: true,
  },
  ratings: {
    type: Array,
  },
  isDownCast: {
    type: Boolean,
    default: false,
  },
  isFeedback: {
    type: Boolean,
    default: false,
  },
  isNonMeasurableAllowed: {
    type: Boolean,
    default: false,
  },
  isManagerApproval: {
    type: Boolean,
    default: false,
  },
  isMidGoal: {
    type: Boolean,
    default: false,
  },
  isSendFormInMid: {
    type: Boolean,
    default: false,
  },
  deleteFormEmployeeOnBoarding: {
    type: Boolean,
    default: false,
  },
  isKRA: {
    type: Boolean,
    default: false,
  },
  isSelfGoal: {
    type: Boolean,
    default: false,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
});

const PerformanceModel = mongoose.model("PerformanceSetup", PerfromanceSchema);
module.exports = { PerformanceModel };
