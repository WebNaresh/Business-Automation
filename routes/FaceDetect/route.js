// const express = require("express");
// const {
//   getFace,
//   createAndUpdate,
// } = require("../../controller/FaceDetect/controller");
// const router = express.Router();
// router.route("/face/:id").get(getFace).post(createAndUpdate);
// module.exports = router;

const express = require("express");
const {
  getFace,
  createAndUpdate,
  compareface
} = require("../../controller/FaceDetect/controller");
const router = express.Router();
const auth = require("../../middleware/Auth");
router.route("/face/:id").get(getFace).post(createAndUpdate);

const multer = require('multer');
const upload = multer({ dest: '../../facemodel' });
// router.route("/compare").post(auth , compareface);
// router.route("/compare").post(upload.single('uploadedImage'), auth, compareface);]
router.route("/compare").post(upload.fields([{ name: 'uploadedImage' }, { name: 'profileImage' }]), auth, compareface);

module.exports = router;



