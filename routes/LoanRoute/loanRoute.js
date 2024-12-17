const express = require("express");
const {
  addLoanData,
  updateLoanData,
  DeleteLoanData,
  getLoanDataByUserId,
  getEmpLaonApplRequestToHr,
  getLoanOfSpecificEmployee,
  AcceptOrReject,
  getEmpOngoingLoanData,
  getEmpLaonDataApprovedRejectedByHr,
  getEmpLoanData
} = require("../../controller/LoanController/LoanController");
const auth = require("../../middleware/Auth");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router
  .route("/organization/:organizationId/add-loan-data")
  .post(auth, upload.single("fileurl"), addLoanData);
router
  .route("/organization/:organizationId/:loanId/update-loan-data")
  .put(auth, upload.single("fileurl"), updateLoanData);
router
  .route("/delete-loan-data/:loanId")
  .delete(auth, DeleteLoanData);
router
  .route("/organization/:organizationId/:userId/get-loan-data")
  .get(auth, getLoanDataByUserId);
router.route("/pendingLoans").get(auth, getEmpLaonApplRequestToHr);
router
  .route("/organization/loans/:loanId")
  .get(auth, getLoanOfSpecificEmployee);
router
  .route("/organization/accept/reject/loans/:loanId")
  .put(auth, AcceptOrReject);
router
  .route("/organization/:organizationId/:userId/get-ongoing-loan-data")
  .get(auth, getEmpOngoingLoanData);
router
  .route("/get-approved-reject-loan-to-employee")
  .get(auth, getEmpLaonDataApprovedRejectedByHr);

router
  .route("/get-loan-to-employee")
  .get(auth, getEmpLoanData);

module.exports = router;
