const express = require("express");
const auth = require("../../middleware/Auth");
const {
  AddDocuments,
  getDocuments,
  deleteDocument,
  UpdateDocuments,
  getDocumentsToApprovalId,
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
//router.route("/employee/uploaddocs").post(auth, uploadDocs);

module.exports = router;
