const mongoose = require("mongoose");

const OrgProjectSchema = new mongoose.Schema(
    {
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            default: null,
        },
        project_name: {
            type: String,
            required: true,
        },
        company_name: {
            type: String,
            required: true,
        },
        team_size: {
            type: String,
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

const OrgProjectModel = mongoose.model("OrgProject", OrgProjectSchema);

module.exports = { OrgProjectModel };
