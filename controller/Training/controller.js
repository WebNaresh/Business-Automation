const catchAsyncError = require("../../middleware/catchAssyncError");
const { TrainingModel } = require("../../models/Training/model");
const { DepartmentModel } = require("../../models/Department/departmentSchema");
const {
  trainingEmployeeModel,
  deleteTraining,
} = require("../../models/Training/training-employee");
const { EmployeeModel } = require("../../models/employeeSchema");
const {
  TrainingCommentModel,
} = require("../../models/Training/training-comment");

exports.createTraining = catchAsyncError(async (req, res) => {
  try {
    const {
      trainingName,
      trainingDescription,
      trainingDuration,
      trainingLocation,
      trainingStartDate,
      trainingEndDate,
      trainingImage,
      trainingLink,
      trainingDownCasted,
      trainingPoints,
      trainingType,
      trainingDepartment = [],
      isDepartmentalTraining,
      proofSubmissionRequired,
    } = req.body;
    console.log(
      `🚀 ~ file: controller.js:28 ~ proofSubmissionRequired:`,
      proofSubmissionRequired
    );
    let employees = [];

    if (trainingDownCasted === true) {
      let { organizationId } = req.params;
      let orgEmployee = await EmployeeModel.find({
        organizationId,
      });

      employees = [
        ...employees,
        ...orgEmployee?.map((emp) => emp._id.toString()),
      ];
    }
    if (isDepartmentalTraining === true) {
      let deptEmployee = await EmployeeModel.find({
        deptname: trainingDepartment.map((dept) => dept?.value),
      });
      employees = [
        ...employees,
        ...deptEmployee?.map((emp) => emp._id.toString()),
      ];
    }
    let set = new Set(employees);
    employees = [...set];

    const newTraining = new TrainingModel({
      trainingName,
      trainingDescription,
      trainingDuration,
      trainingLocation,
      trainingStartDate,
      trainingEndDate,
      trainingLogo: trainingImage,
      trainingLink,
      trainingDownCasted,
      trainingPoints,
      trainingType,
      trainingCreator: req.user.user._id,
      trainingOrganizationId: req.params.organizationId,
      trainingAttendees: employees,
      trainingDepartment: trainingDepartment.map((dept) => dept?.value),
      proofSubmissionRequired,
    });

    if (isDepartmentalTraining === true) {
    }
    const savedTraining = await newTraining.save();
    return res.status(201).json({
      message: "Training created successfully",
      data: savedTraining,
    });
  } catch (err) {
    console.error(`🚀 ~ file: controller.js:50 ~ err:`, err);
    res.status(500).json(err);
  }
});
exports.updateTraining = catchAsyncError(async (req, res) => {
  try {
    const {
      trainingName,
      trainingDescription,
      trainingDuration,
      trainingLocation,
      trainingStartDate,
      trainingEndDate,
      trainingImage,
      trainingLink,
      trainingDownCasted,
      trainingPoints,
      trainingType,
    } = req.body;

    const training = await TrainingModel.findByIdAndUpdate(
      req.params.trainingId,
      {
        trainingName,
        trainingDescription,
        trainingDuration,
        trainingLocation,
        trainingStartDate,
        trainingEndDate,
        trainingLogo: trainingImage,
        trainingLink,
        trainingDownCasted,
        trainingPoints,
        trainingType,
      },
      { new: true }
    );
    training.save();
    return res.status(200).json({
      message: "Training updated successfully",
      data: training,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
exports.getTrainingImage = catchAsyncError(async (req, res) => {
  try {
    const training = await TrainingModel.findById(req.params.trainingId);
    if (!training) {
      return res.status(400).json({
        message: "Training not found",
      });
    }
    return res.status(200).json({
      message: "Training image",
      data: training.trainingLogo,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
exports.deleteTraining = catchAsyncError(async (req, res) => {
  try {
    const checkTrainingAssignedToEmployee = await trainingEmployeeModel.findOne(
      {
        trainingId: req.params.trainingId,
      }
    );
    if (checkTrainingAssignedToEmployee) {
      return res.status(400).json({
        message:
          "Can't delete training because it is already assigned to employee",
      });
    } else {
      await TrainingModel.findByIdAndDelete(req.params.trainingId);
      return res.status(200).json({
        message: "Training deleted successfully",
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

exports.getEmployeeWithDepartmentId = catchAsyncError(async (req, res) => {
  try {
    const { departmentId } = req.params;
    if (!departmentId) {
      return res.status(400).json({
        message: "Department ID is required",
      });
    }
    const employees = await UserModel.find({ departmentId });
    return res.status(200).json({
      message: "Employees with department ID",
      data: employees,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
exports.getEmployeeWithOrganizationId = catchAsyncError(async (req, res) => {
  try {
    const { organizationId } = req.params;
    if (!organizationId) {
      return res.status(400).json({
        message: "Organization ID is required",
      });
    }
    const employees = await UserModel.find({ organizationId });
    return res.status(200).json({
      message: "Employees with organization ID",
      data: employees,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
exports.getEmployeeWithNameWithLimit5 = catchAsyncError(async (req, res) => {
  try {
    const { name } = req.params;
    if (!name) {
      return res.status(400).json({
        message: "Name is required",
      });
    }
    const employees = await UserModel.find({ name: { $regex: name } }).limit(5);
    return res.status(200).json({
      message: "Employees with name",
      data: employees,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

exports.addAttendedToTrainingModel = catchAsyncError(async (req, res) => {
  try {
    const { userId } = req.body;
    const { trainingId } = req.params;
    const training = await TrainingModel.findById(trainingId);
    if (!training) {
      return res.status(400).json({
        message: "Training not found",
      });
    }
    training.trainingAttended.push(userId);
    await training.save();
    return res.status(200).json({
      message: "User added to training",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

exports.getTrainingDetails = catchAsyncError(async (req, res) => {
  try {
    const training = await TrainingModel.findById(req.params.trainingId);
    if (!training) {
      return res.status(400).json({
        message: "Training not found",
      });
    }
    return res.status(200).json({
      message: "Training details",
      data: training,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

exports.getTrainingDetailsWithNameLimit10WithCreatorId = catchAsyncError(
  async (req, res) => {
    try {
      const { organizationId } = req.params;
      const { name, page } = req.query;
      let totalResults;
      let training;
      let skip = 2 * Number(page - 1) ?? 1;
      if (name === undefined) {
        totalResults = await TrainingModel.countDocuments({
          trainingCreatedBy: req.user.user._id,
          trainingOrganizationId: organizationId,
        });
        training = await TrainingModel.find({
          trainingCreatedBy: req.user.user._id,
          trainingOrganizationId: organizationId,
        })
          .sort({ createdAt: -1 })
          .limit(2)
          .skip(skip);
      } else {
        const regex = new RegExp(name, "i"); // Perform case-insensitive search
        totalResults = await TrainingModel.countDocuments({
          trainingCreatedBy: req.user.user._id,
          $or: [
            { trainingName: regex }, // Search for exact match
            { trainingName: { $regex: regex } }, // Search for partial match
          ],
          trainingOrganizationId: organizationId,
        });
        training = await TrainingModel.find({
          trainingCreatedBy: req.user.user._id,
          $or: [
            { trainingName: regex }, // Search for exact match
            { trainingName: { $regex: regex } }, // Search for partial match
          ],
          trainingOrganizationId: organizationId,
        })
          .sort({ createdAt: -1 })
          .limit(2)
          .skip(skip);
      }
      if (!training) {
        return res.status(400).json({
          message: "Training not found",
        });
      }
      return res.status(200).json({
        message: "Training details with creator ID",
        data: training,
        totalResults,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

exports.fetchDepartmentByOrganizationId = catchAsyncError(async (req, res) => {
  try {
    const { organizationId } = req.params;
    const departments = await DepartmentModel.find({ organizationId });
    return res.status(200).json({
      message: "Department with organization ID",
      data: departments,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

exports.getUpcomingTrainingWithEmployeeId = catchAsyncError(
  async (req, res) => {
    try {
      const { employeeId } = req.params;
      const { page } = req.query;
      const totalResults = await trainingEmployeeModel.countDocuments({
        employeeId,
        startDate: { $gte: new Date() },
      });

      const training = await trainingEmployeeModel
        .find({
          employeeId,
          startDate: { $gte: new Date() },
          status: "pending",
        })
        .limit(3)
        .skip(3 * Number(page - 1))
        .populate("trainingId");
      if (!training) {
        return res.status(400).json({
          message: "Training not found",
        });
      }
      return res.status(200).json({
        message: "Training details with employee ID",
        data: training,
        totalResults,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

exports.getRecentTrainingWithOrgId = catchAsyncError(async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { page, trainingName, trainingDepartment, trainingType } = req.query;

    let training;
    console.log(`🚀 ~ file: controller.js:353 ~ req.query;:`, req.query);
    const totalResults = await TrainingModel.countDocuments({
      trainingOrganizationId: organizationId,
    });

    const query = queryBuilder({
      trainingDepartment,
      trainingType,
      trainingName,
    });
    console.log(`🚀 ~ file: controller.js:389 ~ query:`, query);

    training = await TrainingModel.find({
      trainingOrganizationId: organizationId,
      ...query,
      trainingAttendees: { $ne: req.user.user._id },
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .skip(3 * Number(page - 1));

    if (!training) {
      return res.status(400).json({
        message: "Training not found",
      });
    }
    return res.status(200).json({
      message: "Recent training with organization ID",
      data: training,
      totalResults,
    });
  } catch (err) {
    console.error(`🚀 ~ file: controller.js:378 ~ err:`, err);
    res.status(500).json(err);
  }
});

exports.getOnGoingTrainingsWitHEmployeeId = catchAsyncError(
  async (req, res) => {
    const currentDate = new Date();
    try {
      const { employeeId } = req.params;
      const totalResults = await trainingEmployeeModel.countDocuments({
        employeeId,
        startDate: { $lte: currentDate },
        endDate: { $gte: currentDate },
      });
      const training = await trainingEmployeeModel
        .find({
          employeeId,
          startDate: { $lte: currentDate },
          endDate: { $gte: currentDate },
          status: "pending",
        })
        .populate("trainingId");
      if (!training) {
        return res.status(400).json({
          message: "Training not found",
        });
      }
      return res.status(200).json({
        message: "Ongoing training with employee ID",
        data: training,
        totalResults,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

exports.getOverdueTrainingsWithEmployeeId = catchAsyncError(
  async (req, res) => {
    const currentDate = new Date();
    try {
      const { employeeId } = req.params;
      const { page } = req.query;
      const totalResults = await trainingEmployeeModel.countDocuments({
        employeeId,
        endDate: { $lt: currentDate },
      });
      const training = await trainingEmployeeModel
        .find({
          employeeId,
          endDate: { $lt: currentDate },
          status: "pending",
        })
        .limit(3)
        .skip(3 * Number(page - 1))
        .populate("trainingId");
      if (!training) {
        return res.status(400).json({
          message: "Training not found",
        });
      }
      return res.status(200).json({
        message: "Overdue training with employee ID",
        data: training,
        totalResults,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

const queryBuilder = (query) => {
  let queryObj = {};
  for (let key in query) {
    if (query[key] !== "undefined") {
      if (key === "trainingType") {
        queryObj[`${key}.value`] = query[key];
      } else if (key === "trainingName") {
        queryObj[key] = { $regex: query[key], $options: "i" };
      } else {
        queryObj[key] = query[key];
      }
    }
  }
  return queryObj;
};

exports.getEmployeeTrainingInfo = catchAsyncError(async (req, res) => {
  try {
    const { trainingId } = req.params;
    console.log(`🚀 ~ file: controller.js:479 ~ trainingId:`, trainingId);

    const training = await trainingEmployeeModel
      .findOne({
        trainingId: trainingId,
      })
      .populate("trainingId");
    console.log(`🚀 ~ file: controller.js:486 ~ training:`, training);
    if (!training) {
      return res.status(204).json({
        message: "Training not found",
        data: undefined,
      });
    }
    return res.status(200).json({
      message: "Employee training info",
      data: training,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

exports.createTrainingEmployee = catchAsyncError(async (req, res) => {
  try {
    const { trainingId } = req.params;
    const { startDate, endDate } = req.body;
    console.log(`🚀 ~ file: controller.js:503 ~ { startDate, endDate } :`, {
      startDate,
      endDate,
    });
    const newTrainingEmployee = new trainingEmployeeModel({
      employeeId: req.user.user._id,
      trainingId,
      startDate: startDate,
      endDate: endDate,
    });
    await TrainingModel.findByIdAndUpdate(trainingId, {
      $addToSet: { trainingAttendees: req.user.user._id },
    });

    await newTrainingEmployee.save();
    return res.status(201).json({
      message: "Training employee created successfully",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

exports.completeTrainingAndCreateFeedbackFunction = catchAsyncError(
  async (req, res) => {
    try {
      const { trainingEmployeeId } = req.params;
      console.log(
        `🚀 ~ file: controller.js:537 ~ trainingEmployeeId:`,
        trainingEmployeeId
      );
      const { proofOfSubmissionUrl, feedback, rating } = req.body;
      console.log(`🚀 ~ file: controller.js:542 ~ req.body:`, req.body);
      const training = await trainingEmployeeModel.findById(trainingEmployeeId);
      if (!training) {
        return res.status(400).json({
          message: "Training not found",
        });
      }
      training.status = "completed";
      training.proofOfSubmissionUrl = proofOfSubmissionUrl;
      await training.save();
      await TrainingModel.findByIdAndUpdate(training.trainingId, {
        $addToSet: { trainingAttended: training.employeeId },
      });
      const comment = await TrainingCommentModel.create({
        trainingId: training.trainingId,
        employeeId: training.employeeId,
        comment: feedback,
        rating,
      });
      comment.save();

      return res.status(200).json({
        message: "Training completed successfully",
      });
    } catch (err) {
      console.error(`🚀 ~ file: controller.js:569 ~ err:`, err);
      res.status(500).json(err);
    }
  }
);

exports.getCompletedTrainings = catchAsyncError(async (req, res) => {
  try {
    console.log(`🚀 ~ file: controller.js:577 ~ training:`);
    const training = await trainingEmployeeModel
      .find({
        employeeId: req.user.user._id,
        status: "completed",
      })
      .populate("trainingId");
    if (!training) {
      return res.status(400).json({
        message: "Training not found",
      });
    }
    return res.status(200).json({
      message: "Completed training with employee ID",
      data: training,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
exports.addTrainingToEmployees = catchAsyncError(async (req, res, next) => {
  const { trainingId } = req.params;
  const { employeeId, startDate, endDate } = req.body;

  const trainingEmployees = employeeId.map((employeeId) => ({
    trainingId,
    employeeId,
    startDate,
    endDate,
  }));
  await trainingEmployeeModel.insertMany(trainingEmployees);
  return res
    .status(200)
    .json({ message: "Training added to employees", trainingId });
});
