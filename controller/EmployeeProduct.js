const mongoose = require("mongoose");
const catchAssyncError = require("../middleware/catchAssyncError");
const { EmployeeProductModel } = require("../models/EmployeeProductSchema");


// Add a project
exports.addProject = catchAssyncError(async (req, res, next) => {
    try {
        const { empId, organizationId } = req.params;
        const { project_name, project_description, start_date, end_date, status, team_size, team_members } = req.body;

        const newProject = new EmployeeProductModel({
            empId,
            organizationId,
            project_name,
            project_description,
            start_date,
            end_date,
            status,
            team_size,
            team_members,
        });

        await newProject.save();

        res.status(201).json({
            message: "Project added successfully.",
            project: newProject,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a project
exports.updateProject = catchAssyncError(async (req, res, next) => {
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


// Get projects by organizationId
exports.getProjectsByEmpId = catchAssyncError(async (req, res, next) => {
    try {
        const { empId } = req.params;

        const projects = await EmployeeProductModel.find({ empId });

        res.status(200).json({
            message: "Projects retrieved successfully.",
            projects,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
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
