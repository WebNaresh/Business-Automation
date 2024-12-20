const connectDatabase = require("./config/database");
const dotenv = require("dotenv");
const logger = require("./utils/logger");

const { app } = require("./app");
const { invokerazorpay } = require("./utils/razorypay");
const { JobEmail } = require("./utils/node-cron/job-email");
// Handling Uncaught Exception
// process.on("uncaughtException", (err) => {
//   console.log(`Error: ${err.message}`);
//   console.log(`Shutting down the server due to Uncaught Exception`);
//   process.exit(1);
// });
// Config
dotenv.config();
// Connecting to database
connectDatabase();
// Invoking Redis
new JobEmail();
invokerazorpay();

const server = app.listen(process.env.APP_PORT, () => {
  logger.info(`Server is working on http://localhost:${process.env.APP_PORT}`);
  console.log(`Server is working on http://localhost:${process.env.APP_PORT}`);
});

// Unhandled Promise Rejection
// process.on("unhandledRejection", (err) => {
//   console.log(`Error: ${err.message}`);
//   console.log(`Shutting down the server due to Unhandled Promise Rejection`);
//   server.close(() => {
//     process.exit(1);
//   });
// });
// npm i express cookie-parser body-parser mongoose dotenv validator
