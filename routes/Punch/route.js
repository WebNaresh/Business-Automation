const express = require("express");

const auth = require("../../middleware/Auth");
const {
  createPunchObject,
  getUploadImageUrl,
  updatePunchObject,
  getAllPunchDetails,
  findManagerAndUpdateStatus,
  findNotification,
  getSinglePunchObject,
  getSinglePunchEntry,
  AcceptManager,
  RejectManager,
  RejectAccoutant,
  AcceptAccountant,
  missRemotePunch,
  getUploadImageUrlForFolder,
  getEmployeeNotificationOnly,
  updateNotificationCount,
  getApprovedNotification,
  getTodayRemoteEmp,
  getRemotePunchCountOfEmployee,
  updateApproveRejectNotificationCount,
  createRemotePuchingTask,
  getRemotePunchingTasks,
  editRemotePunchingTask,
  deleteRemotePunchingTask,
  getRemotePunchingTaskById,
  acceptRejectTask,
  getAcceptedTasks,
  updateTaskStatus
} = require("../../controller/Punch/controller");

const router = express.Router();
router
  .route("/punch")
  .post(auth, createPunchObject)
  .get(auth, getAllPunchDetails)
  .patch(auth, updatePunchObject);

router.route("/punch/manager/:punchId").post(auth, findManagerAndUpdateStatus);
router.route("/punch/:punchId").get(auth, getSinglePunchObject);
router.route("/punch-entry/:punchEntryId").get(auth, getSinglePunchEntry);
router
  .route("/punch-notification/notification-user")
  .get(auth, findNotification);
router
  .route("/punch-notification/notification-user/:employeeId")
  .get(auth, getEmployeeNotificationOnly);
router
  .route("/punch-notification/update-notification-count/:employeeId")
  .patch(auth, updateNotificationCount);
router.route("/punch/accountant/reject/:punchId").patch(auth, RejectAccoutant);
router.route("/punch/accountant/accept/:punchId").patch(auth, AcceptAccountant);
router.route("/punch/manager/accept/:punchId").patch(auth, AcceptManager);
router.route("/update/notificationCount/punch/manager/accept/:punchId").patch(auth, updateApproveRejectNotificationCount);
router.route("/punch/manager/reject/:punchId").patch(auth, RejectManager);
router.route("/punch/miss-punch").post(auth, missRemotePunch);
router
  .route("/punch/getTodayRemoteEmp/:organizationId")
  .get(auth, getTodayRemoteEmp);

router
  .route("/punch/get-notification/:employeeId")
  .get(auth, getApprovedNotification);
router.route("/punch-main/create-image-url").get(auth, getUploadImageUrl);
router.route("/s3createFile/:folder").get(auth, getUploadImageUrlForFolder);
router
  .route("/remote-punch-count/:employeeId")
  .get(auth, getRemotePunchCountOfEmployee);

router.route("/set-remote-task/:organisationId").post(auth, createRemotePuchingTask).get(auth, getRemotePunchingTasks);
router.route("/set-remote-task/:organisationId/:taskId")
  .put(auth, editRemotePunchingTask)
  .delete(auth, deleteRemotePunchingTask).get(getRemotePunchingTaskById);

router.route("/set-remote-task/:organisationId/:taskId/accept-reject")
  .patch(auth, acceptRejectTask);
router
  .route("/set-remote-task/:organisationId/accepted-tasks/:employeeEmail")
  .get(auth, getAcceptedTasks)
router.route("/update-tasks-status/:organisationId/:taskId/:subtaskId/:employeeEmail")
  .patch(auth, updateTaskStatus);
module.exports = router;
