const express = require("express");
const {
  updateTraining,
} = require("../../controller/Training/training-employee-controller");
const auth = require("../../middleware/Auth");
const router = express.Router();
router
  .route("/training/:trainingEmployeeId")
  .patch(auth, updateTraining)
  .post(auth, addPdfUrlToEmployee);

module.exports = router;
