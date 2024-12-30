const mongoose = require("mongoose");
const {
  EmployeeSummaryModel,
} = require("../employeeSummarySchema/employeeSummarySchema");
const { deleteImage } = require("../../utils/s3");
const { String, Number } = mongoose.Schema.Types;

const LocationObject = new mongoose.Schema(
  {
    lng: {
      type: Number,
      // required: true,
    },
    lat: {
      type: Number,
      // required: true,
    },
    time: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const PunchEntries = new mongoose.Schema(
  {
    notificationCount: {
      type: Number,
      default: 0
    },
    stopNotificationCount: {
      type: Number,
      default: 0
    },
    stopEndTime: {
      type: String,
      default: "start",
    },
    data: [LocationObject],
    image: {
      type: String,
      default: "",
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    message: {
      type: String,
      default: "Battery on low auto shutdown",
    },
    distance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const punchSchema = new mongoose.Schema(
  {
    approveRejectNotificationCount: {
      type: Number,
      default: 0
    },
    geoFencingArea: {
      type: Boolean,
      default: false
    },
    punchData: [{ type: mongoose.Schema.Types.ObjectId, ref: "PunchObject" }],
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    status: {
      type: String,
      default: "Pending",
    },
    mReason: {
      type: String,
    },
    aReason: {
      type: String,
    },
    approverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    totalDistance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

punchSchema.post("save", async function (doc, next) {
  try {
    doc = await doc.populate(["employeeId", "punchData"]);
    // Check if status is updated to Approved
    if (doc.status === "Approved") {

      // delete image and set it to null

      await Promise.all(
        doc.punchData.map(async (punch) => {
          if (punch.image) {
            await deleteImage(punch.image);
            punch.image = null;
            await punch.save();
          }
        })
      );

      const employeeId = doc.employeeId._id;
      const month = new Date().getMonth() + 1; // Assuming current month
      const year = new Date().getFullYear(); // Assuming current year

      // Find or create EmployeeSummary
      let employeeSummary = await EmployeeSummaryModel.findOne({ employeeId });
      if (!employeeSummary) {
        employeeSummary = await EmployeeSummaryModel.create({
          employeeId,
          summary: [],
          organisationId: doc.employeeId.organizationId,
        });
      }

      // Update summary for the current month and year
      const summaryEntry = employeeSummary.summary.find(
        (entry) => entry.month === month && entry.year === year
      );
      if (summaryEntry) {
        summaryEntry.remotePunching.push(doc._id);
      } else {
        employeeSummary.summary.push({
          month,
          year,
          availableDays: [],
          paidleaveDays: [],
          unpaidleaveDays: [],
          remotePunching: [doc._id],
        });

      }

      // Save the updated EmployeeSummary
      await employeeSummary.save();
    }
  } catch (error) {
    console.error("Error in PunchModel updateOne middleware:", error);
  }
});

//remote punching task schema
const RemotePunchinTaskSchema = new mongoose.Schema({
  organisationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  deadlineDate: {
    type: Date,
    required: true,
  },
  taskName: [
    {
      taskName: {
        type: String,
        required: true,
      },
      acceptedBy: [
        {
          employeeEmail: { type: String },
          accepted: { type: Boolean, default: false },
          comments: { type: String },
          location: {
            lat: { type: Number },
            long: { type: Number },
          },
          status: {
            type: String,
            default: "",
          },
          punchObjectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PunchObject",
            // required: true,
          },
        },
      ],
    },
  ],
  to: [
    {
      label: String,
      value: String,
    },
  ],
});

const PunchModel = mongoose.model("PunchTable", punchSchema);
const PunchObject = mongoose.model("PunchObject", PunchEntries);
const RemotePunchingTask = mongoose.model("RemotePunchingTask", RemotePunchinTaskSchema);
module.exports = { PunchModel, PunchObject, RemotePunchingTask };
