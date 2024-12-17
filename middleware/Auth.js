const jwt = require("jsonwebtoken");
const { EmployeeModel } = require("../models/employeeSchema");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token)
      return res
        .status(400)
        .json({ success: false, message: "Invalid authorization" });

    jwt.verify(token, process.env.jWT_SECRETE, async (err, user) => {
      if (err) {
        return res.json({ message: "Please login again", success: false });
      }

      req.user = user;
      checkUser = req.user;
      const existingUser = await EmployeeModel.findById(user?.user?._id);
      req.user.user = existingUser;
      if (!existingUser) {
        return res
          .status(401)
          .json({ message: "User not found", success: false });
      }
      next();
    });
  } catch (error) {
    console.error("Error in auth");
    return res.status(404).json({ message: error.message });
  }
};

module.exports = auth;
