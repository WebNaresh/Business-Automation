const {
  AttendanceModel,
} = require("../models/leaves/leave-requesation-schema");

class LeaveManager {
  async getMonthLeave(employeeId) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    try {
      const leavesForMonth = await this.queryLeaves({
        employeeId,
        start: new Date(currentYear, currentMonth - 1, 1),
        end: new Date(currentYear, currentMonth, 0),
      });

      return leavesForMonth;
    } catch (error) {
      console.error("Error fetching leaves:", error);
      throw error;
    }
  }

  async getYearLeaves(employeeId) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    try {
      const leavesForYear = await this.queryLeaves({
        employeeId,
        start: new Date(currentYear, 0, 1),
        end: new Date(currentYear, 11, 31),
      });

      return leavesForYear;
    } catch (error) {
      console.error("Error fetching leaves:", error);
      throw error;
    }
  }
  async getYearTable(employeeId) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    try {
      const leavesForYear = await this.queryLeavesRejected({
        employeeId,
        start: new Date(currentYear, 0, 1),
        end: new Date(currentYear, 11, 31),
      });

      return leavesForYear;
    } catch (error) {
      console.error("Error fetching leaves:", error);
      throw error;
    }
  }

  async getLast12MonthsLeave(employeeId) {
    const currentDate = new Date();

    try {
      const startDate = new Date(currentDate);
      startDate.setMonth(startDate.getMonth() - 11);
      startDate.setDate(1);

      const leavesForLast12Months = await this.queryLeaves({
        employeeId,
        start: startDate,
        end: currentDate,
      });

      // Organize leaves by month
      const leavesByMonth = leavesForLast12Months.reduce((acc, leave) => {
        const leaveDate = new Date(leave.start);
        const monthName = this.getMonthName(leaveDate.getMonth());

        if (!acc[monthName]) {
          acc[monthName] = [];
        }

        acc[monthName].push(leave);
        return acc;
      }, {});

      return leavesByMonth;
    } catch (error) {
      console.error("Error fetching leaves:", error);
      throw error;
    }
  }

  getMonthName(monthIndex) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[monthIndex];
  }

  async queryLeaves({ employeeId, start, end }) {
    try {
      const leaves = await AttendanceModel.find({
        employeeId,
        start: { $gte: start, $lte: end },
        status: { $in: ["Approved", "Pending", "Rejected"] },
      }).populate("leaveTypeDetailsId");

      return leaves;
    } catch (error) {
      console.error("Error querying leaves:", error);
      throw error;
    }
  }
  async queryLeavesRejected({ employeeId, start, end }) {
    try {
      const leaves = await AttendanceModel.find({
        employeeId,
        start: { $gte: start, $lte: end },
        status: { $in: ["Approved", "Pending", "Deleted"] },
      }).populate("leaveTypeDetailsId");

      return leaves;
    } catch (error) {
      console.error("Error querying leaves:", error);
      throw error;
    }
  }
}
module.exports = { LeaveManager };
