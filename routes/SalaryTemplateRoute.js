const express = require("express");
const { createSalaryTemplate, updateSalaryTemplate, getSalaryTemplates, getSalaryTemplate, deleteSalaryTemplate } = require("../controller/salary-template-controller/SalaryTemplateController")

const auth = require("../middleware/Auth");
const router = express.Router();

router.route("/salary-template-org/:organisationId").post(auth, createSalaryTemplate).get(auth, getSalaryTemplates)
// .get(auth, getEmployementTypes);
router.route("/salary-template/:id").put(auth, updateSalaryTemplate).delete(auth, deleteSalaryTemplate).get(auth, getSalaryTemplate)

module.exports = router;
