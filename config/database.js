const mongoose = require("mongoose");
const connectDatabase = () => {
  const LOCALHOST =
    process.env.DB_URI || "mongodb://localhost:27017/your-database-name";
  mongoose
    .connect(LOCALHOST)
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports = connectDatabase;
// npm i mongoose
