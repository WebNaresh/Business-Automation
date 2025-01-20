const mongoose = require("mongoose");

// IT Company Asset Schema
const AllocateAssetsEmpSchema = new mongoose.Schema(
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
        assetName: {
            type: String,
            required: true,
        },
        assetType: {
            type: String,
            required: true,
        },
        allocationDate: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            default: "Allocated",
        },
    },


    {
        timestamps: true,
    }
);

const AllocateAssetsModel = mongoose.model("AllocateAssets", AllocateAssetsEmpSchema);

module.exports = { AllocateAssetsModel };
