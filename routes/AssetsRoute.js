const express = require("express");
const {
    addAssets, updateAssets, getSingleAsset, getAssets, deleteAssets
} = require("../controller/CompanyAssetsController");
const router = express.Router();
const auth = require("../middleware/Auth");

router.route("/add/assets").post(addAssets);
router.route("/update/assets/:assetId").patch(auth, updateAssets);
router.route("/get/one-assets/:assetId").get(auth, getSingleAsset);
router.route("/get/assets").get( getAssets);
router.route("/delete/assets/:assetId").get(auth, deleteAssets);

module.exports = router;
