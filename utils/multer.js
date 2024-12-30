const multer = require("multer");

let upload;

const initMulter = () => {
  // Additional socket.io configuration and event handlers can be added here

  return upload;
};

module.exports = {
  initMulter,
  getMulter: () => upload,
};
