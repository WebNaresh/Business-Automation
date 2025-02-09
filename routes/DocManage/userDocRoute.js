const express = require("express");
const auth = require("../../middleware/Auth");
const {
  AddDocuments,
  getDocuments,
  deleteDocument,
  UpdateDocuments,
  getDocumentsToApprovalId,
  getPendingDocumentOrg,
  getPendingDocumentUser,
  AcceptOrRejectUserDocument
} = require("../../controller/DocManage/userDocController");
const router = express.Router();

router.route("/emp/add-document").post(auth, AddDocuments);
router
  .route("/get-document/to-approval-id")
  .get(auth, getDocumentsToApprovalId);
router.route("/delete-update-document/:fileId").delete(auth, deleteDocument);
router.route("/update-document/:fileId").put(auth, UpdateDocuments);
router
  .route("/emp/get-document/:employeeId/:organizationId")
  .get(auth, getDocuments);
router
  .route("/org/get-pending-document/:organizationId")
  .get(auth, getPendingDocumentOrg);
router
  .route("/emp/get-pending-document/:employeeId/:organizationId")
  .get(auth, getPendingDocumentUser);
router
  .route("/organization/user-document-accept/reject/:docuementId")
  .put(auth, AcceptOrRejectUserDocument);

module.exports = router;
