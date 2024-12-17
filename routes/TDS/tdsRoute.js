const express = require("express");
const {
  getTDSDetails,
  getEmpUnderAccountant,
  getTDSForEmployee,
  getTDSForEmployeeNotify,
  getCountNotificatins,
  createInvestmentDeclaration,
  deleteInvestmentDecalration,
  getInvestmentDeclaration,
  getTotalTDSDetails,
  getNewTotalTDSDetails,
  getSectionInvestmentDecalration,
  changeStatus,
  getTotalDeclarations,
  changeRegime,
  deleteInvestment,
} = require("../../controller/TDS/tdsController");
const auth = require("../../middleware/Auth");

const router = express.Router();
router
  .route("/tds/getTDSDetails/:empId/:financialYear")
  .get(auth, getTDSDetails);
router
  .route("/tds/getAllEmployeesUnderAccoutant/:profile")
  .get(auth, getEmpUnderAccountant);
router
  .route("/tds/getTDSWorkflow/:empId/:financialYear")
  .get(auth, getTDSForEmployee);
router
  .route("/tds/getTDSNotify/:empId/:financialYear")
  .get(auth, getTDSForEmployeeNotify);
router
  .route("/tds/getCountNotifications/:financialYear/:role")
  .get(auth, getCountNotificatins);

// New TDS Routes
router
  .route("/tds/createInvestment")
  .post(auth, createInvestmentDeclaration)
  .patch(auth, deleteInvestmentDecalration);

// new route used for delete investments
router.route("/tds/deleteInvestment").patch(auth, deleteInvestment);

router.route("/tds/changeRegime/:financialYear").put(auth, changeRegime);
router.route("/tds/getInvestment").get(auth, getInvestmentDeclaration);

router
  .route("/tds/getMyDeclaration/:financialYear/:usersalary")
  .get(auth, getTotalTDSDetails);
router
  .route("/tds/getTotalDeclarations/:financialYear")
  .get(auth, getTotalDeclarations);

router
  .route("/tds/getNewRegime/:financialYear/:usersalary")
  .get(auth, getNewTotalTDSDetails);
router.route("/tds/changeApprovals/:financialYear").post(auth, changeStatus);

module.exports = router;
