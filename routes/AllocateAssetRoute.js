const express = require("express");
const {
    allocateAssets, getSingleAssetAllocation, getMultipleAssetAllocations, deleteAssetFromAllocation, updateAllocateAssets
} = require("../controller/AllocateAssetsController");
const router = express.Router();
const auth = require("../middleware/Auth");

router.route("/add/allocate-assets/:organizationId/:empId").post(auth, allocateAssets);
router.route("/update/allocate-asset/:assetId").patch(auth, updateAllocateAssets);
router.route("/get/allocate-one-assets/:allocateAssetId").get(auth, getSingleAssetAllocation);
router.route("/get/allocate-assets/:empId").get(auth, getMultipleAssetAllocations);
router.route("/delete/allocate-assets/:assetId").delete(auth, deleteAssetFromAllocation);

module.exports = router;
