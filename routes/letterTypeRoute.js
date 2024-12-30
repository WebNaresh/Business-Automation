const express = require("express");
const { updateDocument, getDocuments } = require("../controller/letterTypeCon");
const router = express.Router();
router.route("/letter/post/:organizationId").post(updateDocument);
router.route("/letter/get/:organizationId").get(getDocuments);

module.exports = router;
