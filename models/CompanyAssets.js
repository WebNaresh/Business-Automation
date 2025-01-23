const mongoose = require("mongoose");

// IT Company Asset Schema
const AssetsSchema = new mongoose.Schema(
    {
        assetName: {
            type: String,
            required: true,
        },

    },
    {
        timestamps: true,
    }
);

const AssetModel = mongoose.model("Assets", AssetsSchema);

module.exports = { AssetModel };
