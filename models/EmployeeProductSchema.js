const mongoose = require("mongoose");

const EmployeeProductSchema = new mongoose.Schema(
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
        project_name: {
            type: String,
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
        team_size: {
            type: String,
            required: true,
        },
        team_members: [
            {
                name: {
                    type: String,
                    required: [true, "Team member name is required"],

                },
                role: {
                    type: String,
                    required: [true, "Role is required"],

                },
            },
        ],
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
