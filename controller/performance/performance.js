const moment = require("moment");
const {
  EmployeeManagementModel,
} = require("../../models/employeManager/employeeManagementSchema");
const { EmployeeModel } = require("../../models/employeeSchema");

const { GoalsModel } = require("../../models/performance/GoalSchema");
const { SingleGoalsModel } = require("../../models/performance/SingleGoals");
const {
  PerformanceModel,
} = require("../../models/performance/performanceSetup");
const uuid = require("uuid");
const {
  EmployeeGoalsModel,
} = require("../../models/performance/EmployeeGoalsSchema");

exports.createPerformanceSetting = async (req, res) => {
  try {
    const { organisationId } = req.params;
    const { performanceSetting } = req.body;

    let existingSetting = await PerformanceModel.findOne({
      organizationId: organisationId,
    });

    if (existingSetting) {
      // Update existing performance setting
      console.log("existing setting", existingSetting);
      existingSetting = { ...performanceSetting };
      await PerformanceModel.findOneAndUpdate(
        { organizationId: organisationId },
        { $set: existingSetting }
      );
    } else {
      // Create new performance setting
      const performanceSettingData = new PerformanceModel({
        ...performanceSetting,
        organizationId: organisationId,
      });
      await performanceSettingData.save();
    }

    return res.status(200).json({
      success: true,
      message: "Performance setting updated successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getOrgHierarchy = async (req, res) => {
  try {
    let hierarchy = [];
    const { organisationId } = req.params;

    const getHR = await EmployeeModel.find({
      profile: { $elemMatch: { $eq: "HR" } },
      organizationId: organisationId,
    });
    console.log(`🚀 ~ getHR:`, getHR);

    const getManager = await EmployeeModel.find({
      _id: req.user.user._id,
    }).populate("mgrempid");
    console.log(`🚀 ~ getManager:`, getManager);

    if (getManager[0].mgrempid) {
      hierarchy.push({
        name: "Manager",
        title: `${getManager[0]?.mgrempid?.first_name} ${getManager[0]?.mgrempid?.last_name}`,
        image: `${getManager[0].user_logo_url}`,
        children: [],
      });
    } else {
      getHR.forEach(async (hr) => {
        hierarchy.push({
          name: "HR",
          title: `${hr.first_name} ${hr.last_name}`,
          image: `${hr.user_logo_url}`,
          children: [],
        });
      });
    }

    const orgHierarchy = await EmployeeManagementModel.find({
      managerId: req.user.user._id,
    })
      .populate("reporteeIds")
      .populate("managerId");

    orgHierarchy.forEach((element) => {
      if (element.managerId) {
        hierarchy[0]?.children.push({
          name: "Manager",
          title: `${element.managerId.first_name} ${element.managerId.last_name}`,
          image: `${element.user_logo_url}`,
          children: element?.reporteeIds?.map((reportee) => ({
            name: "Employee",
            title: `${reportee.first_name} ${reportee.last_name}`,
            image: `${reportee.user_logo_url}`,
          })),
        });
      }
    });

    if (!orgHierarchy) {
      return res.status(400).json({
        success: false,
        message: "You are not a manager ",
      });
    }

    return res.send(hierarchy);
  } catch (error) {
    console.log(error);
  }
};

exports.getPerformanceSetting = async (req, res, next) => {
  try {
    const { organisationId } = req.params;
    const performanceSetting = await PerformanceModel.findOne({
      organizationId: organisationId,
    });

    console.log(req.user.user.organizationId, "req.user.user.organizationId");

    if (!performanceSetting) {
      return res.status(404).json("Performance setting not found");
    }

    return res.status(200).json(performanceSetting);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

exports.getGoalById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const goal = await GoalsModel.findById(id).populate("assignee");

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    return res.status(200).json(goal);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

exports.updateSingleGoal = async (req, res, next) => {
  const { id } = req.params;
  const { data } = req.body;
  console.log(`🚀 ~ data:`, data);

  try {
    const goal = await SingleGoalsModel.findById(id);
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "No goal found with this id",
      });
    }

    const currentPerformanceCycle = await PerformanceModel.findOne({
      organizationId: goal.organizationId,
    });

    let updatedGoals;
    if (goal.downcasted && currentPerformanceCycle.stages === "Goal setting") {
      updatedGoals = await SingleGoalsModel.updateMany(
        {
          creatorId: goal.creatorId,
          downcastedId: goal.downcastedId,
        },
        { $set: { ...data } },
        { new: true }
      );
    } else {
      updatedGoals = await SingleGoalsModel.findByIdAndUpdate(
        id,
        { $set: { empId: data?.assignee?.value, ...data } },
        { new: true }
      );
    }

    if (!updatedGoals) {
      return res.status(404).json({
        success: false,
        message: "No goals found for these employees",
      });
    }

    return res.status(200).json({ message: `Goals updated` });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

exports.deleteSingleGoal = async (req, res, next) => {
  const { id } = req.params;

  try {
    const goal = await SingleGoalsModel.findById(id);
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "No goal found with this id",
      });
    }

    const currentPerformanceCycle = await PerformanceModel.findOne({
      organizationId: goal.organizationId,
    });

    let updatedGoals;

    if (currentPerformanceCycle.stages !== "Goal setting") {
      return res.status(400).json({
        success: false,
        message: "Unable to delete goal as goal setting stage has been ended",
      });
    }
    if (goal.downcasted) {
      updatedGoals = await SingleGoalsModel.deleteMany({
        creatorId: goal.creatorId,
        downcastedId: goal.downcastedId,
      });
    } else {
      updatedGoals = await SingleGoalsModel.findByIdAndDelete(id);
    }

    if (!updatedGoals) {
      return res.status(404).json({
        success: false,
        message: "No goals found for these employees",
      });
    }

    return res
      .status(200)
      .json({ success: true, message: `Goals deleted successfully` });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

exports.getOrganizationGoals = async (req, res, next) => {
  try {
    const organizationId = req.user.user.organizationId;
    const organizationGoals = await GoalsModel.find({
      organizationId: organizationId,
    });

    if (!organizationGoals) {
      return res.status(404).json({
        success: false,
        message: "Organization goals not found",
      });
    }

    return res.status(200).json(organizationGoals);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

exports.getEmployeeGoals = async (req, res, next) => {
  try {
    const { _id } = req.user.user;
    const organizationId = req.user.user.organizationId;
    const organizationGoals = await GoalsModel.find({
      organizationId: organizationId,
      assignee: { $in: [_id] },
    });

    if (!organizationGoals) {
      return res.status(404).json({
        success: false,
        message: "Organization goals not found",
      });
    }

    return res.status(200).json(organizationGoals);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

exports.submitGoals = async (req, res, next) => {
  try {
    const { goalId } = req.body;
    const empId = req.user.user._id;
    const { organizationId } = req.user.user;
    if (!goalId) {
      return res.status(400).json({ message: "Goal goalId is required" });
    }
    if (!empId) {
      return res.status(400).json({ message: "Employee id is required" });
    }

    const singleGoal = new SingleGoalsModel({
      goalId,
      empId: empId,
      organizationId,
    });

    await singleGoal.save();
    return res.json({ message: "created successfully" });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Server error", error: e });
  }
};

//TODO use this
exports.getSingleGoals = async (req, res, next) => {
  try {
    const { id } = req.params;
    const goals = await SingleGoalsModel.findById(id).populate("empId");

    return res.status(200).json(goals);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

exports.createGoals = async (req, res, next) => {
  try {
    const { goals } = req.body;
    const { organizationId, _id } = req.user.user;

    const performance = await PerformanceModel.findOne({
      organizationId,
    });

    let assignees;
    let status = "pending";
    let isGoalSettingCompleted = false;
    let approver = req.user.user._id;
    const downcastedId = uuid.v4();

    if (goals.downcasted) {
      if (goals.creatorRole === "HR") {
        const assignee = await EmployeeManagementModel.find({
          organizationId: req.user.user.organizationId,
        });
        assignees = assignee.map((emp) => emp.managerId);
        status = "Goal Approved";
        isGoalSettingCompleted = true;
      }

      if (goals.creatorRole === "Manager") {
        const assignee = await EmployeeManagementModel.findOne({
          managerId: req.user.user._id,
        });
        assignees = assignee?.reporteeIds.map((emp) => emp);

        if (performance?.isManagerApproval) {
          status = "Goal Approved";
          isGoalSettingCompleted = true;
        } else {
          status = "Goal Submitted";
        }
      }
    } else {
      if (goals.creatorRole === "HR") {
        assignees = goals?.assignee.map((emp) => emp.managerId);
        status = "Goal Approved";
        isGoalSettingCompleted = true;
      }

      if (goals.creatorRole === "Employee") {
        console.log(performance?.isManagerApproval);
        const assignee = await EmployeeManagementModel.findOne({
          reporteeIds: { $in: req.user.user._id },
        });
        approver = assignee?.managerId;
        if (performance?.isManagerApproval) {
          status = "Goal Submitted";
          console.log("this goals submitted");
        } else {
          status = "Goal Approved";
          console.log("this goals approved");
          isGoalSettingCompleted = true;
        }
      }

      if (goals.creatorRole === "Manager") {
        if (performance?.isManagerApproval) {
          status = "Goal Approved";
          isGoalSettingCompleted = true;
        } else {
          status = "Goal Submitted";
        }
      }

      assignees = goals.assignee;
    }

    const savedGoals = [];
    for (const empId of assignees) {
      const newGoal = new SingleGoalsModel({
        ...goals,
        organizationId,
        downcastedId,
        isGoalSettingCompleted,
        status,
        empId,
        creatorId: req.user.user._id,
        approverId: approver,
      });
      const savedGoal = await newGoal.save();
      savedGoals.push(savedGoal);
    }

    if (savedGoals.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Server error for creating goal please try again later",
      });
    }

    return res.status(201).json(savedGoals);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

//   const { empId } = req.params;

//   try {
//     const goals = await GoalsModel.find({
//       assignee: { $in: [empId] },
//     }).populate("assignee");

//     const singleGoals = await SingleGoalsModel.find({ empId });

//     const mergedGoals = goals.map((goal) => {
//       const singleGoal = singleGoals.find(
//         (singleGoal) => singleGoal.goalId.toString() === goal._id.toString()
//       );
//       return { ...goal._doc, singleGoal: singleGoal ? singleGoal._doc : null };
//     });

//     return res.status(200).json(mergedGoals);
//   } catch (err) {
//     return res
//       .status(500)
//       .json({ message: "Server error", error: err.message });
//   }
// };

exports.getManagerGoals = async (req, res, next) => {
  const { empId } = req.params;
  const { _id: creatorId } = req.user.user;

  try {
    const goals = await GoalsModel.find({
      assignee: { $in: [empId] },
      creatorId,
    }).populate("assignee");

    const singleGoals = await SingleGoalsModel.find({ empId });

    const mergedGoals = goals.map((goal) => {
      const singleGoal = singleGoals.find(
        (singleGoal) => singleGoal.goalId.toString() === goal._id.toString()
      );
      return { ...goal._doc, singleGoal: singleGoal ? singleGoal._doc : null };
    });

    return res.status(200).json(mergedGoals);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

//! Not required
exports.getHrGoals = async (req, res, next) => {
  const { organizationId } = req.user.user;

  try {
    const goals = await GoalsModel.find({
      organizationId,
    }).populate("assignee");

    const singleGoals = await SingleGoalsModel.find();

    const mergedGoals = goals.map((goal) => {
      const singleGoal = singleGoals.find(
        (singleGoal) => singleGoal.goalId.toString() === goal._id.toString()
      );
      return { ...goal._doc, singleGoal: singleGoal ? singleGoal._doc : null };
    });

    return res.status(200).json(mergedGoals);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

exports.getSingleBothGoals = async (req, res, next) => {
  const { id } = req.params;

  try {
    const goal = await GoalsModel.findOne({
      _id: id,
    }).populate("assignee");

    const singleGoals = await SingleGoalsModel.findOne({ goalId: id });

    const mergedGoals = {
      ...goal._doc,
      singleGoal: singleGoals ? singleGoals._doc : null,
    };

    return res.status(200).json(mergedGoals);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

exports.getEmployeesUnderForLeaves = async (req, res, next) => {
  const { _id, organizationId } = req.user.user;
  const { role } = req.params;
  const manager = await EmployeeModel.findById(_id);

  let employees;
  if (role === "Manager") {
    const empUnderManager = await EmployeeManagementModel.find({
      managerId: _id,
      // organizationId: manager.organizationId,
    }).select("reporteeIds");
    employees = empUnderManager;

    let emps = empUnderManager[0]?.reporteeIds?.map((ids) => ids);
    console.log(`🚀 ~ emps:`, emps, empUnderManager);
    employees = await EmployeeModel.find({ _id: { $in: emps } });
  } else {
    const empUnderManager = await EmployeeModel.find({
      organizationId: organizationId,
    });
    employees = empUnderManager;
  }

  return res.json(employees);
};

exports.getEmployeesUnderManager = async (req, res, next) => {
  try {
    const { _id, organizationId } = req.user.user;
    const { role } = req.params;
    const manager = await EmployeeModel.findById(_id);

    if (!manager) {
      return res.status(404).json({
        success: false,
        message: "Manager not found",
      });
    }

    let employees;
    if (role === "Manager") {
      const empUnderManager = await EmployeeManagementModel.find({
        managerId: _id,
      }).select("reporteeIds");

      let emps = empUnderManager[0]?.reporteeIds?.map((ids) => ids);
      console.log(`🚀 ~ emps:`, emps, empUnderManager);
      employees = await EmployeeModel.find({ _id: { $in: emps } });
    } else if (role === "Department-Head") {
      employees = await EmployeeModel.find({
        organizationId: manager.organizationId,
        departmentId: manager.deptname,
      });
    } else if (role === "HR" || role === "Super-Admin") {
      employees = await EmployeeModel.find({
        organizationId,
      });
    }

    if (employees?.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No employees found under this manager",
      });
    }

    return res.status(200).json(employees);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// new requets

exports.getDashboard = async (req, res, next) => {
  const { organizationId } = req.user.user;
  const { role } = req.params;
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not specified
  const skip = (page - 1) * limit;

  let empIds = [];

  const getCurrentPerformance = await PerformanceModel.findOne({
    organizationId,
  });

  if (getCurrentPerformance?.isFeedback) {
    const employees = await EmployeeModel.find({
      organizationId,
    });

    empIds.push(...employees.map((emp) => emp._id));
  } else {
    if (role === "Manager") {
      const empUnderManager = await EmployeeManagementModel.findOne({
        managerId: req.user.user._id,
      });

      empIds = empUnderManager?.reporteeIds?.map((emp) => emp) || [];
    }

    if (role === "HR") {
      const employees = await EmployeeModel.find({
        organizationId,
      });

      empIds.push(...employees.map((emp) => emp._id));
    }
  }

  // Fetch all employees with pagination
  const employees = await EmployeeModel.find({
    _id: { $in: empIds },
  })
    .skip(skip)
    .limit(limit);

  // Fetch goals for each employee
  const goalsPromises = employees.map((emp) =>
    EmployeeGoalsModel.find({ empId: emp._id })
      .populate("empId")
      .populate("goals")
  );

  const goals = await Promise.all(goalsPromises);

  // Group goals by employee
  let groupedGoals = employees.map((emp, i) => ({
    empId: { ...emp._doc },
    goals: goals[i]?.reduce((acc, goal) => [...acc, ...goal.goals], []) || [],
    others: goals[i]?.reduce((acc, goal) => [...acc, goal], []),
  }));

  if (
    getCurrentPerformance?.stages ===
    "Employee acceptance/acknowledgement stage"
  ) {
    let sendFilterData = groupedGoals.filter((item) => {
      return item?.others[0]?.isRevaluation === "Pending";
    });

    groupedGoals = sendFilterData;
  }

  // Optionally, fetch the total count of employees for pagination metadata
  const totalCount = await EmployeeModel.countDocuments({
    _id: { $in: empIds },
  });

  return res.status(200).json({
    totalCount,
    pages: Math.ceil(totalCount / limit),
    currentPage: page,
    data: groupedGoals,
  });
};

//TODO Employee Dahboard done on 1/07/2024

exports.getPerformanceTableForEmployee = async (req, res, next) => {
  try {
    const { empId } = req.params;

    const getGoalsTable = await EmployeeGoalsModel.findOne({
      empId,
    })
      .populate("goals")
      .populate("empId")
      .populate({
        path: "Rating.reviewerId", // Use dot notation to specify the path to the nested field
      });

    return res.status(200).json(getGoalsTable);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
};

exports.getPerformanceTable = async (req, res, next) => {
  try {
    const { role, organizationId } = req.params;

    let getGoalsTable;
    if (role === "Manager") {
      const employeeUnderManager = await EmployeeManagementModel.find({
        managerId: req.user.user._id,
      }).select("reporteeIds");

      const empIds = employeeUnderManager[0]?.reporteeIds?.map((emp) => emp);

      getGoalsTable = await EmployeeGoalsModel.find({
        empId: { $in: empIds },
      })
        .populate("goals")
        .populate("empId");
    }

    if (role === "HR") {
      getGoalsTable = await EmployeeGoalsModel.find({
        organizationId,
      })
        .populate("goals")
        .populate("empId");
    }

    return res.status(200).json(getGoalsTable);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error);
  }
};

exports.getEmployeeDashboard = async (req, res, next) => {
  try {
    const id = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Sorry we can't able to find the employee" });
    }
    const empdashboard = await EmployeeGoalsModel.findOne({
      empId: req.user.user._id,
    }).populate("goals");

    if (!empdashboard) {
      return res
        .status(401)
        .json({ message: "Cannot find goals for this emplloyee" });
    }

    return res.status(200).json(empdashboard);
  } catch (error) {
    console.log(error);
  }
};

exports.getPerformanceDashboard = async (req, res, next) => {
  try {
    const { organizationId } = req.user.user;
    const { role } = req.params;
    let query;
    if (role === "Manager") {
      const empUnderManager = await EmployeeManagementModel.findOne({
        managerId: req.user.user._id,
      });

      query = {
        empId: {
          $in: empUnderManager?.reporteeIds?.map((emp) => emp) || [],
        },
        organizationId,
      };
    }

    if (role === "HR") {
      query = {
        organizationId,
      };
    }

    if (role === "Employee") {
      query = {
        empId: req.user.user._id,
      };
    }

    const goals = await EmployeeGoalsModel.find(query).populate("empId");
    const performance = await PerformanceModel.findOne({
      organizationId,
    });

    const endDate = moment(performance?.enddate);
    const currentDate = moment();
    const isTimeFinished = endDate.diff(currentDate, "days") > -1;

    if (!goals) return res.status(404).json({ message: "No goals found" });

    let groupedGoals = goals.reduce((acc, goal) => {
      let empId = goal.empId._id.toString();
      if (!acc[empId]) {
        acc[empId] = {
          empId: goal.empId,
          goals: [],
          totalGoals: 0,
          completedGoals: 0,
          overdueGoals: 0,
        };
      }

      if (performance.stages === "Goal setting") {
        if (isGoalSettingCompleted) {
          acc[empId].completedGoals++;
        } else if (!isTimeFinished) {
          acc[empId].overdueGoals++;
        }
      }

      if (performance.stages === "Monitoring stage/Feedback collection stage") {
        if (goal.isMonitoringCompleted) {
          acc[empId].completedGoals++;
        } else if (!isTimeFinished) {
          acc[empId].overdueGoals++;
        }
      }

      if (
        performance.stages === "KRA stage/Ratings Feedback/Manager review stage"
      ) {
        if (goal.isReviewCompleted) {
          acc[empId].completedGoals++;
        } else if (!isTimeFinished) {
          acc[empId].overdueGoals++;
        }
      }

      if (performance.stages === "Employee acceptance/acknowledgement stage") {
        if (goal.isGoalCompleted) {
          acc[empId].completedGoals++;
        } else if (!isTimeFinished) {
          acc[empId].overdueGoals++;
        }
      }
      acc[empId].totalGoals++;
      let goalCopy = { ...goal._doc };
      delete goalCopy.empId;
      acc[empId].goals.push(goalCopy);
      return acc;
    }, {});

    let result = Object.values(groupedGoals);

    return res.status(200).json({ result });
  } catch (err) {
    console.log(err);
  }
};

exports.getSingleGoalsPreview = async (req, res, next) => {
  try {
    const { id, empId } = req.params;

    const goals = await SingleGoalsModel.findOne({
      _id: id,
      empId: empId,
    });

    return res.status(200).json(goals);
  } catch (error) {
    console.log(error);
  }
};

exports.getOrganizationGoalsByRole = async (req, res, next) => {
  try {
    const { organizationId } = req.user.user;
    const { role, empId, page = 1, search } = req.query;
    console.log(`🚀 ~ search:`, search);

    let goals = [];

    const performance = await PerformanceModel.findOne({
      organizationId,
    });

    let query = {
      organizationId,
      status: {
        $nin: ["pending"],
      },
    };

    if (role === "HR") {
      query = {
        organizationId: req.user.user.organizationId,
      };
    }

    if (role === "Manager") {
      let empUnderManager = await EmployeeManagementModel.findOne({
        managerId: req.user.user._id,
      });
      console.log(`🚀 ~ empUnderManager:`, empUnderManager);

      const allEmployeeWithManager = [
        ...(empUnderManager?.reporteeIds?.map((emp) => emp) || []),
        req.user.user._id,
      ];

      if (empId) {
        query = { empId, $nin: ["pending"] };
        console.log("this runs");
      } else {
        console.log("else this runs");
        query = {
          empId: {
            $in: allEmployeeWithManager,
          },
        };
      }
    }

    if (role === "Employee") {
      query = { empId: req.user.user._id };
    }

    if (search) {
      const regex = new RegExp(search, "i");

      if (empId) {
        query = {
          goal: { $regex: regex },
          empId,
          organizationId,
        };
      } else {
        query = {
          goal: { $regex: regex },
          organizationId,
        };
      }
    }

    const totalGoals = await SingleGoalsModel.countDocuments(query);
    const totalPages = Math.ceil(totalGoals / 10);
    const offset = (page - 1) * 10;

    goals = await SingleGoalsModel.find(query)
      .populate("empId")
      .skip(offset)
      .limit(10);

    return res.status(200).json({
      goals,
      totalPages,
      currentPage: page,
      totalGoals,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: "Server error", error: err });
  }
};

exports.getOrganizationGoalsStatus = async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const goals = await SingleGoalsModel.aggregate([
      { $match: { organizationId } },
      {
        $group: {
          _id: "$goalId",
          totalAssignees: { $sum: 1 },
          totalCompleted: {
            $sum: { $cond: [{ $eq: ["$status", "Goal Completed"] }, 1, 0] },
          },
          goals: { $push: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "organizationgoals",
          localField: "_id",
          foreignField: "_id",
          as: "goalData",
        },
      },
      {
        $project: {
          goalId: "$_id",
          totalAssignees: 1,
          totalCompleted: 1,
          goalData: { $arrayElemAt: ["$goalData", 0] },
        },
      },
    ]);

    return res.status(200).json(goals);
  } catch (err) {
    return res.status(400).json({ message: "Server error", error: err });
  }
};

//TODO 26/05 work rating

exports.giveRating = async (req, res, next) => {
  try {
    const { empId, rating, review } = req.body;

    const performanceCycle = await PerformanceModel.findOne({
      organizationId: req.user.user.organizationId,
    });

    const isEmployeeDocExists = await EmployeeGoalsModel.findOne({ empId });

    const isManagerRating = await EmployeeManagementModel.findOne({
      managerId: req.user.user._id,
      reporteeIds: { $in: empId },
    });

    // Get alll goals for selected Employee
    const getGoalsForEmployee = await SingleGoalsModel.find({
      empId: empId,
    }).select("_id");
    const goalsIds = getGoalsForEmployee.map((idx) => idx?._id);

    if (isManagerRating) {
      if (!isEmployeeDocExists) {
        await EmployeeGoalsModel.create({
          empId: empId,
          goals: goalsIds,
          managerRating: rating,
          managerFeedback: review,
          isReviewCompleted: true,
          isRevaluation: "To Do",
        });
        console.log("create new document");
      } else {
        await EmployeeGoalsModel.findOneAndUpdate(
          { empId },
          {
            $set: {
              managerRating: rating,
              managerFeedback: review,
              isReviewCompleted: true,
              isRevaluation: "To Do",
            },
          },
          { new: true }
        );

        console.log("update new document");
      }
    }

    if (performanceCycle?.isFeedback && !isManagerRating) {
      const updateResult = await EmployeeGoalsModel.findOneAndUpdate(
        { empId, "Rating.reviewerId": req.user.user._id },
        {
          $set: {
            "Rating.$.rating": rating,
            "Rating.$.comment": review,
          },
        },
        { new: true }
      );

      // Step 2: If no document was updated, add a new rating
      if (!updateResult) {
        const data = await EmployeeGoalsModel.findOneAndUpdate(
          { empId: empId }, // Ensure empId is correctly formatted and passed
          {
            $addToSet: {
              organizationId: req.user.user.organizationId,
              Rating: {
                rating: rating,
                comment: review,
                reviewerId: req.user.user._id,
              },
            },
          },
          { new: true, upsert: true }
        );
        console.log(`🚀 ~ data:`, data);
      }
    }

    return res.json({
      message: "Review completed",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: error, success: false });
  }
};

// Employee Rate & Revalution

exports.changeRatingStatus = async (req, res, next) => {
  try {
    const { empId = req.user.user._id, status } = req.body;

    const isGoalAlreadyExists = await EmployeeGoalsModel.findOne({ empId });

    if (!isGoalAlreadyExists) {
      return res.status(400).json({
        message: "Employee Goals and rating not found to chnage status",
      });
    }

    await EmployeeGoalsModel.findOneAndUpdate(
      {
        empId,
      },
      {
        isRevaluation: status,
      },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .json({ message: `Rating status changed to ${status}` });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: `something went wrong: ${error}` });
  }
};
