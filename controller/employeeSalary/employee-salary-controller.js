const catchAssyncError = require("../../middleware/catchAssyncError");
const {
  EmployeeSalaryModel,
} = require("../../models/employeeSalarySchema/employeeSalarySchema");

const mongoose = require("mongoose");
const { EmployeeModel } = require("../../models/employeeSchema");
const { DepartmentModel } = require("../../models/Department/departmentSchema");
const {
  EmployeeManagementModel,
} = require("../../models/employeManager/employeeManagementSchema");
const moment = require("moment");
const { OrganisationModel } = require("../../models/organizationSchema");

exports.addEmployeeSalaryDetails = catchAssyncError(async (req, res, next) => {
  const {
    employeeId,
    organizationId,
    month,
    year,
    income,
    deductions,
    emlCtr,
    totalGrossSalary,
    totalDeduction,
    totalNetSalary,
    numDaysInMonth,
    formattedDate,
    publicHolidaysCount,
    paidLeaveDays,
    unPaidLeaveDays,
    noOfDaysEmployeePresent,
  } = req.body;

  try {
    const existingSalary = await EmployeeSalaryModel.findOne({
      employeeId,
      organizationId,
      salary: {
        $elemMatch: { month, year },
      },
    });

    if (existingSalary) {
      return res.status(400).json({
        success: false,
        message: "Salary for this month and year already exists.",
      });
    }

    let employeeSalary = await EmployeeSalaryModel.findOne({
      employeeId,
      organizationId,
    });

    if (!employeeSalary) {
      employeeSalary = new EmployeeSalaryModel({
        employeeId,
        organizationId,
        salary: [],
      });
    }

    employeeSalary.salary.push({
      employeeId,
      organizationId,
      month,
      year,
      income,
      deductions,
      emlCtr,
      totalGrossSalary,
      totalDeduction,
      totalNetSalary,
      numDaysInMonth,
      formattedDate,
      publicHolidaysCount,
      paidLeaveDays,
      unPaidLeaveDays,
      noOfDaysEmployeePresent,
      NotificationCount: 1
    });

    await employeeSalary.save();

    return res.status(201).json({
      success: true,
      message: "Salary details added successfully.",
    });
  } catch (error) {
    console.error("Error adding salary details:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to add salary details.",
      details: error.message,
    });
  }
});

// API endpoint to retrieve salary data within a date range
exports.getEmployeeSalaryPerFinancialYear = catchAssyncError(
  async (req, res, next) => {
    let { fromDate, toDate, empId } = req.query;

    if (!empId) {
      empId = req.user.user._id;
    }
    try {
      const salaryData = await EmployeeSalaryModel.findOne({
        employeeId: empId,
      });

      if (!salaryData) {
        return res.json({
          filteredSalaryData: 0,
          TotalInvestInvestment: 0,
        });
      }

      fromDate = moment(fromDate, "M-YYYY");
      toDate = moment(toDate, "M-YYYY");

      const filteredSalaryData = salaryData?.salary?.filter((salary) => {
        const salaryDate = moment(
          `${salary.year}-${salary.month + 1}`,
          "YYYY-M"
        );
        return salaryDate.isBetween(fromDate, toDate, null, "[]"); // '[]' includes both start and end dates
      });

      filteredSalaryData.sort((a, b) => {
        if (a.year === b.year) {
          return a.month - b.month;
        }
        return a.year - b.year;
      });

      let TotalInvestInvestment = filteredSalaryData.reduce((a, i) => {
        return (a += parseFloat(i.totalGrossSalary));
      }, 0);

      res.json({ filteredSalaryData, TotalInvestInvestment });
    } catch (error) {
      console.error("Error fetching salary data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// PF challan

exports.getPFChallan = catchAssyncError(async (req, res, next) => {
  try {
    const { year, month, organizationId } = req.params;
    console.log(`🚀 ~ organizationId:`, organizationId);
    const getSalaryOfEmployees = await EmployeeSalaryModel.find({
      organizationId: req.user.user.organizationId,
    }).populate("employeeId");

    const data = getSalaryOfEmployees.map((emp) => {
      return {
        empData: emp?.employeeId,
        salary: emp?.salary.find(
          (item) =>
            item.month === parseInt(month) && item.year === parseInt(year)
        ),
      };
    });

    const getPFExcel = data
      .map((item) => {
        const basicDA =
          parseInt(item?.salary?.basicSalary) +
            parseInt(item?.salary?.daSalary) <
            15000
            ? parseInt(item?.salary?.basicSalary) +
            parseInt(item?.salary?.daSalary)
            : 15000;
        if (
          !!item?.empData?.first_name &&
          !!item?.salary?.totalNetSalary &&
          !!item?.empData?.uanNo
        ) {
          return {
            uanno: item?.empData?.uanNo,
            name: `${item?.empData?.gender === "male" ? "Mr" : "Mrs"} ${item?.empData?.first_name
              } ${item?.empData?.last_name}`,
            grossSalary: parseInt(item?.salary?.totalNetSalary),
            epfWAGES: basicDA,
            epsWages: basicDA,
            edliWAGES: basicDA,
            epfCr: basicDA * 0.12,
            epsCr: basicDA * 0.0833,
            epfEpsDIFFR: basicDA * 0.0367,
            ncpDays: item?.salary?.unPaidLeaveDays ?? 0,
            refundOnAdvanced: 0,
          };
        }
      })
      .filter(Boolean);
    console.log(getPFExcel, "orgID");
    return res.json(getPFExcel);
  } catch (error) {
    console.log(error);
  }
});

exports.getESICChallan = catchAssyncError(async (req, res, next) => {
  try {
    const { year, month, organizationId } = req.params;
    console.log(`🚀 ~ organizationId:`, organizationId);
    const getSalaryOfEmployees = await EmployeeSalaryModel.find({
      organizationId: req.user.user.organizationId,
    }).populate("employeeId");

    const data = getSalaryOfEmployees.map((emp) => {
      return {
        empData: emp?.employeeId,
        salary: emp?.salary?.find(
          (item) =>
            item.month === parseInt(month) && item.year === parseInt(year)
        ),
      };
    });

    const getESICExcel = data
      .map((item) => {
        const onlyAvilable = item?.empData?.pwd
          ? parseInt(item?.salary?.totalNetSalary) <= 25000
          : parseInt(item?.salary?.totalNetSalary) <= 21000;

        if (onlyAvilable) {
          if (
            !!item?.empData?.first_name &&
            !!item?.salary?.totalNetSalary &&
            !!item?.empData?.esicNo
          ) {
            const empCtr =
              (parseInt(item?.salary?.totalNetSalary) * 0.75) / 100;
            const emlCtr =
              (parseInt(item?.salary?.totalNetSalary) * 3.25) / 100;
            return {
              esicno: item?.empData?.esicNo,
              name: `${item?.empData?.gender === "male" ? "Mr" : "Mrs"} ${item?.empData?.first_name
                } ${item?.empData?.last_name}`,
              grossSalary: parseInt(item?.salary?.totalNetSalary),
              epmCtr: Math.round(empCtr),
              eplCtr: Math.round(emlCtr),
              epfEpsDIFFR: empCtr + emlCtr,
              workingDays: item?.salary?.noOfDaysEmployeePresent ?? 0,
              reasonCode: 0,
              lastDay: "-",
            };
          }
        }
      })
      .filter(Boolean);

    return res.json(getESICExcel);
  } catch (error) {
    console.log(error);
  }
});

exports.getOragnizationChalaan = catchAssyncError(async (req, res, next) => {
  try {
    const { organisationId, year } = req.params;
    const data = await EmployeeSalaryModel.find({
      organisationId,
    });
  } catch (error) {
    console.log(error);
  }
});
// Overall Organization data with filter apis

exports.getOrganizationSalaryOverview = catchAssyncError(
  async (req, res, next) => {
    try {
      const { organizationId, year } = req.params;
      const organizationData = await OrganisationModel.findById(organizationId);
      const data = await EmployeeSalaryModel.aggregate([
        {
          $match: {
            organizationId: mongoose.Types.ObjectId(organizationId),
          },
        },
        {
          $unwind: "$salary",
        },
        {
          $group: {
            _id: {
              year: "$salary.year",
              month: "$salary.month",
            },
            totalNetSalary: { $sum: { $toDouble: "$salary.totalNetSalary" } },
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            totalNetSalary: 1,
          },
        },
      ]);

      const filterData = data.filter((item) => {
        return item.year === Number(year);
      });
      return res.json({ data: filterData, header: organizationData });
    } catch (error) {
      console.log(error);
      next();
    }
  }
);

exports.getDepartmentSalaryOverview = catchAssyncError(
  async (req, res, next) => {
    try {
      const { departmentId, year } = req.params;

      const departmentData = await DepartmentModel.findById(departmentId);

      if (!mongoose.Types.ObjectId(departmentId)) {
        return res.json({ message: "Department id not found", status: false });
      }

      const employeeIds = await EmployeeModel.find({
        deptname: {
          $in: departmentId,
        },
      }).select("_id");

      const data = await EmployeeSalaryModel.aggregate([
        {
          $match: {
            employeeId: { $in: employeeIds.map((emplooyee) => emplooyee._id) },
          },
        },
        {
          $unwind: "$salary",
        },
        {
          $group: {
            _id: {
              year: "$salary.year",
              month: "$salary.month",
            },
            totalNetSalary: { $sum: { $toDouble: "$salary.totalNetSalary" } },
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            totalNetSalary: 1,
          },
        },
      ]);

      const filterData = data.filter((item) => {
        return item.year === Number(year);
      });

      return res.json({ data: filterData, header: departmentData });
    } catch (error) {
      console.log(error);
      next();
    }
  }
);

exports.getLocationSalaryOverview = catchAssyncError(async (req, res, next) => {
  try {
    const { locationId, year } = req.params;

    if (!mongoose.Types.ObjectId(locationId)) {
      return res.json({ message: "Location not found", status: false });
    }

    const department = await DepartmentModel.find({
      departmentLocation: locationId,
    }).select("_id");

    const employeeIds = await EmployeeModel.find({
      deptname: {
        $in: department.map((d) => d._id),
      },
    }).select("_id");

    const data = await EmployeeSalaryModel.aggregate([
      {
        $match: {
          employeeId: { $in: employeeIds.map((emplooyee) => emplooyee._id) },
        },
      },
      {
        $unwind: "$salary",
      },
      {
        $group: {
          _id: {
            year: "$salary.year",
            month: "$salary.month",
          },
          totalNetSalary: { $sum: { $toDouble: "$salary.totalNetSalary" } },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalNetSalary: 1,
        },
      },
    ]);

    const filterData = data.filter((item) => {
      return item.year === Number(year);
    });

    return res.json(filterData);
  } catch (error) {
    console.log(error);
    next();
  }
});

exports.getManagerSalaryOverview = catchAssyncError(async (req, res, next) => {
  try {
    const { managerId } = req.params;

    if (!mongoose.Types.ObjectId(managerId)) {
      return res.json({ message: "Location not found", status: false });
    }

    const employeesUnderManager = await EmployeeManagementModel.findOne({
      managerId: managerId,
    });

    const data = await EmployeeSalaryModel.aggregate([
      {
        $match: {
          employeeId: {
            $in: employeesUnderManager.reporteeIds,
          },
        },
      },
      {
        $unwind: "$salary",
      },
      {
        $group: {
          _id: {
            year: "$salary.year",
            month: "$salary.month",
          },
          totalNetSalary: { $sum: { $toDouble: "$salary.totalNetSalary" } },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalNetSalary: 1,
        },
      },
    ]);

    return res.json(data);
  } catch (error) {
    console.log(error);
    next();
  }
});

// Single salary overview
exports.getEmployeeSalaryDetails = catchAssyncError(async (req, res, next) => {
  const { employeeId, organisationId } = req.params;
  console.log("employeeId", employeeId, "organisationId", organisationId)
  try {
    const employeeSalary = await EmployeeSalaryModel.findOne({
      employeeId,
      organizationId: organisationId,
    })
      .populate({
        path: "employeeId",
        populate: [
          { path: "designation" },
          { path: "worklocation" },
          { path: "deptname" },
        ],
      })
      .populate("organizationId");

    if (!employeeSalary) {
      // If salary details are not found
      return res.status(404).json({
        success: false,
        error: "Salary is not calculated yet",
        message: "Salary is not calculated yet.",
      });
    }

    // Ensure NotificationCount is zero for all salary entries
    const salaryDetails = employeeSalary.salary.map((entry) => ({
      ...entry.toObject(),
      // NotificationCount: 0, // Set NotificationCount to zero
    }));

    return res.status(200).json({
      success: true,
      salaryDetails,
      employeeInfo: employeeSalary.employeeId,
      organizationInfo: employeeSalary.organizationId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Salary is not calculated yet",
      details: error.message,
    });
  }
});

//notification count zero
exports.getEmployeeSalaryDetailsNoti = catchAssyncError(async (req, res, next) => {
  const { employeeId, organisationId } = req.params; // Assuming employeeId and organisationId are in the URL parameters

  // Validate parameters
  if (!employeeId || !organisationId) {
    return res.status(400).json({
      success: false,
      message: "Employee ID and Organization ID are required.",
    });
  }

  try {
    const employeeSalary = await EmployeeSalaryModel.findOne({
      employeeId,
      organizationId: organisationId, // Ensure this matches the model field name
    })
      .populate({
        path: "employeeId",
        populate: [
          { path: "designation" },
          { path: "worklocation" },
          { path: "deptname" },
        ],
      })
      .populate("organizationId");

    if (!employeeSalary) {
      console.error("No salary details found for:", { employeeId, organisationId });
      return res.status(404).json({
        success: false,
        error: "Salary is not calculated yet",
        message: "Salary is not calculated yet.",
      });
    }

    // Check if salary exists and is an array
    if (!Array.isArray(employeeSalary.salary)) {
      console.error("Salary is not an array:", employeeSalary.salary);
      return res.status(500).json({
        success: false,
        error: "Unexpected structure of salary data.",
      });
    }

    // Update NotificationCount to zero for all salary entries
    await EmployeeSalaryModel.updateOne(
      { employeeId, organizationId: organisationId },
      { $set: { "salary.$[].NotificationCount": 0 } } // This will set NotificationCount to 0 for all salary entries
    );

    // Retrieve the updated salary details to return in the response
    const updatedEmployeeSalary = await EmployeeSalaryModel.findOne({
      employeeId,
      organizationId: organisationId,
    })
      .populate({
        path: "employeeId",
        populate: [
          { path: "designation" },
          { path: "worklocation" },
          { path: "deptname" },
        ],
      })
      .populate("organizationId");

    const salaryDetails = updatedEmployeeSalary.salary.map((entry) => ({
      ...entry.toObject(),
      NotificationCount: 0, // Ensure this is set to zero in the response
    }));

    return res.status(200).json({
      success: true,
      salaryDetails,
      employeeInfo: updatedEmployeeSalary.employeeId,
      organizationInfo: updatedEmployeeSalary.organizationId,
    });
  } catch (error) {
    console.error("Error retrieving employee salary details:", error);
    return res.status(500).json({
      success: false,
      error: "An error occurred while retrieving salary details.",
      details: error.message,
    });
  }
});



exports.getEmployeeSalaryDetailsForYear = catchAssyncError(
  async (req, res, next) => {
    const { employeeId, organisationId, year } = req.params; // Assuming employeeId and organisationId are in the URL parameters
    try {
      const employeeSalary = await EmployeeSalaryModel.findOne({
        employeeId,
        organizationId: organisationId,
        year: year,
      })
        .populate({
          path: "employeeId",
          populate: [
            { path: "designation" },
            { path: "worklocation" },
            { path: "deptname" },
          ],
        })
        .populate("organizationId");

      if (!employeeSalary) {
        // If salary details are not found
        return res.status(404).json({
          success: false,
          error: "Salary is not calculated yet",
          message: "Salary is not calculated yet.",
        });
      }

      const employeeSalaryViaYear = employeeSalary.salary.filter((item) => {
        return item.year === Number(year);
      });

      // Assuming salary details are stored as an array of objects within the 'salary' field
      const salaryDetails = employeeSalary.salary;

      return res.status(200).json({
        success: true,
        salaryDetails,
        employeeInfo: employeeSalary.employeeId,
        organizationInfo: employeeSalary.organizationId,
        employeeSalaryViaYear,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Salary is not calculated yet",
        details: error.message,
      });
    }
  }
);
