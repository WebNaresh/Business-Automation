const express = require("express");
const {
    addProject, updateProject, getProjectsByEmpId, getOneProjectOfEmployee
} = require("../controller/EmployeeProduct");
const router = express.Router();
const auth = require("../middleware/Auth");

router.route("/project/add-project/:empId/:organizationId").post(auth, addProject);
router.route("/project/update/:projectId").patch(auth, updateProject);
router.route("/project/get/:empId").get(getProjectsByEmpId);
router.route("/project/getone/:id").get(getOneProjectOfEmployee);

module.exports = router;
