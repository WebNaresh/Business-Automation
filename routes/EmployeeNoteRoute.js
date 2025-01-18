const express = require("express");
const {
    addEmployeeNote ,updateNoteEmployee , getNoteOfEmployee , getOneNoteOFEmployee 
} = require("../controller/EmployeeNoteController");
const router = express.Router();
const auth = require("../middleware/Auth");

router.route("/note/add-note/:empId/:organizationId").post(auth, addEmployeeNote);
router.route("/note/update/:noteId").patch(auth, updateNoteEmployee);
router.route("/note/get/:empId").get(getNoteOfEmployee);
router.route("/note/getone/:id").get(getOneNoteOFEmployee);

module.exports = router;
