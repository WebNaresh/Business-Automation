// addCircle a User
const { default: mongoose } = require("mongoose");
const catchAssyncError = require("../../middleware/catchAssyncError");
const { GeoFencingModel } = require("../../models/Geo-Fencing/model");
const {
  RemotePunchingModel,
} = require("../../models/RemotePunching/remote-punching");
const { EmployeeModel } = require("../../models/employeeSchema");
const ErrorHandler = require("../../utils/errorHandler");

exports.addCircle = catchAssyncError(async (req, res, next) => {
  const { lat, lng, radius } = req.body;
  const { organizationId } = req?.params;

  const checkIsGeoFencingEnabled = await RemotePunchingModel.findOne({
    organizationId,
  });

  if (checkIsGeoFencingEnabled?.geoFencing === true) {
    if (!lat || !lng || !radius || !organizationId) {
      return res.status(400).json({
        message: "Please provide all fields",
        success: false,
      });
    }
    await GeoFencingModel.create({
      organizationId,
      center: {
        type: "Point",
        coordinates: [lat, lng],
      },
      radius,
    });
    return res.status(200).json({
      message: "Your geofencing area is successfully added.",
      success: true,
    });
  } else {
    return res.status(400).json({
      message: "You have not enabled geo fencing checkbox from setup page.",
      success: false,
    });
  }
});

exports.getOrgCircle = catchAssyncError(async (req, res, next) => {
  const { organizationId } = req?.params;
  const checkIsGeoFencingEnabled = await RemotePunchingModel.findOne({
    organizationId,
  });
  if (checkIsGeoFencingEnabled?.geoFencing === true) {
    if (!organizationId) {
      return next(new ErrorHandler("Please provide all fields", 400));
    }
    const circle = await GeoFencingModel.find({ organizationId });
    return res.status(200).json({
      message: "Your geofencing area is successfully added.",
      success: true,
      area: circle,
    });
  } else {
    return res.status(400).json({
      message: "You have not enabled geo fencing checkbox from setup page.",
      success: false,
    });
  }
});

exports.getEmployeeCircle = catchAssyncError(async (req, res, next) => {
  const { employeeId } = req?.params;
  if (!employeeId) {
    return res.status(400).json({
      message: "Please provide all fields",
      success: false,
    });
  }
  const circle = await GeoFencingModel.find({ employee: employeeId });
  return res.status(200).json({
    message: "Your geofencing area is successfully added.",
    success: true,
    area: circle,
  });
});

//api for add and remove employee in geofencing area
exports.manageEmployeeInCircle = catchAssyncError(async (req, res, next) => {
  const { circleId } = req.params;
  const { employeeId } = req.body;

  if (!circleId || !employeeId || !Array.isArray(employeeId)) {
    return next(new ErrorHandler("Please provide all required fields in the correct format", 400));
  }

  const objectIdArray = employeeId.map(id => mongoose.Types.ObjectId(id));

  const circle = await GeoFencingModel.findById(circleId);

  if (!circle) {
    return next(new ErrorHandler("Geofencing area not found", 404));
  }

  // Determine employees to add and remove
  const currentEmployeeIds = circle.employee.map(id => id.toString());
  const newEmployeeIds = objectIdArray.map(id => id.toString());

  // Determine which employees need to be removed
  const employeesToRemove = currentEmployeeIds.filter(id => !newEmployeeIds.includes(id));

  // Determine which employees need to be added
  const employeesToAdd = newEmployeeIds.filter(id => !currentEmployeeIds.includes(id));

  // Update the circle
  if (employeesToRemove.length > 0) {
    await GeoFencingModel.findByIdAndUpdate(
      circleId,
      {
        $pullAll: { employee: employeesToRemove },
      },
      { new: true }
    );
  }

  if (employeesToAdd.length > 0) {
    await GeoFencingModel.findByIdAndUpdate(
      circleId,
      {
        $addToSet: { employee: employeesToAdd },
      },
      { new: true }
    );
  }

  return res.status(200).json({
    message: "Employee list successfully save",
    success: true,
  });
});

exports.addEmployeeToCircle = catchAssyncError(async (req, res, next) => {
  const { circleId } = req?.params;
  const { employeeId } = req.body;
  if (!circleId || !employeeId) {
    return next(new ErrorHandler("Please provide all fields", 400));
  }
  await GeoFencingModel.findByIdAndUpdate(
    circleId,
    {
      $addToSet: { employee: employeeId },
    },
    { new: true }
  );
  return res.status(200).json({
    message: "Employee is successfully added to the geofencing area.",
    success: true,
  });
});

//get add employee in geofence
exports.getEmployeesInCircle = catchAssyncError(async (req, res, next) => {
  const { circleId } = req.params;

  if (!circleId) {
    return next(new ErrorHandler("Circle ID is required", 400));
  }

  const circle = await GeoFencingModel.findById(circleId).populate('employee');

  if (!circle) {
    return next(new ErrorHandler("Geofencing area not found", 404));
  }

  return res.status(200).json({
    success: true,
    data: circle.employee,
  });
});


exports.removeEmployeeFromCircle = catchAssyncError(async (req, res, next) => {
  const { circleId } = req?.params;
  const { employeeId } = req.body;
  const objectIdArray = employeeId.map((id) => mongoose.Types.ObjectId(id));
  if (!circleId || !employeeId) {
    return next(new ErrorHandler("Please provide all fields", 400));
  }
  const newUp = await GeoFencingModel.findByIdAndUpdate(
    circleId,
    {
      $pullAll: { employee: objectIdArray },
    },
    { new: true }
  );
  return res.status(200).json({
    message: "Employee is successfully removed from the geofencing area.",
    success: true,
  });
});

//get geofencing circle to superadmin
exports.getCircle = catchAssyncError(async (req, res, next) => {
  const { circleId } = req?.params;

  if (!circleId) {
    return next(new ErrorHandler("Please provide the circle ID", 400));
  }

  const circle = await GeoFencingModel.findById(circleId);

  if (!circle) {
    return next(new ErrorHandler("Geofencing area not found", 404));
  }

  return res.status(200).json({
    success: true,
    data: circle,
  });
});

exports.deleteCircle = catchAssyncError(async (req, res, next) => {
  const { circleId } = req?.params;
  if (!circleId) {
    return next(new ErrorHandler("Please provide all fields", 400));
  }
  await GeoFencingModel.findByIdAndDelete(circleId);
  return res.status(200).json({
    message: "Your geofencing area is successfully deleted.",
    success: true,
  });
});

exports.editCircle = catchAssyncError(async (req, res, next) => {
  const { circleId } = req?.params;
  const { lat, lng, radius } = req.body;
  if (!circleId || !lat || !lng || !radius) {
    return next(new ErrorHandler("Please provide all fields", 400));
  }
  await GeoFencingModel.findByIdAndUpdate(
    circleId,
    {
      center: { lat, lng },
      radius,
    },
    { new: true }
  );
  return res.status(200).json({
    message: "Your geofencing area is successfully updated.",
    success: true,
  });
});

// exports.getOrgEmployeeWithFilter = catchAssyncError(async (req, res, next) => {
//   try {
//     const { organizationId } = req.params;
//     const { firstName, email, page, circleId } = req.query;

//     const addedEmployee = await GeoFencingModel.findById(circleId);
//     console.log(`🚀 ~ file: controller.js:143 ~ addedEmployee:`, addedEmployee);

//     let filter = {
//       organizationId,
//       _id: { $nin: addedEmployee?.employee },
//     };
//     await addedEmployee.populate("employee");
//     if (firstName && firstName !== "" && firstName !== "undefined") {
//       filter.first_name = { $regex: firstName, $options: "i" };
//     }
//     if (email && email !== "" && email !== "undefined") {
//       filter.email = { $regex: email, $options: "i" };
//     }

//     const employees = await EmployeeModel.find(filter)
//       .skip(Number(page) * 10)
//       .limit(10);

//     return res.status(200).json({
//       employees,
//       success: true,
//       addedEmployee,
//     });
//   } catch (error) {
//     console.log(`🚀 ~ file: employeeController.js:1487 ~ error:`, error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

exports.getOrgEmployeeWithFilter = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const { firstName, email, page, circleId } = req.query;
    const addedEmployeeDoc = await GeoFencingModel.findById(circleId).populate("employee");

    const addedEmployeeIds = addedEmployeeDoc?.employee.map(emp => emp._id.toString()) || [];

    const allCircleEmployees = await GeoFencingModel.find({ organizationId })
      .select("employee")
      .populate("employee")
      .lean();

    const otherCircleEmployeeIds = new Set();
    allCircleEmployees.forEach(circle => {
      if (circle._id.toString() !== circleId) {
        circle.employee.forEach(emp => {
          otherCircleEmployeeIds.add(emp._id.toString());
        });
      }
    });

    let filter = {
      organizationId,
      _id: { $nin: Array.from(otherCircleEmployeeIds) },
    };

    if (firstName && firstName !== "" && firstName !== "undefined") {
      filter.first_name = { $regex: firstName, $options: "i" };
    }
    if (email && email !== "" && email !== "undefined") {
      filter.email = { $regex: email, $options: "i" };
    }

    const employees = await EmployeeModel.find(filter)
      .skip(Number(page) * 10)
      .limit(10);

    const allEmployees = employees.map(emp => ({
      ...emp.toObject(),
      isAdded: addedEmployeeIds.includes(emp._id.toString())
    }));

    return res.status(200).json({
      employees: allEmployees,
      success: true,
      addedEmployee: addedEmployeeDoc?.employee || [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
