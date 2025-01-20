const mongoose = require("mongoose");

// IT Company Asset Schema
const AssetsSchema = new mongoose.Schema(
    {
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
        description: {
            type: String,
            default: null,
        },
        purchaseDate: {
            type: Date,
        },
      
        status: {
            type: String,
            default: "Available",
        },
        assignedDate: {
            type: Date,
            default: null,
        },
        disposedDate: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const AssetModel = mongoose.model("Assets", AssetsSchema);

module.exports = { AssetModel };
