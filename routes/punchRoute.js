// const express = require("express");
// const {
//   addPunchInData,
//   getPunches,
//   getKm,
//   updatePunch,
//   getAllPunches,
//   testPunchData,
//   test2Punch,
//   test3Punch,
//   test4Punch,
//   getPunchesYash,
//   getPunchForEmp,
//   checkEligibilityAndCreateObject,
// } = require("../controller/punchController");
// // const { add } = require("winston");
// const auth = require("../middleware/Auth");
// const router = express.Router();
// router.route("/punch/create").post(auth, testPunchData);
// router.route("/punch/getone").get(auth, getPunchesYash);
// // router.route("/punch/getone/yash").get(auth, getPunchesYash);
// router.route("/punch/:employeeId").get(getKm);
// router.route("/punch/update/:id").patch(updatePunch);
// router.route("/punch/getForEmp/:id").get(auth, getPunchForEmp);
// // router.route("/punch/get").get(auth, getAllPunches);
// router.route("/punch/getpunch/1").get(auth, getAllPunches);
// // router.route("/punch/create/test").post(auth, test2Punch);
// router.route("/punch/create/test").post(auth, testPunchData);
// router.route("/punch/create/test").get(auth, test4Punch);
// router.route("/punch").post(auth, checkEligibilityAndCreateObject);
// // router.route("/weekend/get/:id").get(getWeekend);
// // router.route("/weekend/delete/:id").delete(deleteWeekend);
// // router.route("/weekend/edit/:id").patch(updateWeekend);

// module.exports = router;
