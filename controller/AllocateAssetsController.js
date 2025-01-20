const mongoose = require("mongoose");
const catchAssyncError = require("../middleware/catchAssyncError");
const { AllocateAssetsModel } = require("../models/AllocateAssetsEmployee");

// Allocate an asset
exports.allocateAssets = catchAssyncError(async (req, res, next) => {
    try {
        const { empId, organizationId, } = req.params;
        const { assetName, assetType, allocationDate } = req.body;

        // Create a new allocation
        const newAllocation = new AllocateAssetsModel({
            empId,
            organizationId,
            assetName,
            assetType,
            allocationDate
        });

        // Save the allocation
        await newAllocation.save();

        res.status(200).json({
            success: true,
            message: "Assets allocated successfully.",
            asset: newAllocation,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single asset allocation
exports.getSingleAssetAllocation = catchAssyncError(async (req, res, next) => {
    const { allocateAssetId } = req.params;

    // Check if allocateAssetId is provided
    if (!allocateAssetId) {
        return res.status(400).json({
            success: false,
            message: "Allocation ID is required.",
        });
    }

    try {
        // Fetch the allocation details by ID
        const allocation = await AllocateAssetsModel.findById(allocateAssetId);

        // Check if the allocation document exists
        if (!allocation) {
            return res.status(404).json({
                success: false,
                message: "Allocation not found.",
            });
        }

        // Send the allocation data in the response
        res.status(200).json({
            success: true,
            allocation,
        });
    } catch (error) {
        // Handle unexpected server errors
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the allocation.",
            error: error.message, // Optionally include the error message for debugging
        });
    }
});

// Get multiple asset allocations by empId
exports.getMultipleAssetAllocations = catchAssyncError(async (req, res, next) => {
    try {
        const { empId } = req.params; // Employee ID

        // Find all allocations for the employee
        const allocations = await AllocateAssetsModel.find({ empId });

        if (!allocations || allocations.length === 0) {
            return res.status(404).json({ success: false, message: "No allocations found" });
        }

        res.status(200).json({
            success: true,
            allocations,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete asset from allocation
exports.deleteAssetFromAllocation = catchAssyncError(async (req, res, next) => {
    try {
        const { assetId } = req.params;

        // Find the allocation document by empId
        const allocation = await AllocateAssetsModel.findByIdAndDelete(assetId);


        res.status(200).json({
            success: true,
            message: "Asset removed successfully.",
            asset: allocation,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


// Update asset allocation
exports.updateAllocateAssets = catchAssyncError(async (req, res, next) => {
    try {
        const { assetId } = req.params;
        const updates = req.body;

        // Find and update the asset
        const updatedAsset = await AllocateAssetsModel.findByIdAndUpdate(assetId, updates, { new: true });

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





