const mongoose = require("mongoose");
const catchAssyncError = require("../middleware/catchAssyncError");
const { PunchModel } = require("../models/punchSchema");
const logger = require("../utils/logger/index");
const { log } = require("winston");
const { TestDays, TestPunch } = require("../models/Test/TestSchema");
const { PunchTestModel } = require("../models/Punch/model");

exports.testPunchData = catchAssyncError(async (req, res, next) => {
  try {
    const { locations } = req.body;
    const lat = locations[0].lat;
    const lng = locations[0].lng;
    const todayDate = new Date().toISOString().slice(0, 10);
    const existingPunchData = await TestPunch.findOne({
      employeeId: req.user.user._id,
    });

    if (existingPunchData) {
      let todayFound = false;
      let index = -1;

      for (let i = 0; i < existingPunchData.days.length; i++) {
        const day = existingPunchData.days[i];
        // Check if createdAt exists and is a valid date
        if (day.createdAt && day.createdAt.toISOString) {
          if (day.createdAt.toISOString().slice(0, 10) === todayDate) {
            todayFound = true;
            index = i;
            break;
          }
        } else {
          // Handle the case where createdAt is undefined or not a Date object
          console.log(`createdAt is undefined or not valid for index ${i}`);
        }
      }

      if (todayFound) {
        existingPunchData.days[index].location.push({ lat, lng });
      } else {
        existingPunchData.days.push({ location: [{ lng, lat }] });
      }

      await existingPunchData.save();

      res.status(200).json({
        message: "Successful",
        data: existingPunchData,
      });
    } else {
      const punchData = new TestPunch({
        employeeId: req.user.user._id,
        days: [{ createdAt: new Date(), location: [{ lat, lng }] }],
      });

      await punchData.save();

      res.status(200).json({
        message: "Successful",
        data: punchData,
      });
    }
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

exports.test2Punch = catchAssyncError(async (req, res, next) => {
  try {
    const { days, location } = req.body;
    console.log(req.user.user);
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const existingPunchData = await TestDays.findOne({
      employeeId: req.user.user._id,
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    res.status(200).json({
      existingPunchData,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

//!posting
exports.test3Punch = catchAssyncError(async (req, res, next) => {
  try {
    const { days, location } = req.body;
    console.log("location", location);
    console.log(req.user.user);
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const existingPunchData = await TestDays.findOne({
      employeeId: req.user.user._id,
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    console.log(existingPunchData);

    if (existingPunchData) {
      await TestDays.findByIdAndUpdate(existingPunchData._id, {
        $push: {
          location: location,
        },
      });
    } else {
      const punchData = new TestDays({
        location: [location],
        employeeId: req.user.user._id,
      });
      punchData.save();
    }
    res.status(200).json({
      existingPunchData,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

//!getting
exports.test4Punch = catchAssyncError(async (req, res, next) => {
  try {
    const existingPunchData = await TestDays.find({
      employeeId: req.user.user._id,
    });

    console.log(existingPunchData);
    res.status(200).json({
      existingPunchData,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

exports.addPunchInData = catchAssyncError(async (req, res, next) => {
  try {
    const { start, end, locations } = req.body;
    console.log(`🚀 ~ file: punchController.js:9 ~ start:`, start);

    const existingPunchData = await PunchModel.findOne({
      employeeId: req.user.user._id,
    });

    if (!existingPunchData || existingPunchData.end !== null) {
      // Create a new punch document
      const punchInData = new PunchModel({
        start,
        locations,
        employeeId: req.user.user._id,
        end: null,
      });

      typeof start === "string"
        ? (punchInData.start = new Date(start))
        : (punchInData.start = start);

      await punchInData.save();

      return res.status(201).json({
        message: "Data inserted successfully.",
        data: punchInData,
      });
    }

    // Update the existing punch document
    existingPunchData.locations.push(...locations);
    existingPunchData.start = new Date(start);
    existingPunchData.end = end || null;
    await existingPunchData.save();

    res.status(200).json({
      message: "Locations added successfully",
      data: existingPunchData,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

exports.getAllPunches = catchAssyncError(async (req, res, next) => {
  console.log("id", req.user.user._id);
  try {
    const testId = mongoose.Types.ObjectId(req.user.user._id);
    console.log(testId);
    console.log(req.user.user._id);
    if (!req.user || !req.user.user || !req.user.user._id) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    if (!mongoose.Types.ObjectId.isValid(req.user.user._id)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }
    const punches = await TestPunch.findOne({ employeeId: testId });
    res.status(201).json({
      message: "Punches diplayed successfully !",
      punches: punches,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.getPunchForEmp = catchAssyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const empId = mongoose.Types.ObjectId(id);
    const punch = await TestPunch.findOne({ employeeId: empId });
    res.status(200).json({ punch });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error.message" });
  }
});

exports.updatePunch = catchAssyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { end } = req.body;
    const requiredFields = {};
    if (end) requiredFields.end = end;

    const punch = await PunchModel.findByIdAndUpdate(
      { _id: id },
      { $set: requiredFields },
      { new: true }
    );
    res.status(201).json({
      message: "puch Upndated Successfully",
      holidays: punch,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.getPunches = catchAssyncError(async (req, res, next) => {
  try {
    const punch = await PunchModel.findOne({ employeeId: req.user.user._id });

    res.status(201).json({
      message: "Punch diplayed successfully.",
      punch: punch,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});
exports.getKm = catchAssyncError(async (req, res, next) => {
  try {
    const totalDistance = await PunchModel.calculateTotalDistance(
      req.params.employeeId
    );

    res.status(201).json({
      message: "Punch diplayed successfully.",
      punch: totalDistance,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

// exports.getPunches2 = catchAssyncError(async (req, res, next) =>{
//   try {
//     const punchModal = await TestPunch.findOne({employeeId : req.user.usre._id})
//     if(punchModal){
//       res.status(200).json({data : punchModal})
//     }
//     else{
//       res.status(500).json({message:"no punch document found"})
//     }
//   } catch (error) {
//     res.status(500).json({message:error.message})
//   }
// })

exports.getPunchesYash = catchAssyncError(async (req, res, next) => {
  try {
    const todayDate = new Date().toISOString().slice(0, 10);
    const todayFound = false;
    const existingPunchData = await TestPunch.findOne({
      employeeId: req.user.user._id,
    });
    for (let i = 0; i < existingPunchData.days.length; i++) {
      const day = existingPunchData.days[i];
      if (day.createdAt.toISOString().slice(0, 10) === todayDate) {
        todayFound = true;
        index = i;
        break;
      }
    }

    if (todayFound) {
      let Data = existingPunchData.days[index].location;
      res.status(200).json({ data: Data, dates: existingPunchData });
    } else {
      existingPunchData.days.push({ location: [{ lng, lat }] });
    }
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});
exports.checkEligibilityAndCreateObject = catchAssyncError(
  async (req, res, next) => {
    try {
      const punch = await PunchTestModel.findOne({
        employeeId: req.user.user._id,
      });

      res.status(201).json({
        message: "Punch diplayed successfully.",
        punch: punch,
      });
    } catch (error) {
      logger.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }
);
