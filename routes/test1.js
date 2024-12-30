const express = require("express");
const { test1function } = require("../controller/test1Controller");
const router = express.Router();
router.route("/test1").post(test1function);
module.exports = router;
