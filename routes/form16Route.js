const express = require("express");
const {
  uploadForm16File,
  uploadImage,
  checkForm16,
  getForm16,
  deleteForm16,
  getForm16NotificationToEmp,
} = require("../controller/Form16Controller/Form16Controller");
const multer = require("multer");
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const auth = require("../middleware/Auth");
router
  .route("/add/form16")
  .post(auth, upload.single("form16FileUrl"), uploadForm16File);
router.route("/get/form16").get(uploadImage);
router.route("/check/form16").post(auth, checkForm16);
router.route("/get/form16/:organizationId/:employeeId").get(auth, getForm16);
router.route("/delete/form16/:organizationId/:employeeId").delete(deleteForm16);
router
  .route("/get/form16NotificationToEmp")
  .get(auth, getForm16NotificationToEmp);
module.exports = router;
