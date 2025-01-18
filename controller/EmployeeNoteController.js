const mongoose = require("mongoose");
const catchAssyncError = require("../middleware/catchAssyncError");
const { EmployeeNoteModel } = require("../models/EmployeeNoteSchema");



exports.addEmployeeNote = catchAssyncError(async (req, res, next) => {
    try {
        const { empId, organizationId } = req.params;
        const { notes } = req.body;

        const newNote = new EmployeeNoteModel({
            empId,
            organizationId,
            notes
        });

        const savedNote = await newNote.save();
        res.status(200).json({
            message: "Project updated successfully.",
            savedNote
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Update a project
exports.updateNoteEmployee = catchAssyncError(async (req, res, next) => {
    try {
        const { noteId } = req.params;
        const updates = req.body;

        const updateNotes = await EmployeeNoteModel.findByIdAndUpdate(noteId, updates, { new: true });

        if (!updateNotes) {
            return res.status(404).json({ message: "Notes not found." });
        }

        res.status(200).json({
            message: "Notes updated successfully.",
            notes: updateNotes,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Get projects by organizationId
exports.getNoteOfEmployee = catchAssyncError(async (req, res, next) => {
    try {
        const { empId } = req.params;

        const notes = await EmployeeNoteModel.find({ empId });

        res.status(200).json({
            message: "Notes retrieved successfully.",
            notes,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


exports.getOneNoteOFEmployee = catchAssyncError(async (req, res, next) => {
    try {
        const { id } = req.params;

        const notes = await EmployeeNoteModel.findById({ _id: id });

        res.status(201).json({
            message: "Notes found successfully",
            notes: notes
        });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

