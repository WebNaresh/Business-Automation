const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
const auth = require("../middleware/Auth");
const {
    verifyOtp,
    sendOtpRequest,
    Vendorsetup,
    createvendor
} = require('../controller/vendorController');


router.route("/vendor/foodsetuppage").post(Vendorsetup);
router.route("/vendor/verifyOtp").post(verifyOtp);
router.route("/vendor/sendOtp").post(sendOtpRequest);
router.route("/vendor/create").post(createvendor);
module.exports = router;
