const catchAssyncError = require("../middleware/catchAssyncError");
const { DepartmentModel } = require("../models/Department/departmentSchema.js");
const {
  EmployeeManagementModel,
} = require("../models/employeManager/employeeManagementSchema.js");
const { EmployeeModel } = require("../models/employeeSchema.js");
const { OrganisationModel } = require("../models/organizationSchema");
const {
  SelectedShiftModel,
} = require("../models/shiftManagement/selectedShiftSchema.js");
const {
  WorkFlowDeptModel,
} = require("../models/workFlowCreateDeptSchema/workFlowCreateDept.js");
const logger = require("../utils/logger/index.js");

exports.getNotifications = catchAssyncError(async (req, res, next) => {
  try {
    const approvalRequest = await WorkFlowDeptModel.find({
      status: "pending",
    }).populate("request_raised_by");
    res.json({ approvalRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.updateNotification = catchAssyncError(async (req, res, next) => {
  try {
    const { status } = req.body;
    const approvalRequest = await WorkFlowDeptModel.findByIdAndUpdate(
      req.params.notificationId,
      {
        $set: {
          status,
        },
      },
      { new: true }
    );
    res.json({ approvalRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.createDepartment = catchAssyncError(async (req, res, next) => {
  try {
    const {
      departmentName,
      departmentId,
      dept_cost_center_id,
      departmentDescription,
      costCenterName,
      costCenterDescription,
      departmentHeadName,
      departmentHeadDelegateName,
      departmentLocation,
    } = req.body;
    const creator = req.user.user._id;
    const { organizationId } = req.params;
    const { role } = req.query;
    console.log("role", role);

    const organization = await OrganisationModel.findById(
      organizationId
    ).select("creator");

    const hrIds = await EmployeeModel.find({
      organizationId: organizationId,
      profile: "HR",
    }).select("_id");

    const hrIdList = hrIds.map((hr) => hr._id);
    let approvalIds = [...hrIdList, organization.creator];

    const existingDepartment = await DepartmentModel.findOne({
      departmentName,
      organizationId: organizationId,
    });
    console.log("existingDepartment", existingDepartment);
    if (existingDepartment) {
      res.status(400).json({ error: "Department name must be unique" });
    } else {
      const status =
        role === "Super-Admin" || role === "HR" ? "Accepted" : "Pending";

      const newDepartment = new DepartmentModel({
        departmentName,
        departmentId,
        departmentDescription,
        departmentLocation,
        costCenterName,
        costCenterDescription,
        departmentHeadName: departmentHeadName || null,
        departmentHeadDelegateName: departmentHeadDelegateName || null,
        dept_cost_center_id,
        approvalIds,
        creator: creator,
        organizationId: organizationId,
        status,
      });

      await newDepartment.save();

      res.status(201).json({
        message: `${departmentName} department created successfully.`,
        department: newDepartment,
      });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
});

exports.updateDepartment = catchAssyncError(async (req, res, next) => {
  try {
    const {
      departmentName,
      departmentId,
      dept_cost_center_id,
      departmentDescription,
      costCenterName,
      costCenterDescription,
      departmentHeadName,
      departmentHeadDelegateName,
      departmentLocation,
    } = req.body;
    console.log(`🚀 ~ file: departmentController.js:195 ~ req.body:`, req.body);

    const { organizationId, deptId } = req.params;
    const { role } = req.query;

    const organization = await OrganisationModel.findById(
      organizationId
    ).select("creator");

    const hrIds = await EmployeeModel.find({
      organizationId: organizationId,
      profile: "HR",
    }).select("_id");

    const hrIdList = hrIds.map((hr) => hr._id);
    let approvalIds = [...hrIdList, organization.creator];

    const existingDepartment = await DepartmentModel.findOne({
      _id: deptId,
      organizationId: organizationId,
    });

    if (!existingDepartment) {
      res.status(404).json({ error: "Department not found" });
    } else {
      // Checking if the updated department name is unique within the organization
      const duplicateDepartment = await DepartmentModel.findOne({
        departmentName,
        organizationId: organizationId,
        _id: { $ne: deptId },
        status: "Accepted",
      });
      console.log("duplication department name", duplicateDepartment);

      if (duplicateDepartment) {
        res.status(400).json({ error: "Department name must be unique" });
      } else {
        const status =
          role === "Super-Admin" || role === "HR" ? "Accepted" : "Pending";

        existingDepartment.departmentName = departmentName;
        existingDepartment.departmentId = departmentId;
        existingDepartment.dept_cost_center_id = dept_cost_center_id;
        existingDepartment.departmentDescription = departmentDescription;
        existingDepartment.costCenterName = costCenterName;
        existingDepartment.costCenterDescription = costCenterDescription;
        existingDepartment.departmentHeadName = departmentHeadName || null;
        existingDepartment.departmentHeadDelegateName =
          departmentHeadDelegateName || null;
        existingDepartment.departmentLocation = departmentLocation;
        existingDepartment.approvalIds = approvalIds;
        existingDepartment.status = status;

        await existingDepartment.save();

        res.status(200).json({
          message: `${departmentName} department updated successfully.`,
          department: existingDepartment,
        });
      }
    }
  } catch (error) {
    console.log(`🚀 ~ file: departmentController.js:192 ~ error:`, error);
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
});
exports.getDepartmentById = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId, deptId } = req.params;

    const department = await DepartmentModel.findOne({
      _id: deptId,
      organizationId,
      status: "Accepted",
    })
      .populate("departmentLocation")
      .populate("departmentHeadName")
      .populate("departmentHeadDelegateName");

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({
      data: department,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error from function", error: error.message });
  }
});

exports.getDepartmentDetails = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.params;

    const departments = await DepartmentModel.find({
      organizationId,
      status: "Accepted",
    })
      .populate("departmentLocation")
      .populate("departmentHeadName")
      .populate("departmentHeadDelegateName");

    const departmentCount = await DepartmentModel.countDocuments({
      organizationId,
    });

    if (!departments.length) {
      return res.status(404).json({ message: "Departments not found" });
    }

    res.status(200).json({
      departments,
      departmentCount,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error from function", error: error.message });
  }
});

exports.getCostCenterId = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.params;

    // Fetch only the required fields from the Department model
    const departments = await DepartmentModel.find(
      { organizationId },
      "departmentId dept_cost_center_id departmentName"
    );

    res.status(200).json({
      status: "success",
      data: {
        departments,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

exports.deleteDepartment = catchAssyncError(async (req, res, next) => {
  try {
    const organizationId = req.params.organizationId;
    const deptId = req.params.deptId;

    // Ensure that the department to be deleted belongs to the specified organization
    const deletedDepartment = await DepartmentModel.findOneAndDelete({
      _id: deptId,
      organizationId: organizationId,
    });

    if (!deletedDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({ message: "Department Deleted", deletedDepartment });
  } catch (error) {
    res.status(500).json({ message: error.message });
    s;
  }
});

exports.deleteDepartments = catchAssyncError(async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedDepartment = await DepartmentModel.findByIdAndRemove(id);

    if (!deletedDepartment) {
      return res
        .status(404)
        .json({ message: "Department not found", error: error.message });
    }

    res.status(200).json({
      message: "Department deleted successfully.",
      deletedDepartment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

exports.getDepartmentsByLocation = catchAssyncError(async (req, res, next) => {
  try {
    const id = req.params.locationId;
    const departments = await DepartmentModel.find({ departmentLocation: id });
    res.status(200).json({
      message: departments,
    });
  } catch (e) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

exports.getDepartmentEmployees = catchAssyncError(async (req, res, next) => {
  try {
    const id = req.user.user._id;
    const deptHead = await EmployeeModel.findById(id);
    const deptEmployees = await EmployeeModel.find({
      deptname: deptHead.deptname,
      profile: { $nin: ["Department-Head"] },
    });

    return res.json(deptEmployees.length);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error retrieving employees",
      error: err.message,
    });
  }
});

exports.getDepartmentManagers = catchAssyncError(async (req, res, next) => {
  try {
    const id = req.user.user._id;
    console.log(req.user.user);
    const deptHead = await EmployeeModel.findById(id);
    const deptEmployees = await EmployeeModel.find({
      deptname: deptHead.deptname,
      profile: { $in: ["Manager"] },
    });

    res.json({ success: true, deptEmployees });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error retrieving employees",
      error: err.message,
    });
  }
});

exports.getDeptShiftEmployee = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const currentDate = new Date();

    const id = req.user.user._id;
    const deptHead = await EmployeeModel.findById(id);
    const deptEmployees = await EmployeeModel.find({
      deptname: deptHead.deptname,
      profile: { $nin: ["Department-Head"] },
    });

    const getEmployeesOnShift = await SelectedShiftModel.find({
      organizationId: organizationId,
      start: { $lt: currentDate },
      end: { $gt: currentDate },
      employeeId: { $in: deptEmployees },
    });

    return res.status(200).json(getEmployeesOnShift.length);
  } catch (error) {
    console.error(error);
  }
});

exports.getManagerShiftEmployee = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const currentDate = new Date();

    const id = req.user.user._id;
    const managerData = await EmployeeManagementModel.find({
      managerId: id,
    });

    const reporteeIds = managerData
      .map((manager) => manager.reporteeIds)
      .flat();

    const employeesUnderManager = await EmployeeModel.find({
      _id: { $in: reporteeIds },
    });

    const shiftData = employeesUnderManager.map((shift) => shift._id);

    const getEmployeesOnShift = await SelectedShiftModel.find({
      organizationId: organizationId,
      start: { $lt: currentDate },
      end: { $gt: currentDate },
      employeeId: { $in: shiftData },
    });

    return res.status(200).json(getEmployeesOnShift.length);
  } catch (error) {
    console.error(error);
  }
});

exports.getDeptForOrg = catchAssyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const getOrgs = await DepartmentModel.find({
      organizationId: id,
    });

    return res.status(200).json({ getOrgs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

exports.getDepartmentToApproval = catchAssyncError(async (req, res, next) => {
  try {
    const approvalIds = req.user.user._id;
    const organizationId = req.user.user.organizationId;

    const pendingAddDepartment = await DepartmentModel.find({
      $or: [{ approvalIds: approvalIds }],
      organizationId: organizationId,
      status: "Pending",
    }).populate([
      "creator",
      "departmentLocation",
      "departmentHeadName",
      "departmentHeadDelegateName",
    ]);
    res.status(200).json({ success: true, data: pendingAddDepartment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

exports.AcceptOrRejectDepartment = catchAssyncError(async (req, res, next) => {
  try {
    const { deptId } = req.params;
    const { action } = req.body;
    console.log("action", action);
    if (action !== "accept" && action !== "reject") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid action" });
    }
    const updateDepartment = await DepartmentModel.findByIdAndUpdate(
      (_id = deptId),
      { status: action === "accept" ? "Accepted" : "Rejected" },
      { new: true }
    );
    if (!updateDepartment) {
      return res
        .status(404)
        .json({ success: false, message: "Department data not found" });
    }
    res.status(200).json({ success: true, data: updateDepartment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

exports.sendNotificationToEmp = catchAssyncError(async (req, res, next) => {
  try {
    const creator = req.user.user._id;
    const organizationId = req.user.user.organizationId;

    const department = await DepartmentModel.find({
      creator: creator,
      organizationId: organizationId,
      status: { $in: ["Accepted", "Rejected"] },
    }).populate(["creator", "approvalIds"]);

    res.status(200).json({ success: true, data: department });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
