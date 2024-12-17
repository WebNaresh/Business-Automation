const express = require("express");
const {
  addLoanType,
  getLoanType,
  getLoanTypeById,
  updateLoanType,
  deleteLoanType,
} = require("../controller/EmployeeLoanController/employeeLoanController");
const auth = require("../middleware/Auth");
const router = express.Router();
router
  .route("/organization/:organizationId/add-loan-type")
  .post(auth, addLoanType);
router
  .route("/organization/:organizationId/get-loan-type")
  .get(auth, getLoanType);
router
  .route("/organization/:organizationId/:loanTypeId/get-loan-type")
  .get(auth, getLoanTypeById);
router
  .route("/organization/:organizationId/:loanTypeId/update-loan-type")
  .put(auth, updateLoanType);
router
  .route("/organization/:organizationId/:loanTypeId/delete-loan-type")
  .delete(auth, deleteLoanType);
module.exports = router;
