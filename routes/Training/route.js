const express = require("express");
const {
  createTraining,
  updateTraining,
  deleteTraining,
  addAttendedToTrainingModel,
  getEmployeeWithNameWithLimit5,
  getEmployeeWithOrganizationId,
  getEmployeeWithDepartmentId,
  getTrainingDetailsWithNameLimit10WithCreatorId,
  getTrainingDetails,
  getTrainingImage,
  fetchDepartmentByOrganizationId,
  getUpcomingTrainingWithEmployeeId,
  getRecentTrainingWithOrgId,
  getOnGoingTrainingsWitHEmployeeId,
  getOverdueTrainingsWithEmployeeId,
  getEmployeeTrainingInfo,
  createTrainingEmployee,
  completeTrainingAndCreateFeedbackFunction,
  getCompletedTrainings,
  addTrainingToEmployees,
} = require("../../controller/Training/controller");
const auth = require("../../middleware/Auth");
const router = express.Router();
router.route("/training/:organizationId/create").post(auth, createTraining);
router.route("/training").get((req, res) => {
  res.send("Hello World");
});
router
  .route("/training/:trainingId")
  .put(auth, updateTraining)
  .delete(auth, deleteTraining)
  .post(auth, addAttendedToTrainingModel)
  .get(auth, getTrainingDetails);

router
  .route("/training/getEmployeeWithName/:name")
  .get(auth, getEmployeeWithNameWithLimit5);
router
  .route("/training/getEmployeeWithOrganizationId")
  .get(auth, getEmployeeWithOrganizationId);
router
  .route("/training/getEmployeeWithDepartmentId")
  .get(auth, getEmployeeWithDepartmentId);

router.route("/training/:trainingId/getImage").get(auth, getTrainingImage);

router
  .route(
    "/training/getTrainingDetailsWithNameLimit10WithCreatorId/:organizationId"
  )
  .get(auth, getTrainingDetailsWithNameLimit10WithCreatorId);

router
  .route("/get-departments/:organizationId")
  .get(auth, fetchDepartmentByOrganizationId);

router
  .route("/training/get-upcoming-trainings/:employeeId")
  .get(auth, getUpcomingTrainingWithEmployeeId);
router
  .route("/training/get-recent-training/:organizationId")
  .get(auth, getRecentTrainingWithOrgId);
router
  .route("/training/get-ongoing-trainings/:employeeId")
  .get(auth, getOnGoingTrainingsWitHEmployeeId);

router
  .route("/training/get-overdue-trainings/:employeeId")
  .get(auth, getOverdueTrainingsWithEmployeeId);
router
  .route("/training/get-employee-training-info/:trainingId")
  .get(auth, getEmployeeTrainingInfo);

router
  .route("/training/create-training-employee/:trainingId")
  .put(auth, createTrainingEmployee);

router
  .route("/training/complete-training-and-create-feedback/:trainingEmployeeId")
  .put(auth, completeTrainingAndCreateFeedbackFunction);

router
  .route("/training/get-completed-trainings/:employeeId")
  .get(auth, getCompletedTrainings);

router
  .route("/training-employee/assign-training-employees/:trainingId")
  .post(auth, addTrainingToEmployees);

module.exports = router;
