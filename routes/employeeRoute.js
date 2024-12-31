const express = require("express");
const {
  create,
  login,
  token,
  forgot,
  reset,

  adduserid,
  googleLogin,

  changeRole,
  createDepartmentHead,
  addEmployee,
  addEmployeeExcel,
  deleteEmployee,
  getAllManagers,
  getAllManagersForOnboarding,
  deleteMultipleEmployees,
  getManagerDetails,
  getPaginatedEmployees,
  checkProfileExists,
  updateEmployee,
  getUserProfileData,
  sendOtpRequest,
  verifyOtp,
  employeeCountManager,
  addSalaryData,
  getSalaryData,
  getDeptHeadUserData,
  getDeptDelegateHeadData,
  uploadImage,
  addUserProfileData,
  populateEmp,
  createDelegate,
  getDelegateSuperAdmin,
  getEmployeeDateBasedOrgId,
  getEmployee,
  deleteDelegate,
  setOrgIdtoSA,
  getOrgTree,
  getHr,
  resetPassword,
  employeeIsActiveMobile,
  confirmLogout,
  loginapp,
  getTotalSalary,
  deleteProfilePhoto,
  getEmployeeInDepartment,
} = require("../controller/employeeController");
const auth = require("../middleware/Auth");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
("");
router.route("/employee/assignOrgToSelf").put(auth, setOrgIdtoSA);
router.route("/employee/getOrgTree/:orgId").get(auth, getOrgTree);
router.route("/employee/verifyOtp").post(verifyOtp);
router.route("/employee/sendOtp").post(sendOtpRequest);
router.route("/employee/countofEmployees").get(auth, employeeCountManager);
router.route("/employee/create").post(create);
router.route("/employee/reset").put(resetPassword);
router
  .route("/employee/delegate")
  .patch(auth, createDelegate)
  .get(auth, getDelegateSuperAdmin)
  .delete(auth, deleteDelegate);
router.route("/employee/login").post(login);
router.route("/employee/loginapp").post(loginapp);
router.route("/employee/employee-isActive-mobile").post(employeeIsActiveMobile);
router.route("/employee/confirmLogout").post(confirmLogout);
router.route("/employee/forgot-password").post(forgot);

router.route("/employee/add-user-id").post(adduserid);
router.route("/employee/google").get(googleLogin);

router.route("/employee/reset-password/:token").post(reset);
router.route("/:id/verify/:token/").get(token);
router.route("/employee/changerole/").post(changeRole);
router
  .route("/employee/department/create-department-head")
  .post(createDepartmentHead);
router.route("/employee/add-employee").post(auth, addEmployee);
router.route("/employee/add-employee-excel").post(auth, addEmployeeExcel);
router.route("/employee/delete/:id").delete(auth, deleteEmployee);
router.route("/employee/delete-multiple").delete(auth, deleteMultipleEmployees);
router
  .route("/employee/get-manager/:organizationId")
  .get(auth, getManagerDetails);
router
  .route("/employee/get-manager/:organizationId")
  .get(auth, getManagerDetails);
router
  .route("/employee/getAllManager/:organizationId/:employeeId")
  .get(auth, getAllManagers);
router
  .route("/employee/getAllManager/:organizationId")
  .get(auth, getAllManagersForOnboarding);
router
  .route("/employee/get-paginated-emloyee/:organizationId")
  .get(auth, getPaginatedEmployees);
router.route("/employee/:organizationId/get-emloyee").get(auth, getEmployee);
router
  .route("/employee/get-department-head/:organizationId")
  .get(auth, getDeptHeadUserData);
router
  .route("/employee/get-department-delegate-head/:organizationId")
  .get(auth, getDeptDelegateHeadData);
router.route("/employee/get-hr/:organizationId").get(auth, getHr);
router
  .route("/employee/check-profile-exists/:organizationId")
  .post(auth, checkProfileExists);
router.route("/employee/update/:organizationId/:id").put(auth, updateEmployee);
router.route("/employee/upload").get(uploadImage);
router
  .route("/employee/profile/add/:employeeId")
  .post(auth, addUserProfileData);

router.route("/employee/get/profile/:employeeId").get(auth, getUserProfileData);
//delete profile
router.route("/employee/photo/:employeeId").delete(auth, deleteProfilePhoto);

router.route("/employee/populate/get").get(auth, populateEmp);
router.route("/add-salary-component/:employeeId").post(auth, addSalaryData);
router.route("/get-salary-component/:employeeId").get(auth, getSalaryData);
router
  .route("/employee/:organizationId/total-salary")
  .get(auth, getTotalSalary);
router
  .route("/employee/get/:organizationId")
  .get(auth, getEmployeeDateBasedOrgId);
router
  .route("/get-employee/from-department/:organizationId/:deptname")
  .get(getEmployeeInDepartment);

module.exports = router;
