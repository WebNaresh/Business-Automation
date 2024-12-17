const { PunchModel, PunchObject, RemotePunchingTask } = require("../../models/Punch/model");
const catchAsyncError = require("../../middleware/catchAssyncError");
const { generateSignedUrlToFolder } = require("../../utils/s3");
const { EmployeeModel } = require("../../models/employeeSchema");
const {
  EmployeeManagementModel,
} = require("../../models/employeManager/employeeManagementSchema");
const {
  RemotePunchingModel,
} = require("../../models/RemotePunching/remote-punching");
const { GeoFencingModel } = require("../../models/Geo-Fencing/model");
const { default: axios } = require("axios");
const mongoose = require("mongoose");
exports.findManagerAndUpdateStatus = catchAsyncError(async (req, res, next) => {
  try {
    let { status } = req.body;
    const { punchId } = req.params;
    if (!punchId || !status) {
      return res.status(500).json({ message: "Please Provide necessary Data" });
    }
    // Search Manager of employee
    const manager = await EmployeeManagementModel.findOne({
      reporteeIds: req.user.user._id,
    });

    const punchData = await PunchModel.findByIdAndUpdate(
      punchId,
      {
        $set: {
          status,
          approverId: manager.managerId,
        },
      },
      { new: true }
    );
    punchData.save();
    return res.status(201).json({
      message: "Punch retrieved successfully.",
      punchData,
      punchId,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

exports.findAccountantAndApproved = catchAsyncError(async (req, res, next) => {
  try {
    let { status } = req.body;

    const { punchId } = req.params;
    if (!punchId || !status) {
      return res.status(500).json({ message: "Please Provide necessary Data" });
    }

    let approverId;
    let accountant = await EmployeeModel.findOne({
      profile: {
        $in: ["Accountant"],
      },
    });
    if (accountant) {
      approverId = null;
      status = "A-approved";
    } else {
      approverId = null;
    }

    let punchData = await PunchModel.findByIdAndUpdate(
      punchId,
      {
        $set: {
          status,
          approverId,
        },
      },
      { new: true }
    );
    return res.status(201).json({
      message: "Punch retrieved successfully.",
      punchData,
    });
  } catch (error) {
    console.error(`🚀 ~ file: controller.js:90 ~ error:`, error);
    return res.status(500).json({ message: error.message });
  }
});

exports.findAccountantAndRejected = catchAsyncError(async (req, res, next) => {
  try {
    const { punchId } = req.params;
    if (!punchId) {
      return res.status(400).json({ message: "Please provide punchId" });
    }

    let approverId;
    const accountant = await EmployeeModel.findOne({
      profile: { $in: ["Accountant"] },
    });

    if (accountant) {
      approverId = accountant._id;
    } else {
      approverId = null;
    }

    const punchData = await PunchModel.findByIdAndUpdate(
      punchId,
      {
        $set: {
          status: "M-Rejected",
          approverId: approverId,
        },
      },
      { new: true }
    );

    if (!punchData) {
      return res.status(404).json({ message: "Punch not found" });
    }

    return res.status(200).json({
      message: "Punch status updated successfully to M-Rejected.",
      punchData,
    });
  } catch (error) {
    console.error("Error in findAccountantAndRejected:", error);
    return res.status(500).json({ message: error.message });
  }
});
exports.findAccountantAndRejected2 = catchAsyncError(async (req, res, next) => {
  try {
    const { punchId } = req.params;
    if (!punchId) {
      return res.status(400).json({ message: "Please provide punchId" });
    }

    let approverId;
    const accountant = await EmployeeModel.findOne({
      profile: { $in: ["Accountant"] },
    });

    if (accountant) {
      approverId = accountant._id;
    } else {
      approverId = null;
    }

    const punchData = await PunchModel.findByIdAndUpdate(
      punchId,
      {
        $set: {
          status: "A-Rejected",
          approverId: approverId,
        },
      },
      { new: true }
    );

    if (!punchData) {
      return res.status(404).json({ message: "Punch not found" });
    }

    return res.status(200).json({
      message: "Punch status updated successfully to M-Rejected.",
      punchData,
    });
  } catch (error) {
    console.error("Error in findAccountantAndRejected:", error);
    return res.status(500).json({ message: error.message });
  }
});

exports.acceptManagerRequest = catchAsyncError(async (req, res, next) => {
  try {
    const { punchId } = req.params;
    if (!punchId) {
      return res.status(500).json({ message: "Please Provide necessary Data" });
    }
    let approverId;
    const accountant = await EmployeeModel.findOne({
      profile: { $in: ["Accountant"] },
    });
    if (accountant) {
      approverId = accountant._id;
    } else {
      approverId = null;
    }

    const punchData = await PunchModel.findByIdAndUpdate(
      punchId,
      {
        $set: {
          status: "Approved",
          approverId: approverId,
        },
      },
      { new: true }
    );

    if (!punchData) {
      return res.status(404).json({ message: "Punch not found" });
    }

    return res.status(200).json({
      message: "Punch status updated successfully.",
      punchData,
    });
  } catch (error) {
    console.error(`Error in findAccountantAndApproved2:`, error);
    return res.status(500).json({ message: error.message });
  }
});
exports.findNotification = catchAsyncError(async (req, res, next) => {
  try {
    let userId;
    if (req?.user?.user?.profile?.includes("Delegate-Super-Admin")) {
      userId = req.user.user.creatorId;
    } else {
      userId = req.user.user._id;
    }
    const punchNotification = await PunchModel.find({
      approverId: userId,
      status: "Pending",
    }).populate(["punchData", "employeeId"]);
    const tempArray = [];
    const arrayOfEmployee = punchNotification.map((item) => {
      if (!tempArray.includes(item.employeeId._id)) {
        tempArray.push(item.employeeId._id);
        return item.employeeId;
      }
    });
    return res.status(201).json({
      message: "Punch retrieved successfully.",
      punchNotification,
      arrayOfEmployee,
    });
  } catch (error) {
    console.error(`🚀 ~ file: controller.js:90 ~ error:`, error);
    return res.status(500).json({ message: error.message });
  }
});

exports.getEmployeeNotificationOnly = catchAsyncError(
  async (req, res, next) => {
    try {
      const { employeeId } = req.params;
      let userId;
      if (req?.user?.user?.profile?.includes("Delegate-Super-Admin")) {
        userId = req.user.user.creatorId;
      } else {
        userId = req.user.user._id;
      }
      const punchNotification = await PunchModel.find({
        employeeId,
        status: "Pending",
        approverId: userId,
      }).populate(["punchData", "employeeId"]);
      return res.status(201).json({
        message: "Punch retrieved successfully.",
        punchNotification,
      });
    } catch (error) {
      console.error(`🚀 ~ file: controller.js:90 ~ error:`, error);
      return res.status(500).json({ message: error.message });
    }
  }
);

exports.getAllPunchDetails = catchAsyncError(async (req, res, next) => {
  try {
    const allPunchData = await PunchModel.find({
      employeeId: req.user.user._id,
      status: "Un-Authenticate",
    }).populate(["punchData", "employeeId"]);
    return res.status(201).json({
      message: "Punch retrieved successfully.",
      allPunchData,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//Post remote and geo fencing punch data
exports.createPunchObject = catchAsyncError(async (req, res, next) => {
  try {
    const { geoFencingArea } = req.body;
    const employeeId = req.user.user._id;
    const superAdmin = await EmployeeModel.findOne({
      _id: req.user.user._id,
    }).populate("organizationId");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const punchTable = await PunchModel.findOne({
      employeeId,
      createdAt: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (punchTable && punchTable.punchData.length >= 5) {
      return res
        .status(500)
        .json({ message: "Maximum 5 times allowed in a day" });
    }
    const { image } = req.body;
    const approverId = await EmployeeManagementModel.findOne({
      reporteeIds: { $in: [req.user.user._id] },
    });

    const punchModel = await PunchObject.create({ employeeId, image, notificationCount: 1 });

    if (punchTable) {
      const approverId = await EmployeeManagementModel.findOne({
        reporteeIds: { $in: [req.user.user._id] },
      });

      punchTable.punchData.push(punchModel._id);
      punchTable.approverId = approverId
        ? approverId.managerId
        : superAdmin.organizationId.creator;
      punchTable.status = "Pending";
      await punchTable.save();
    } else {
      await PunchModel.create({
        geoFencingArea,
        employeeId,
        punchData: [punchModel._id],
        approverId: approverId
          ? approverId.managerId
          : superAdmin.organizationId.creator,
      });
    }

    await punchModel.save();
    res.status(201).json({ punchObjectId: punchModel._id });
  } catch (error) {
    console.error(`🚀 ~ file: controller.js:285 ~ error:`, error);
    res.status(500).json({ message: error.message });
  }
});

// update remote and geo fencing notification count only 
exports.updateNotificationCount = catchAsyncError(async (req, res, next) => {
  try {
    const { selectedPunchId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(selectedPunchId)) {
      return res.status(400).json({ message: 'Invalid Punch ID format.' });
    }

    const punch = await PunchModel.findById(selectedPunchId).populate('punchData');

    if (!punch) {
      return res.status(404).json({ message: 'Punch not found.' });
    }

    // Update notificationCount to 0 for all PunchObjects in punchData array
    await Promise.all(
      punch.punchData.map(async (punchObject) => {
        await PunchObject.findByIdAndUpdate(
          punchObject._id,
          { $set: { notificationCount: 0, stopNotificationCount: 0 } },
          { new: true, runValidators: true }
        );
      })
    );

    res.status(200).json({
      message: 'Notification count updated successfully for all PunchObjects.',
    });
  } catch (error) {
    console.error('Error in updateNotificationCount:', error);
    res.status(500).json({ message: error.message });
  }
});

//Update Remote and geoFencing Data
// exports.updatePunchObject = catchAsyncError(async (req, res, next) => {
//   try {
//     const { temporaryArray, punchObjectId, stopNotificationCount } = req.body;

//     if (temporaryArray.length > 0) {
//       const punchObject1 = await isUserInAnyCircle(

//         { latitude: temporaryArray[0].lat, longitude: temporaryArray[0].lng },
//         req.user.user._id
//       );

//       if (punchObject1 === "N_OK") {
//         return res.status(500).json({
//           message: "You are not in the geo-fencing area",
//         });
//       }

//       const punchObject = await PunchObject.findByIdAndUpdate(
//         punchObjectId,
//         {
//           $push: {
//             data: temporaryArray,
//           },
//         },
//         { new: true, runValidators: true }
//       );
//       return res.status(201).json({
//         message: "updated successfully",
//         punchObject,
//       });
//     } else {
//       return res.status(201).json({
//         message: "updated successfully",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
exports.updatePunchObject = catchAsyncError(async (req, res, next) => {
  try {
    const { temporaryArray, punchObjectId, stopNotificationCount, stopEndTime } = req.body;

    // If stopNotificationCount is passed, update it in the database
    if (stopNotificationCount) {
      await PunchObject.findByIdAndUpdate(
        punchObjectId,
        { stopNotificationCount }, // Update the stopNotificationCount field
        { new: true, runValidators: true }
      );
    }

    // Set stopEndTime to "start" if it's not provided in the payload
    const updatedStopEndTime = stopEndTime || "start";

    // If temporaryArray has data, push it to the data array of the PunchObject
    if (temporaryArray?.length > 0) {
      const punchObject1 = await isUserInAnyCircle(
        { latitude: temporaryArray[0].lat, longitude: temporaryArray[0].lng },
        req.user.user._id
      );

      if (punchObject1 === "N_OK") {
        return res.status(500).json({
          message: "You are not in the geo-fencing area",
        });
      }

      const punchObject = await PunchObject.findByIdAndUpdate(
        punchObjectId,
        {
          $push: { data: temporaryArray },
          stopEndTime: updatedStopEndTime, // Update stopEndTime with the default or provided value
        },
        { new: true, runValidators: true }
      );

      return res.status(201).json({
        message: "updated successfully",
        punchObject,
      });
    } else {
      // If there's no temporaryArray but stopNotificationCount was updated, respond with success
      await PunchObject.findByIdAndUpdate(
        punchObjectId,
        { stopEndTime: updatedStopEndTime }, // Update stopEndTime with the default or provided value
        { new: true, runValidators: true }
      );

      return res.status(201).json({
        message: "updated successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


exports.getUploadImageUrl = catchAsyncError(async (req, res, next) => {
  try {
    const { lat, lng } = req.query;
    const punchObject1 = await isUserInAnyCircle(
      { latitude: Number(lat), longitude: Number(lng) },
      req.user.user._id
    );

    if (punchObject1 === "N_OK") {
      return res.status(500).json({
        message: "You are not in the geo-fencing area",
      });
    }
    const url = await generateSignedUrlToFolder(
      req.user.user._id,
      "remote-punching"
    );

    res.status(201).json({
      message: "Url get succesfully",
      url,
    });
  } catch (error) {
    console.error(`🚀 ~ file: controller.js:195 ~ error:`, error);
    res.status(500).json({ message: error.message });
  }
});

exports.getUploadImageUrlForFolder = catchAsyncError(async (req, res, next) => {
  try {
    const { folder } = req.params;

    const url = await generateSignedUrlToFolder(req.user.user._id, folder);

    res.status(201).json({
      message: "Url get succesfully",
      url,
    });
  } catch (error) {
    console.error(`🚀 ~ file: controller.js:195 ~ error:`, error);
    res.status(500).json({ message: error.message });
  }
});

exports.getSinglePunchObject = catchAsyncError(async (req, res, next) => {
  try {
    const punchId = req.params.punchId;
    const punchData = await PunchModel.findById(punchId).populate([
      "employeeId",
      "punchData",
    ]);

    res.status(201).json({
      message: "Single Object get Successfully",
      punchData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.getApprovedNotification = catchAsyncError(async (req, res, next) => {
  try {
    const employeeId = req.user.user._id;

    const punchData = await PunchModel.find({
      employeeId: employeeId,
    }).populate(["employeeId", "punchData"]);

    res.status(201).json({
      message: "Single Object get Successfully",
      punchData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// exports.getSinglePunchEntry = catchAsyncError(async (req, res, next) => {
//   try {
//     const punchId = req.params.punchEntryId;

//     const punchData = await PunchObject.findById(punchId);

//     res.status(201).json({
//       message: "Single Object get Successfully",
//       punchData,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

exports.getSinglePunchEntry = catchAsyncError(async (req, res, next) => {
  try {
    const punchId = req.params.punchEntryId;

    // Fetch punch data by punchId
    const punchData = await PunchObject.findById(punchId);

    if (!punchData) {
      return res.status(404).json({ message: "Punch entry not found" });
    }

    // Fetch related tasks from RemotePunchingTaskSchema
    const allRelatedTasks = await RemotePunchingTask.find({
      "taskName.acceptedBy.punchObjectId": punchId,
    }).select("organisationId title description taskName");

    // Filter related tasks and clean up acceptedBy field
    const filteredTasks = allRelatedTasks.map(task => {
      // Clean up taskName and filter acceptedBy
      const cleanedTask = {
        organisationId: task.organisationId,
        title: task.title,
        description: task.description,
        taskName: task.taskName.map(subtask => {
          // Filter and clean acceptedBy field
          const filteredAcceptedBy = subtask.acceptedBy
            .filter(entry => entry.punchObjectId && punchData._id && entry.punchObjectId.toString() === punchData._id.toString())
            .map(entry => ({
              location: entry.location,
              employeeEmail: entry.employeeEmail,
              accepted: entry.accepted,
              comments: entry.comments,
              status: entry.status,
              punchObjectId: entry.punchObjectId,
              _id: entry._id
            }));

          return {
            taskName: subtask.taskName,
            _id: subtask._id,
            acceptedBy: filteredAcceptedBy
          };
        }).filter(subtask => subtask.acceptedBy.length > 0)
      };

      // Return cleaned task with filtered taskName
      return cleanedTask;
    }).filter(task => task.taskName.length > 0); // Remove tasks with no valid subtasks

    // Format and return the response
    res.status(200).json({
      message: "Single Object fetched successfully",
      punchData,
      relatedTasks: filteredTasks, // Include filtered tasks based on punchObjectId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//approve remote and geo fence request 
exports.AcceptManager = catchAsyncError(async (req, res, next) => {
  try {
    let { mReason } = req.body;
    let { punchId } = req.params;
    if (!punchId) {
      return res.status(500).json({ message: "Please Provide necessary Data" });
    }

    let approverId;
    let punchData;
    punchData = await PunchModel.findById(punchId).populate("employeeId");

    let remotePunching = await RemotePunchingModel.findOne({
      organizationId: punchData?.employeeId?.organizationId,
    });
    if (remotePunching && remotePunching.dualWorkflow === true) {
      punchData.approverId = remotePunching.accountantId;
      await punchData.save();
    } else if (remotePunching && remotePunching.dualWorkflow === false) {
      punchData = await PunchModel.findById(punchId);
      punchData.status = "Approved";
      punchData.approveRejectNotificationCount = 1;
      await punchData.save();
    } else {
      remotePunching = await RemotePunchingModel.create({
        organizationId: req.user.user.organizationId,
      });
      return res
        .status(500)
        .json({ message: "Retry once more we had problem" });
    }

    return res.status(201).json({
      message: "Punch retrieved successfully.",
      punchData,
    });
  } catch (error) {
    console.error(`🚀 ~ file: controller.js:90 ~ error:`, error);
    return res.status(500).json({ message: error.message });
  }
});

//update approveRejectNotificationCount count
exports.updateApproveRejectNotificationCount = catchAsyncError(async (req, res, next) => {
  try {
    const { punchId } = req.body;

    console.log("Received punchId:", punchId);

    if (!punchId) {
      return res.status(400).json({ message: "Punch ID is required." });
    }

    let punchDocument = await PunchModel.findById(punchId);

    if (!punchDocument) {
      return res.status(404).json({ message: "Punch document not found." });
    }

    punchDocument.approveRejectNotificationCount = 0;

    await punchDocument.save();

    return res.status(200).json({
      message: "approveRejectNotificationCount updated to zero successfully.",
      punchDocument,
    });
  } catch (error) {
    console.error("Error updating approveRejectNotificationCount:", error);
    return res.status(500).json({
      message: "An error occurred while updating the notification count. Please try again later.",
    });
  }
});

exports.RejectManager = catchAsyncError(async (req, res, next) => {
  try {
    let { punchId } = req.params;
    const { mReason } = req.body;
    if (!punchId) {
      return res.status(500).json({ message: "Please Provide necessary Data" });
    }
    let punchData;

    punchData = await PunchModel.findByIdAndUpdate(
      punchId,
      {
        $set: {
          approverId: null,
          status: "Rejected",
        },
      },
      { new: true }
    );
    punchData.mReason = mReason;
    await punchData.save();

    return res.status(201).json({
      message: "Punch rejected successfully.",
      punchData,
    });
  } catch (error) {
    console.error(`🚀 ~ file: controller.js:90 ~ error:`, error);
    return res.status(500).json({ message: error.message });
  }
});
exports.RejectAccoutant = catchAsyncError(async (req, res, next) => {
  try {
    let { status, mReason } = req.body;
    const { punchId } = req.params;
    if (!punchId) {
      return res.status(500).json({ message: "Please Provide necessary Data" });
    }

    let approverId;
    const accountant = await EmployeeModel.findOne({
      profile: {
        $in: ["Accountant"],
      },
    });

    if (accountant) {
      approverId = accountant._id;
      status = "A-Rejected";
    } else {
      approverId = null;
      status = "Rejected";
    }

    const punchData = await PunchModel.findByIdAndUpdate(
      punchId,
      {
        $set: {
          status,
          approverId,
        },
      },
      { new: true }
    );
    punchData.aReason = mReason;
    punchData.save();
    return res.status(201).json({
      message: "Punch retrieved successfully.",
      punchData,
    });
  } catch (error) {
    console.error(`🚀 ~ file: controller.js:90 ~ error:`, error);
    return res.status(500).json({ message: error.message });
  }
});
exports.AcceptAccountant = catchAsyncError(async (req, res, next) => {
  try {
    let { punchId } = req.params;
    if (!punchId) {
      return res.status(500).json({ message: "Please Provide necessary Data" });
    }

    // Find the document first
    let punchData = await PunchModel.findOne({ _id: punchId });

    if (!punchData) {
      return res.status(404).json({ message: "Punch not found" });
    }

    // Modify the fields directly
    punchData.approverId = null;
    punchData.status = "Approved";

    // Save the document to trigger pre and post save hooks
    await punchData.save();

    return res.status(201).json({
      message: "Punch Accepted successfully.",
      punchData,
    });
  } catch (error) {
    console.error(`🚀 ~ file: controller.js:90 ~ error:`, error);
    return res.status(500).json({ message: error.message });
  }
});
exports.missRemotePunch = catchAsyncError(async (req, res, next) => {
  try {
    let { today, arrayOfLocations } = req.body;

    today = new Date(today);

    const employeeId = req.user.user._id;

    today.setHours(0, 0, 0, 0);

    const punchTable = await PunchModel.findOne({
      employeeId,
      createdAt: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    }).populate("punchData");

    if (punchTable && punchTable.punchData.length >= 5) {
      return res
        .status(500)
        .json({ message: "Maximum 5 times allowed in a day" });
    }

    let arrayOfId = await Promise.all(
      arrayOfLocations.map(async (location) => {
        const punchObject = await PunchObject.create({
          data: [
            { ...location.startLocation.position, time: location.start },
            { ...location.endLocation.position, time: location.end },
          ],
          image: "",
          employeeId,
          distance: parseFloat(location.distance),
        });
        await punchObject.save();
        return punchObject._id;
      })
    );

    if (punchTable) {
      punchTable.punchData.push(...arrayOfId);
      await punchTable.save();
    } else {
      const approverId = await EmployeeManagementModel.findOne({
        reporteeIds: req.user.user._id,
      });
      let managerId;
      if (approverId) {
        managerId = approverId.managerId;
      } else {
        const superAdmin = await EmployeeModel.findOne({
          _id: req.user.user._id,
        }).populate("organizationId");
        managerId = superAdmin.organizationId.creator;
      }

      const model = await PunchModel.create({
        employeeId,
        createdAt: arrayOfLocations[0].start,
        updatedAt: arrayOfLocations[0].start,
        punchData: arrayOfId,
        approverId: managerId,
      });
      model.save();
    }
    return res.status(201).json({
      message: "Punch Application raise successfully.",
    });
  } catch (error) {
    console.error(`🚀 ~ file: controller.js:551 ~ error:`, error);
    res.status(500).json({ message: error.message });
  }
});

exports.getTodayRemoteEmp = async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const getEmployeeWithOrganization = await EmployeeModel.find({
      organizationId,
    }).select("_id");

    const empIds = getEmployeeWithOrganization.map((ele) => ele);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const getTotalPunch = await PunchObject.distinct("employeeId", {
      employeeId: { $in: empIds },
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    // return res.json({ getTotalPunch, count: getTotalPunch.length });
    return res.json(getTotalPunch.length);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getGoogleMapDistance = async (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceInMeters = R * c * 1000; // Convert distance to meters

  return distanceInMeters;
};

const isUserInAnyCircle = async (userCoordinates, employeeId) => {
  try {
    // Find all geo-fencing records for the given employee
    const geoFencingRecords = await GeoFencingModel.find({
      employee: employeeId,
    });

    if (!geoFencingRecords || geoFencingRecords.length === 0) {
      return "Non_GEO"; // User doesn't have any circles
    }

    for (const record of geoFencingRecords) {
      const { center, radius } = record;

      const distance = await getGoogleMapDistance(
        userCoordinates.latitude,
        userCoordinates.longitude,
        center.coordinates[0],
        center.coordinates[1]
      );

      if (distance <= radius) {
        return "OK"; // User is in one of the circles
      }
    }

    return "N_OK"; // User is not in any circle
  } catch (error) {
    console.error(error);
    return false;
  }
};

exports.getRemotePunchCountOfEmployee = catchAsyncError(
  async (req, res, next) => {
    try {
      const { employeeId } = req.params;
      const { startDate, endDate } = req.query;

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ message: "Invalid date format." });
      }

      const remotePunchingCount = await PunchModel.countDocuments({
        employeeId: employeeId,
        status: "Approved",
        createdAt: { $gte: start, $lte: end },
      }).populate(["punchData", "employeeId"]);

      return res.status(200).json({
        message: "Remote punch count retrieved successfully.",
        remotePunchingCount,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

//add remote puncing task by SuperAdmin/Manager/Hr 
exports.createRemotePuchingTask = catchAsyncError(async (req, res, next) => {
  try {
    const { organisationId } = req.params;
    const { title, description, taskName, to, deadlineDate } = req.body;

    if (!title || !description || !taskName || !taskName.length || !deadlineDate) {
      return res.status(400).json({ message: "All fields are mandatory" });
    }

    const existingRemotePunchingTask = await RemotePunchingTask.findOne({
      "taskName.taskName": { $in: taskName.map(t => t.taskName) },
      organisationId,
    });

    if (existingRemotePunchingTask) {
      return res.status(400).json({
        success: false,
        error: "A remote punching task with the same name already exists in this organization",
      });
    }

    const remoteTask = new RemotePunchingTask({
      organisationId,
      title,
      description,
      deadlineDate,
      taskName: taskName.map(item => ({
        taskName: item,
      })),
      to,
    });

    await remoteTask.save();

    res.status(201).json({
      message: "Remote punching task created successfully.",
      success: true,
      remoteTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

//Get Remote punching task (SuperAdmin/Manager/Hr)
exports.getRemotePunchingTasks = catchAsyncError(async (req, res, next) => {
  try {
    const { organisationId } = req.params;

    // Fetch remote punching tasks for the given organization
    const remotePunchingTasks = await RemotePunchingTask.find({ organisationId });

    if (!remotePunchingTasks.length) {
      return res.status(404).json({
        success: false,
        message: "No remote punching tasks found for this organization.",
      });
    }

    res.status(200).json({
      success: true,
      remotePunchingTasks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// Edit remote puncing task by SuperAdmin/Manager/Hr 
exports.editRemotePunchingTask = catchAsyncError(async (req, res, next) => {
  try {
    const { taskId } = req.params; // Task ID to identify which task to update
    const { title, description, taskName, to, deadlineDate } = req.body; // Updated details

    // Validate required fields
    if (!title || !description || !taskName || !taskName.length || !deadlineDate) {
      return res.status(400).json({ message: "All fields are mandatory" });
    }

    // Find the task by ID
    const remoteTask = await RemotePunchingTask.findById(taskId);

    if (!remoteTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Update the task details
    remoteTask.title = title;
    remoteTask.description = description;
    remoteTask.taskName = taskName.map(item => ({
      taskName: item,
    }));
    remoteTask.to = to;
    remoteTask.deadlineDate = deadlineDate;
    await remoteTask.save();

    res.status(200).json({
      success: true,
      message: "Remote punching task updated successfully.",
      remoteTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// Delete remote puncing task by SuperAdmin/Manager/Hr 
exports.deleteRemotePunchingTask = catchAsyncError(async (req, res, next) => {
  try {
    const { taskId } = req.params; // Task ID to identify which task to delete

    // Find the task by ID and delete it
    const remoteTask = await RemotePunchingTask.findByIdAndDelete(taskId);

    if (!remoteTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Remote punching task deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// Fetch a specific remote punching task by taskId
exports.getRemotePunchingTaskById = catchAsyncError(async (req, res, next) => {
  try {
    const { taskId } = req.params;

    // Find the task by ID
    const remoteTask = await RemotePunchingTask.findById(taskId);

    if (!remoteTask) {
      return res.status(404).json({
        success: false,
        message: "Remote punching task not found.",
      });
    }

    res.status(200).json({
      success: true,
      remoteTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});


//accept or reject task by employee
exports.acceptRejectTask = catchAsyncError(async (req, res, next) => {
  try {
    const { organisationId, taskId } = req.params;
    const { subtaskId, employeeEmail, accepted } = req.body;
    console.log("taskAccepted", subtaskId, employeeEmail, accepted);
    console.log("req.body", req.body);

    const task = await RemotePunchingTask.findOne({
      _id: taskId,
      organisationId: organisationId,
    });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const subtask = task.taskName.id(subtaskId);

    if (!subtask) {
      return res.status(404).json({
        success: false,
        message: "Subtask not found",
      });
    }

    const employeeAcceptance = subtask.acceptedBy.find(
      (entry) => entry.employeeEmail === employeeEmail);

    if (employeeAcceptance) {
      employeeAcceptance.accepted = accepted;
    } else {
      subtask.acceptedBy.push({

        employeeEmail: employeeEmail,

        accepted: accepted,
        punchObjectId: null,
      });

    }
    await task.save();
    res.status(200).json({

      success: true,

      message: `Subtask '${subtask.taskName}' updated for employee '${employeeEmail}'`,

      task,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      error: "Internal Server Error",

    });

  }

});

//get accepted task by employee
exports.getAcceptedTasks = catchAsyncError(async (req, res, next) => {
  try {
    const { organisationId, employeeEmail } = req.params;

    // Find all tasks in the organisation
    const tasks = await RemotePunchingTask.find({
      organisationId: organisationId,
    });

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tasks found",
      });
    }

    // Filter tasks to get only those subtasks that the employee has accepted
    const acceptedTasks = tasks
      .map((task) => {
        const acceptedSubtasks = task.taskName.filter((subtask) =>
          subtask.acceptedBy.some(
            (entry) => entry.employeeEmail === employeeEmail && entry.accepted
          )
        );

        if (acceptedSubtasks.length > 0) {
          return {
            taskId: task._id,
            title: task.title,
            description: task.description,
            acceptedSubtasks: acceptedSubtasks.map((subtask) => ({
              subtaskId: subtask._id,
              subtaskName: subtask.taskName,
            })),
          };
        }
        return null;
      })
      .filter((task) => task !== null); // Remove null values

    if (acceptedTasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No accepted tasks found for this employee",
      });
    }

    // Return the accepted tasks
    res.status(200).json({
      success: true,
      tasks: acceptedTasks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// update task status by spcific employee
exports.updateTaskStatus = catchAsyncError(async (req, res, next) => {
  try {
    const { taskId, subtaskId, employeeEmail } = req.params;
    const { status, comments, location, punchObjectId } = req.body; // Expecting status, comments, and location in the body

    // Find the specific task by taskId and subtaskId
    let task = await RemotePunchingTask.findOne({
      _id: taskId,
      "taskName._id": subtaskId,
      "taskName.acceptedBy.employeeEmail": employeeEmail,
    }).populate({
      path: "taskName.acceptedBy.punchObjectId",
      match: { _id: punchObjectId }, // This ensures we only populate when the punchObjectId matches
      model: PunchObject,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task or subtask not found",
      });
    }

    // Find the specific subtask and update the status, comments, and location
    const subtask = task.taskName.id(subtaskId);
    const acceptedByEntry = subtask.acceptedBy.find(
      (entry) => entry.employeeEmail === employeeEmail
    );

    if (!acceptedByEntry) {
      return res.status(404).json({
        success: false,
        message: "Employee not found for this subtask",
      });
    }

    // Update the status, comments, and location
    if (status) acceptedByEntry.status = status;
    if (comments) acceptedByEntry.comments = comments;
    if (location) {
      acceptedByEntry.location = {
        lat: location.lat,
        long: location.long,
      };
    }
    if (punchObjectId) acceptedByEntry.punchObjectId = punchObjectId;

    // Save the updated task
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});
