const mongoose = require("mongoose");

const EmployeeProductSchema = new mongoose.Schema(
    {
        empId: {
            type: [
                {
                    label: String,
                    value: String,
                },
            ],
            required: true,
        },
        project_name: {
            type: [
                {
                    label: String,
                    value: String,
                },
            ],
            required: true,
        },
        project_description: {
            type: String,
            required: true,
        },

        start_date: {
            type: Date,
            required: true,
        },
        end_date: {
            type: Date,
        },
        status: {
            type: String,
            enum: ["OnGoing", "Completed"],
            default: "OnGoing",
        },
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            default: null,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const EmployeeProductModel = mongoose.model("EmployeeProduct", EmployeeProductSchema);

module.exports = { EmployeeProductModel };
