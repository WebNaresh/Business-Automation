const mongoose = require("mongoose");
const catchAssyncError = require("../middleware/catchAssyncError");
const { AssetModel } = require("../models/CompanyAssets");

// Add an asset
exports.addAssets = catchAssyncError(async (req, res, next) => {
    try {
        const { organizationId } = req.params;
        const { assetName, assetType, description, purchaseDate, status } = req.body;

        // Create a new asset
        const newAsset = await AssetModel.create({
            organizationId,
            assetName,
            assetType,
            description,
            purchaseDate,
            status,
        });

        res.status(200).json({
            success: true,
            message: "Asset added successfully.",
            asset: newAsset,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update an asset
exports.updateAssets = catchAssyncError(async (req, res, next) => {
    try {
        const { assetId } = req.params;
        const updates = req.body;

        // Find and update the asset
        const updatedAsset = await AssetModel.findByIdAndUpdate(assetId, updates, { new: true });

        if (!updatedAsset) {
            return res.status(404).json({ success: false, message: "Asset not found." });
        }

        res.status(200).json({
            success: true,
            message: "Asset updated successfully.",
            asset: updatedAsset,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get a single asset by ID
exports.getSingleAsset = catchAssyncError(async (req, res, next) => {
    try {
        const { assetId } = req.params;

        // Find the asset by ID
        const asset = await AssetModel.findById(assetId);

        if (!asset) {
            return res.status(404).json({ success: false, message: "Asset not found." });
        }

        res.status(200).json({
            success: true,
            message: "Asset retrieved successfully.",
            asset,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


// Get all assets or assets by employee/organization
exports.getAssets = catchAssyncError(async (req, res, next) => {
    try {
        const { organizationId } = req.query;

        // Build query filter
        const filter = {};
        if (organizationId) filter.organizationId = organizationId;

        // Fetch assets based on the filter
        const assets = await AssetModel.find(filter);

        res.status(200).json({
            success: true,
            message: "Assets retrieved successfully.",
            assets,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete an asset
exports.deleteAssets = catchAssyncError(async (req, res, next) => {
    try {
        const { assetId } = req.params;

        // Find and delete the asset
        const deletedAsset = await AssetModel.findByIdAndDelete(assetId);

        if (!deletedAsset) {
            return res.status(404).json({ success: false, message: "Asset not found." });
        }

        res.status(200).json({
            success: true,
            message: "Asset deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
