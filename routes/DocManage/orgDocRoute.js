const express = require("express");
const auth = require("../../middleware/Auth");
const {
  addDocument,
  updateDocs,
  getDocuments,
  uploadDocs,
  getDocById,
  updateArray,
  getDocsForEmp,
  deleteDoc,
  getManager,
  getNotificationManager,
  acceptNotification,
  rejectNotification,
  getManagersForDowncast,
  getOrgUnderSA,
  getOneOrgHr,
} = require("../../controller/DocManage/orgDocController");
const router = express.Router();

router.route("/org/adddocuments").post(auth, addDocument);
router.route("/org/getmanagers").get(auth, getManagersForDowncast);
router.route("/org/updatedocuments/:id").patch(auth, updateDocs);
router.route("/org/getdocs").get(auth, getDocuments);
router.route("/org/getdocsmanager").get(auth, getNotificationManager);
router.route("/org/acceptNotification/:id").post(auth, acceptNotification);
router.route("/org/rejectNotification/:id").post(auth, rejectNotification);
router.route("/org/getdocsforemp").get(auth, getDocsForEmp);
router.route("/org/uploaddocs").post(auth, uploadDocs);
router.route("/org/deletedoc/:id").delete(auth, deleteDoc);
router.route("/org/updatearr/:id").post(auth, updateArray);
router.route("/org/getdoc/:id").get(auth, getDocById);
router.route("/org/getManager/:id").get(auth, getManager);
router.route("/organization/getall").get(auth, getOrgUnderSA);
router.route("/organization/getOneOrgHr").get(auth, getOneOrgHr);

module.exports = router;
