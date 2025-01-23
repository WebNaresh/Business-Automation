const express = require("express");
const {
    addCashIn, addCashOut, getById, getSummary, 
    dataDeleteById, updateDataById , getFilteredData
} = require("../controller/ExpenseController");
const router = express.Router();
const auth = require("../middleware/Auth");

router.route("/add/cash-in/:organizationId").post(auth, addCashIn);
router.route("/add/cash-out/:organizationId").post(auth, addCashOut);
router.route("/get/get-all-data/:organizationId").get(getFilteredData);
router.route("/get/get-one/:id").get(auth, getById);
router.route("/get/get-summary/:organizationId").get(auth, getSummary);
router.route("/delete/:id").delete(auth, dataDeleteById);
router.route("/update/:id").patch(auth, updateDataById);



module.exports = router;
