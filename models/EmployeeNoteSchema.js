const mongoose = require("mongoose");

// Employee Note Schema
const EmployeeNoteSchema = new mongoose.Schema(
    {
        empId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
        },
        date: {
            type: Date,
        },
        time: {
            type: String,
        },
        notes:
        {
            type: String,
            required: true,
        },

        creatorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            default: null,
        },
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            default: null,
        },

    },
    {
        timestamps: true,
    }
);

const EmployeeNoteModel = mongoose.model("EmployeeNote", EmployeeNoteSchema);

module.exports = { EmployeeNoteModel };
