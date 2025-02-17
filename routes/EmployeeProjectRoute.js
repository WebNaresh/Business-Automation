const express = require("express");
const {
    addProjectInOrg, updateProjectInOrg, getProjectInOrg, getProject, allocateProjectToEmp, updateProjectToEmp, getProjectsByEmpId, getOneProjectOfEmployee, getEmployeeInProject
} = require("../controller/EmployeeProduct");
const router = express.Router();
const auth = require("../middleware/Auth");

router.route("/project/add-project/:organizationId").post(auth, addProjectInOrg);
router.route("/project/update-project/:organizationId/:projectId").patch(auth, updateProjectInOrg);
router.route("/project/get-project-in-org/:id").get(getProjectInOrg);
router.route("/project/get-project/:organizationId").get(getProject);
router.route("/project/allocate-project-to-emp/:organizationId").post(auth, allocateProjectToEmp);
router.route("/project/update-project-to-emp/:projectId").patch(auth, updateProjectToEmp);
router.route("/project/get/:empId").get(getProjectsByEmpId);
router.route("/project/getone/:id").get(getOneProjectOfEmployee);
router.route("/project/:projectId").get(getEmployeeInProject);

module.exports = router;
