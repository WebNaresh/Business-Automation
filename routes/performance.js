const express = require("express");
const router = express.Router();
const auth = require("../middleware/Auth");
const {
  getOrgHierarchy,
  createPerformanceSetting,
  getPerformanceSetting,
  getOrganizationGoals,
  createGoals,
  getEmployeesUnderManager,
  getEmployeesUnderForLeaves,
  getGoalById,
  getEmployeeGoals,
  submitGoals,
  getSingleGoals,
  getSingleBothGoals,
  // getBothGoals,

  //new routes
  getPerformanceDashboard,
  getDashboard,
  getEmployeeDashboard,
  updateSingleGoal,
  deleteSingleGoal,
  getSingleGoalsPreview,
  getOrganizationGoalsByRole,
  getManagerGoals,
  getHrGoals,
  getOrganizationGoalsStatus,
  getPerformanceTable,
  getPerformanceTableForEmployee,
  giveRating,
  changeRatingStatus,
} = require("../controller/performance/performance");

router
  .route("/performance/getOrgHierarchy/:organisationId")
  .get(auth, getOrgHierarchy);
router
  .route("/performance/createSetup/:organisationId")
  .post(auth, createPerformanceSetting);
router
  .route("/performance/getSetup/:organisationId")
  .get(auth, getPerformanceSetting);
// router
//   .route("/performance/getOrganizationGoals")
//   .get(auth, getOrganizationGoals);
router.route("/performance/createGoal").post(auth, createGoals);
router
  .route("/employee/getEmployeeUnderManager/:role")
  .get(auth, getEmployeesUnderManager);

router
  .route("/employee/getEmployeesUnderForLeaves/:role")
  .get(auth, getEmployeesUnderForLeaves);

// router.route("/employee/getEmployeeGoals/:empId").get(auth, getBothGoals);
router
  .route("/employee/getSingleEmployeeGoals/:id")
  .get(auth, getSingleBothGoals);

// router
//   .route("/employee/getEmployeeUnderManager")
//   .get(auth, getOrganizationGoals);

router.route(`/performance/getGoalDetails/:id`).get(auth, getGoalById);
router
  .route(`/performance/getEmployeeGoals/:getPerformanceSetting`)
  .get(auth, getEmployeeGoals);
router.route(`/performance/submitGoals`).post(auth, submitGoals);
router.route(`/performance/updateSingleGoal/:id`).patch(auth, updateSingleGoal);
router
  .route(`/performance/deleteSingleGoal/:id`)
  .delete(auth, deleteSingleGoal);
router.route(`/performance/getSingleGoals/:id`).get(auth, getSingleGoals);

// New Routes

//TODO current Route
router
  .route(`/performance/getPerformanceDashboard/:role`)
  .get(auth, getDashboard);
router
  .route(`/performance/getEmployeeDashboard/:id`)
  .get(auth, getEmployeeDashboard);
router
  .route(`/performance/getOrganizationGoals`)
  .get(auth, getOrganizationGoalsByRole);

router.route(`/performance/getManagers/:empId`).get(auth, getManagerGoals);
router.route(`/performance/getHr/empId`).get(auth, getHrGoals);
router
  .route(`/performance/getGoals/:organizationId`)
  .get(auth, getOrganizationGoalsStatus);

router.route(`/performance/giveRating`).put(auth, giveRating);
router
  .route(`/performance/getPerformanceTable/:role/:organizationId`)
  .get(auth, getPerformanceTable);
router
  .route(`/performance/getPerformanceTableForEmployee/:empId`)
  .get(auth, getPerformanceTableForEmployee);

router.route(`/performance/changeRatingStatus`).post(auth, changeRatingStatus);

module.exports = router;
