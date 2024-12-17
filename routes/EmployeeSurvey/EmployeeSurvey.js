const express = require("express");
const auth = require("../../middleware/Auth");
const { addEmployeeSurvey, getOpenSurveys, getDraftSurveys, getEmployeeSurveyById, deleteEmployeeSurvey, getOpenSurveyById, addEmployeeResponseSurvey, getSurveyResponses, getClosedSurveys, getCloseSurveys, getEmployeeResponseSurvey, getEmployeeSurveyResponses, getEmployeeResponseSurveyById, getEmployeeResponseSurveyBySurveyId, updateEmployeeSurveyResponse, addEmployeeSurveyPermission, updateEmployeeSurveyPermission, getEmployeeSurveyPermission, manageEmployeeSurveyPermission, getSaveSurveys, sendEmployeeSurveyEmail } = require("../../controller/EmployeeSurveyController/EmployeeSurveyController");
const { updateEmployeeSurvey } = require("../../controller/EmployeeSurveyController/EmployeeSurveyController");

const router = express.Router();

router
    .route("/organization/:organizationId/add-employee-survey-form")
    .post(auth, addEmployeeSurvey);

router
    .route("/organization/:organizationId/update-employee-survey/:id")
    .put(auth, updateEmployeeSurvey);

router
    .route("/organization/:organizationId/get-open-survey")
    .get(auth, getOpenSurveys);

router
    .route("/organization/:organizationId/get-draft-survey")
    .get(auth, getDraftSurveys);

router
    .route("/organization/:organizationId/get-single-draft-survey/:id")
    .get(auth, getEmployeeSurveyById);

router
    .route("/organization/:organizationId/delete-draft-survey/:id")
    .delete(auth, deleteEmployeeSurvey);

router
    .route("/organization/:organizationId/get-single-open-survey/:id")
    .get(auth, getOpenSurveyById);

router
    .route("/organization/:organizationId/add-employee-survey-response-form")
    .post(auth, addEmployeeResponseSurvey);

router
    .route("/organization/:organizationId/update-employee-survey-response-form/:responseId")
    .put(auth, updateEmployeeSurveyResponse);

router
    .route("/organization/:organizationId/get-response-survey")
    .get(auth, getEmployeeSurveyResponses);

router
    .route("/organization/:organizationId/get-single-response-survey/:surveyId/:responseId")
    .get(auth, getEmployeeResponseSurveyById);

router
    .route("/organization/:organizationId/get-response-survey-surveyId/:surveyId")
    .get(auth, getEmployeeResponseSurveyBySurveyId);

router
    .route("/organization/:organizationId/get-close-survey")
    .get(auth, getClosedSurveys);

router
    .route("/organization/:organizationId/employee-survey-permission")
    .post(auth, manageEmployeeSurveyPermission);


router.route("/organization/:organizationId/employee-survey-permission")
    .put(auth, manageEmployeeSurveyPermission);

router
    .route("/organization/:organizationId/get-employee-survey-permission")
    .get(auth, getEmployeeSurveyPermission);

router
    .route("/organization/:organizationId/get-save-survey")
    .get(auth, getSaveSurveys);

module.exports = router;