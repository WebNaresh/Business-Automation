const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const {
  EmployeeSummaryModel,
} = require("../employeeSummarySchema/employeeSummarySchema");
const Attendance = new mongoose.Schema(
  {
    notificationCount: {
      type: Number,
      default: 0,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    title: { type: String, required: true },
    start: { type: Date, required: true },
    color: { type: String, required: true, default: "#f2a81b" },
    end: { type: Date }, // Optional for single-day leaves
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    leaveTypeDetailsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeaveTypeDetail",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    approveRejectNotificationCount: {
      type: Number,
      default: 0,
    },
    message: {
      type: String,
      default: "",
    },
    approverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
  },
  { timestamps: true }
);

Attendance.post("updateOne", async function (doc, next) {
  try {
    const query = this.getQuery();
    const update = this.getUpdate();
    const originalDocument = await this.model
      .findOne(query)
      .populate("leaveTypeDetailsId");

    if (update.$set && update.$set.status === "Approved") {
      const employeeId = originalDocument.employeeId;

      // but also check if date is end of the month of like 30 or 31 of the month of previous month then add it to the next month
      let month;

      if (
        originalDocument.start.getMonth() === originalDocument.end.getMonth()
      ) {
        month = originalDocument.start.getMonth() + 1;
      } else {
        // check if the end date is the last day of the month
        if (
          originalDocument.end.getDate() ===
          new Date(
            originalDocument.end.getFullYear(),
            originalDocument.end.getMonth() + 1,
            0
          ).getDate()
        ) {
          month = originalDocument.end.getMonth() + 1;
        } else {
          month = originalDocument.start.getMonth() + 1;
        }
      }

      const year = originalDocument.start.getFullYear();

      let employeeSummary = await EmployeeSummaryModel.findOne({
        employeeId: employeeId,
      });
      console.log(
        `🚀 ~ file: leave-requesation-schema.js:85 ~ employeeSummary:`,
        employeeSummary
      );
      console.log(
        `🚀 ~ file: leave-requesation-schema.js:104 ~ originalDocument.leaveTypeDetailsId:`,
        originalDocument.leaveTypeDetailsId
      );

      if (!employeeSummary) {
        let summary;
        if (
          originalDocument.leaveTypeDetailsId.isActive === true &&
          originalDocument.leaveTypeDetailsId.count > 0
        ) {
          summary = {
            month: month,
            year: year,
            availableDays: [],
            paidleaveDays: [originalDocument._id],
            unpaidleaveDays: [],
            remotePunching: [],
          };
        } else {
          if (
            originalDocument.leaveTypeDetailsId.leaveName === "Unpaid leave"
          ) {
            summary = {
              month: month,
              year: year,
              availableDays: [],
              paidleaveDays: [],
              unpaidleaveDays: [originalDocument._id],
              remotePunching: [],
            };
          } else if (
            originalDocument.leaveTypeDetailsId.leaveName === "Public Holiday"
          ) {
            summary = {
              month: month,
              year: year,
              availableDays: [],
              paidleaveDays: [originalDocument._id],
              unpaidleaveDays: [],
              remotePunching: [],
            };
          } else {
            summary = {
              month: month,
              year: year,
              availableDays: [originalDocument._id],
              paidleaveDays: [],
              unpaidleaveDays: [],
              remotePunching: [],
            };
          }
        }
        employeeSummary = await EmployeeSummaryModel.create({
          employeeId: employeeId,
          summary: [summary],
          organisationId: originalDocument?.leaveTypeDetailsId?.organisationId,
        });
      } else {
        const newEntry = {
          month: month,
          year: year,
          availableDays: [],
          paidleaveDays: [],
          unpaidleaveDays: [],
          remotePunching: [],
        };
        const summaryEntry = employeeSummary.summary.find(
          (entry) => entry.month === month && entry.year === year
        );

        if (summaryEntry) {
          if (
            originalDocument.leaveTypeDetailsId.isActive === true &&
            originalDocument.leaveTypeDetailsId.count > 0
          ) {
            console.log("i am wokring here2");
            summaryEntry.paidleaveDays.push(originalDocument._id);
          } else {
            if (
              originalDocument.leaveTypeDetailsId.leaveName === "Unpaid leave"
            ) {
              summaryEntry.unpaidleaveDays.push(originalDocument._id);
            } else if (
              originalDocument.leaveTypeDetailsId.leaveName === "Public Holiday"
            ) {
              summaryEntry.paidleaveDays.push(originalDocument._id);
            } else {
              summaryEntry.availableDays.push(originalDocument._id);
            }
          }
        } else {
          if (
            originalDocument.leaveTypeDetailsId.isActive === true &&
            originalDocument.leaveTypeDetailsId.count > 0
          ) {
            newEntry.paidleaveDays.push(originalDocument._id);
          } else {
            console.log(
              `🚀 ~ file: leave-requesation-schema.js:156 ~ originalDocument.leaveTypeDetailsId.leaveName:`,
              originalDocument.leaveTypeDetailsId.leaveName
            );
            console.log(
              `🚀 ~ file: leave-requesation-schema.js:160 ~ originalDocument.leaveTypeDetailsId.leaveName === "Unpaid Leave":`,
              originalDocument.leaveTypeDetailsId.leaveName === "Unpaid Leave"
            );
            if (
              originalDocument.leaveTypeDetailsId.leaveName === "Unpaid leave"
            ) {
              newEntry.unpaidleaveDays.push(originalDocument._id);
            } else if (
              originalDocument.leaveTypeDetailsId.leaveName === "Public Holiday"
            ) {
              newEntry.paidleaveDays.push(originalDocument._id);
            } else {
              newEntry.availableDays.push(originalDocument._id);
            }
          }
          employeeSummary.summary.push(newEntry);
        }
      }

      await employeeSummary.save();
    }
  } catch (error) {
    console.log(`Error in updateOne middleware:`, error);
  }
});

Attendance.post("deleteOne", async function (doc, next) {
  try {
    const originalDocument = await this.model
      .findOne(this.getQuery())
      .populate("leaveTypeDetailsId");

    const employeeId = originalDocument.employeeId;
    const month = originalDocument.start.getMonth() + 1;
    const year = originalDocument.start.getFullYear();

    let employeeSummary = await EmployeeSummaryModel.findOne({
      employeeId: employeeId,
    });

    if (employeeSummary) {
      const summaryEntry = employeeSummary.summary.find(
        (entry) => entry.month === month && entry.year === year
      );

      if (summaryEntry) {
        const index = summaryEntry.availableDays.indexOf(originalDocument._id);
        if (index > -1) {
          summaryEntry.availableDays.splice(index, 1);
        }
        const index1 = summaryEntry.paidleaveDays.indexOf(originalDocument._id);
        if (index1 > -1) {
          summaryEntry.paidleaveDays.splice(index1, 1);
        }
        const index2 = summaryEntry.unpaidleaveDays.indexOf(
          originalDocument._id
        );
        if (index2 > -1) {
          summaryEntry.unpaidleaveDays.splice(index2, 1);
        }
      }

      await employeeSummary.save();
    }
  } catch (error) {
    console.log(`Error in deleteOne middleware:`, error);
  }
});

const AttendanceModel = mongoose.model("Attendance", Attendance);

module.exports = { AttendanceModel };
