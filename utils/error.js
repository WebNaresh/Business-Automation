const ErrorHandler = require("./errorHandler");
module.exports = (err, req, res, next) => {
  console.error(`🚀 ~ file: error.js:3 ~ err:`, err);
  err.statusCode = err.statusCode || 500;
  console.error(`🚀 ~ file: error.js:6 ~ err.message:`, err.message);
  err.message = err.message || "internal Server Error";
  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
  // Wrong Mongodb Id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    console.log(`🚀 ~ file: error.js:21 ~ message:`, message);
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again `;
    err = new ErrorHandler(message, 400);
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try again `;
    err = new ErrorHandler(message, 400);
  }
};
