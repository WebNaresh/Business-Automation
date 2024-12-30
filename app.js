const express = require("express");
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const employee = require("./routes/employeeRoute");
const vendor = require("./routes/vendorRoute");
const recruitment = require("./routes/Recruitment/RecruitmentRoute");
const attendance = require("./routes/Attendance/attendanceRoute");
const punching = require("./routes/PunchingData/punchingDataRoute");
const missPunchJustify = require("./routes/MissedPunchJustify/MissedPunchJustifyRoute");
const loanType = require("./routes/empLoanRoute");
const advanceSalary = require("./routes/AdvanceSalaryRoute/AdvanceSalary");
const communication = require("./routes/Communication/CommunicationRoute");
const emailCommunicaiton = require("./routes/EmailCommunication/EmailCommunicationRoute");
const loanData = require("./routes/LoanRoute/loanRoute");
const organisation = require("./routes/organizationRoute");
const form16 = require("./routes/form16Route");
const employeeCode = require("./routes/employeeCodeRoute");
const department = require("./routes/departmentRoute");
const leave = require("./routes/leave-requesation-route");
const profileRoute = require("./routes/profile-role-route");
const leaveTypes = require("./routes/leave-types-controller");
const error = require("./utils/error");
const shift = require("./routes/shiftRoute");
const holiday = require("./routes/holidayRoute");
const employementTypes = require("./routes/employementTypeRoute");
const designation = require("./routes/designationRoute");
const email = require("./routes/emailRoute");
const addOrganizationLocations = require("./routes/organizationLocationsRoute");
// const punch = require("./routes/punchRoute");
const punch2 = require("./routes/Punch/route");
const inputField = require("./routes/inputfieldRoute");
const weekend = require("./routes/weekendRoute");
const salaryTemplate = require("./routes/SalaryTemplateRoute");
const employeeSalary = require("./routes/employeeSalaryRoute");
const empSalaryCalDay = require("./routes/empSalaryCalDayRoute");
const subscription = require("./routes/subscriptionRoute");
const shiftManagement = require("./routes/shiftManagementRoute");
const performance = require("./routes/performance");
const incomeHouse = require("./routes/TDS/incomehouseRoute");
const incomeSalary = require("./routes/TDS/incomeFromSalaryRoute");
const incomeOther = require("./routes/TDS/incomeFromOther");
const sectionDeduction = require("./routes/TDS/sectionDeductions");
const userDoc = require("./routes/DocManage/userDocRoute");
const orgDoc = require("./routes/DocManage/orgDocRoute");
const tds = require("./routes/TDS/tdsRoute");
const remote = require("./routes/RemotePunching/remote-punching-route");
const faceDetect = require("./routes/FaceDetect/route");
const trainingSetup = require("./routes/Setup/training");
const training = require("./routes/Training/route");
const promoCode = require("./routes/promo-code/route");
const geoFencing = require("./routes/GeoFencing/route");
const letter = require("./routes/letterTypeRoute");
const { redisClient } = require("./utils/redis");
const { initPhonePay } = require("phonepe-payment-integration");
const employeeSurvey = require("./routes/EmployeeSurvey/EmployeeSurvey");
const TempPunchingData = require("./routes/TempPunchingDataRoute/TempPunchindataRoute");
const overtime = require("./routes/Overtime/Overtime");
const PFSetup = require("./routes/PFSetupRoute");
const extraDay = require("./routes/extradayRoute");
const compOffLeave = require("./routes/compOffLeaveRoute")
const salaryComponent = require("./routes/SalaryComponentRoute/SalaryComponentRoute")

const notificationroute = require("./routes/Notificationroute/notificationroute");
// Create an instance of the RedisClient class

// Socket.IO setup
const server = http.createServer(app);
const io = socketIo(server);

app.set("io", io);

initPhonePay({
  saltKey: process.env.SALT_KEY,
  merchantId: process.env.PHONE_PAY_MERCHANT_ID,
  keyIndex: Number(process.env.PHONE_PAY_KEY_INDEX),
  environment: process.env.PHONE_PAY_ENVIRONMENT,
});

// Set the Redis client on the app for later use
app.set("redisClient", redisClient);
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});
app.use("/route", employee);
app.use("/route", salaryComponent);
app.use("/route", vendor)
app.use("/route", extraDay);
app.use("/route", compOffLeave);
app.use("/route", recruitment);
app.use("/route", employeeSurvey);
app.use("/route", TempPunchingData);
app.use("/route", attendance);
app.use("/route", punching);
app.use("/route", missPunchJustify);
app.use("/route", loanType);
app.use("/route", advanceSalary);
app.use("/route", loanData);
app.use("/route", communication);
app.use("/route", emailCommunicaiton);
app.use("/route", employeeCode);
app.use("/route", employeeSalary);
app.use("/route", empSalaryCalDay);
app.use("/route", organisation);
app.use("/route", form16);
app.use("/route", department);
app.use("/route", designation);
app.use("/route", email);
app.use("/route", leave);
app.use("/route", shiftManagement);
app.use("/route", shift);
app.use("/route", profileRoute);
app.use("/route", weekend);
app.use("/route", leaveTypes);
app.use("/route", addOrganizationLocations);
app.use("/route", employementTypes);
app.use("/route", inputField);
app.use("/route", salaryTemplate);
app.use("/route", punch2);
app.use("/route", holiday);
app.use("/route", subscription);
app.use("/route", incomeHouse);
app.use("/route", incomeOther);
app.use("/route", incomeSalary);
app.use("/route", sectionDeduction);
app.use("/route", tds);
app.use("/route", remote);
app.use("/route", userDoc);
app.use("/route", orgDoc);
app.use("/route", letter);
app.use("/route", performance);
app.use("/route", trainingSetup);
app.use("/route", training);
app.use("/route/promo-code", promoCode);
app.use("/route/geo-fence", geoFencing);
app.use("/route/face-model", faceDetect);
app.use("/route", PFSetup);

//________OvertimeSetup Routes ___________

app.use("/route", overtime);
//___________________Notification____________
app.use("/route", notificationroute);

// app.use("/route", punch);
app.get("/", (req, res) => {
  const chunkyMessage = `
  🌟🚀 Welcome to the Chunky Express Server! 🚀🌟
  
  🎉 Hooray! You've reached the root endpoint. 🎉
  
  🍔 This is a chunky message just for you! 🍕
  
  🌈 Have a fantastic day filled with coding adventures! please don't hack! 🖥️💻
  `;

  res.send(chunkyMessage);
});

app.use(error);
app.use(bodyParser.json());

module.exports = { app };
