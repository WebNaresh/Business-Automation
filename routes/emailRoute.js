const express = require("express");
const {
    addEmail, getEmail, deleteEmail, editEmail,getOneEmail
} = require("../controller/emailSettingController");
const router = express.Router();
router.route("/email/create").post(addEmail);
router.route("/email/getone/:id").get(getOneEmail);
router.route("/email/get/:id").get(getEmail);
router.route("/email/delete/:id").delete(deleteEmail);
router.route("/email/edit/:id").patch(editEmail);


module.exports = router;