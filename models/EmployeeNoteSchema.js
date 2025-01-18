const mongoose = require("mongoose");

// Employee Note Schema
const EmployeeNoteSchema = new mongoose.Schema(
    {
        empId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
        },
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            default: null,
        },
        notes:
        {
            type: String,
            required: true,
        },


    },
    {
        timestamps: true,
    }
);

const EmployeeNoteModel = mongoose.model("EmployeeNote", EmployeeNoteSchema);

module.exports = { EmployeeNoteModel };
