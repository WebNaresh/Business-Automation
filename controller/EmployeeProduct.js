const mongoose = require("mongoose");
const catchAssyncError = require("../middleware/catchAssyncError");
const { EmployeeProductModel } = require("../models/EmployeeProductSchema");
const { OrgProjectModel } = require("../models/OrgProject");


exports.addProjectInOrg = catchAssyncError(async (req, res, next) => {
    try {
        const { organizationId } = req.params;
        const { project_name } = req.body;

        const newProjectInOrg = new OrgProjectModel({
            organizationId,
            project_name,

        });

        await newProjectInOrg.save();

        res.status(201).json({
            message: "Project added successfully.",
            project: newProjectInOrg,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

exports.updateProjectInOrg = catchAssyncError(async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const updates = req.body;

        const updateProjectInOrg = await OrgProjectModel.findByIdAndUpdate(projectId, updates, { new: true });

        if (!updateProjectInOrg) {
            return res.status(404).json({ message: "Project not found." });
        }

        res.status(200).json({
            message: "Project updated successfully.",
            project: updateProjectInOrg,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


exports.getProjectInOrg = catchAssyncError(async (req, res, next) => {
    try {
        const { id } = req.params;

        console.log("id", id);


        const project = await OrgProjectModel.findById({ _id: id });

        res.status(201).json({
            message: "project found successfully",
            project: project
        });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

exports.getProject = catchAssyncError(async (req, res, next) => {
    const { organizationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
        return res.status(400).json({ message: "Invalid organization ID." });
    }

    const projects = await OrgProjectModel.find({ organizationId });

    res.status(200).json({
        message: projects.length > 0 ? "Projects found successfully." : "No projects found.",
        projects,
    });
});


// assign project to org
exports.allocateProjectToEmp = catchAssyncError(async (req, res, next) => {
    const { organizationId } = req.params;
    const { empId, project_name, project_description, start_date, end_date, status, } = req.body;

    if (!empId || !organizationId || !project_name || !project_description || !start_date) {
        return res.status(400).json({ message: "All required fields must be provided." });
    }

    const newProject = await EmployeeProductModel.create({
        empId: Array.isArray(empId) ? empId : [empId], // Ensure empId is always an array
        project_name: Array.isArray(project_name) ? project_name : [project_name],
        project_description,
        start_date,
        end_date: end_date || null,
        status: status || "OnGoing",
        organizationId,
    });

    res.status(201).json({
        message: "Project allocated successfully.",
        project: newProject,
    });
});


// Update a project
exports.updateProjectToEmp = catchAssyncError(async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const updates = req.body;

        const updatedProject = await EmployeeProductModel.findByIdAndUpdate(projectId, updates, { new: true });

        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found." });
        }

        res.status(200).json({
            message: "Project updated successfully.",
            project: updatedProject,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Get projects by emp Id
exports.getProjectsByEmpId = catchAssyncError(async (req, res, next) => {
    const { empId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(empId)) {
        return res.status(400).json({ message: "Invalid employee ID." });
    }

    const projects = await EmployeeProductModel.find({ "empId.value": empId.toString() });

    res.status(200).json({
        message: "Projects retrieved successfully.",
        projects,
    });
});


exports.getOneProjectOfEmployee = catchAssyncError(async (req, res, next) => {
    try {
        const { id } = req.params;

        const project = await EmployeeProductModel.findById({ _id: id });

        res.status(201).json({
            message: "project found successfully",
            project: project
        });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message });
    }
});
