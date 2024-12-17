// employeeController a User
// in this controller to add all funcitonality related user
const catchAssyncError = require("../middleware/catchAssyncError");
const { EmployeeModel } = require("../models/employeeSchema");
const bcrypt = require("bcryptjs");
const sendToken = require("../utils/sendToken");
const sendEmail = require("../utils/sendEmail");

const nodemailer = require("nodemailer");

const jwt = require("jsonwebtoken");
const {
  EmployeeManagementModel,
} = require("../models/employeManager/employeeManagementSchema");
const { Otp } = require("../utils/Otp-Validation");
const { default: mongoose } = require("mongoose");
const { OrganisationModel } = require("../models/organizationSchema");
const { generateSignedUrl } = require("../s3");
const {
  SelectedShiftModel,
} = require("../models/shiftManagement/selectedShiftSchema");
require("dotenv").config();

const {
  OrganizationRelationModel,
} = require("../models/org-rel-emp/organisationRelation");
const logger = require("../utils/logger");
const {
  trainingEmployeeModel,
} = require("../models/Training/training-employee");
const {
  SalaryComponentModel,
} = require("../models/SalaeryComponent/SalaryComponentSchema");
const { oauth2 } = require("googleapis/build/src/apis/oauth2");
const { default: axios } = require("axios");
const { oauth2client } = require("../utils/googleConfig");
const { Console } = require("winston/lib/winston/transports");
require("dotenv").config(); // Ensure environment variables are loaded
// mobile verify
exports.sendOtpRequest = catchAssyncError(async (req, res, next) => {
  const OTP = new Otp(req, res);
  OTP.sendOTP();
});

exports.verifyOtp = catchAssyncError(async (req, res, next) => {
  try {
    const OTP = new Otp(req, res);
    OTP.verifyOTP();
  } catch (error) {
    next();
  }
});

// add super admin
exports.create = catchAssyncError(async (req, res, next) => {
  try {
    const { first_name, last_name, middle_name, email, password, phone } =
      req.body;
    const existingUser = await EmployeeModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }
    // Create a new user instance
    let newUser = new EmployeeModel({
      first_name,
      last_name,
      middle_name,
      email,
      password,
      phone_number: phone,
    });

    // Assign Super-Admin role to the user
    newUser.profile.push("Super-Admin");

    // Save the user to the database
    await newUser.save();
    const userWithoutPassword = {
      _id: newUser._id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      middle_name: newUser.middle_name,
      email: newUser.email,
    };
    // Save the user to the database
    await newUser.save();

    // Create a verification token
    const token = jwt.sign(userWithoutPassword, process.env.jWT_SECRETE, {
      expiresIn: "1h",
    });

    // Construct email verification URLs
    const verificationUrl = `${process.env.BASE_URL}/verify/${token}`;

    // Email content with inline styles for formatting
    const emailContent = `
          <h2>Email Verification for Your Account</h2>
          <p>Dear ${newUser.first_name} ${newUser.last_name},</p>
          <p>We have received a request to verify your email address associated with your account on AEIGS software. Please click on the following link to complete the verification process:</p>
          <a href="${verificationUrl}" style="text-decoration: none; background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px;">Email Verification Link</a>
          <p>If you did not initiate this request, please ignore this email. Your account security is important to us.</p>
          <p>Thank you for choosing AEIGS software.</p>
          <p><strong>Best regards,</strong></p>
          <p>AEIGS software Team</p>  
          <p>Email: <a href="mailto:arganitservices@gmail.com">arganitservices@gmail.com</a></p>
          <p>Phone: 9082462161</p>
          <p>Address: 603, Haware grand heritage, Kaspate Wasti, Wakad, Pune, Maharashtra 411057</p>
        `;

    // Send the verification email
    await sendEmail(
      newUser.email,
      "Email Verification",
      emailContent,
      newUser,
      token
    );
    // Send a success response
    res.status(201).send({
      message:
        "An Email has been sent to your account. Please verify your email address.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

exports.resetPassword = catchAssyncError(async (req, res, next) => {
  try {
    const { prevPassword, email, password } = req.body;
    console.log(`🚀 ~ prevPassword:`, prevPassword);

    const getEmployee = await EmployeeModel.findOne({ email });

    if (prevPassword === password) {
      return res
        .status(400)
        .json({ message: "previous password and new password cannot be same" });
    }
    if (!getEmployee) {
      return res.status(400).json({ message: "Employee not found" });
    }

    if (prevPassword) {
      const isPasswordMatch = await bcrypt.compare(
        prevPassword,
        getEmployee?.password
      );

      if (!isPasswordMatch) {
        return res
          .status(400)
          .json({ message: "previous password does not match" });
      }
    }

    const isEmployeeExits = await EmployeeModel.findOne({ email });

    if (!isEmployeeExits) {
      return res.status(400).json({ message: "Account not found" });
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    const changePassword = await EmployeeModel.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    return res.status(200).json(changePassword);
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
});

exports.token = catchAssyncError(async (req, res, next) => {
  try {
    const decodedToken = jwt.decode(req.params.token);
    console.log(
      `🚀 ~ file: employeeController.js:115 ~ decodedToken:`,
      decodedToken
    );

    // Check if the token is valid and not expired
    if (!decodedToken || Date.now() >= decodedToken.exp * 1000) {
      return res.status(400).send({ message: "Invalid or expired token." });
    }

    // Find the user in the database based on the decoded token data
    const userInDb = await EmployeeModel.findOne({
      _id: decodedToken._id,
    });

    // Check if the user exists in the database
    if (!userInDb) {
      return res.status(400).send({ message: "Invalid user." });
    }

    // Check if the user is already verified
    if (userInDb.verified) {
      return res.status(201).send({ message: "Email already verified." });
    }

    // Update the user's verified status
    userInDb.verified = true;
    await userInDb.save();

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

exports.changeRole = catchAssyncError(async (req, res, next) => {
  try {
    const { role, email } = req.body;
    const isVerfied = await EmployeeModel.findOne({
      email: email,
      profile: { $elemMatch: { $eq: role } },
    });
    console.log(`🚀 ~ file: employeeController.js:154 ~ isVerfied:`, isVerfied);

    if (!isVerfied) {
      return res.status(404).json({ message: "User is not found" });
    }

    const roleToken = jwt.sign({ role: role }, process.env.jWT_SECRETE, {
      expiresIn: "1h",
    });

    return res
      .status(200)
      .json({ message: "Role changes successfully", roleToken, role });
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
});

// forgot api
exports.forgot = catchAssyncError(async (req, res, next) => {
  const { email } = req.body;
  try {
    const oldUser = await EmployeeModel.findOne({ email });
    if (!oldUser) {
      return res.status(400).send({ message: "User does not exists" });
    }
    const secret = process.env.jWT_SECRETE + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, _id: oldUser._id }, secret, {
      expiresIn: "10m",
    });
    const link = `${process.env.BASE_URL}/reset-password/${token}`;
    // Email content with inline styles for formatting
    const emailContent = `
    <h2>Password Reset Request</h2>
    <p>Dear ${oldUser.first_name} ${oldUser.last_name},</p>
    <p>We have received a request to reset the password associated with your account on AEIGS software. Please click on the following link to reset your password:</p>
    <a href="${link}" style="text-decoration: none; background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px;">Reset Password</a>
    <p>If you did not initiate this request, please ignore this email. Your account security is important to us.</p>
    <p>Thank you for choosing AEIGS software.</p>
    <p><strong>Best regards,</strong></p>
    <p>AEIGS software Team</p>
    <p>Email: <a href="mailto:arganitservices@gmail.com">arganitservices@gmail.com</a></p>
    <p>Phone: 9082462161</p>
    <p>Address: 603, Haware grand heritage, Kaspate Wasti, Wakad, Pune, Maharashtra 411057</p>
  `;

    // Send the verification email
    await sendEmail(
      oldUser.email,
      "Reset Password",
      emailContent,
      oldUser,
      token
    );

    // Send a success response
    res.status(201).send({
      message:
        "An Email has been sent to your account. Please check your inbox and follow the instructions to reset your password.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// reset api
exports.reset = catchAssyncError(async (req, res, next) => {
  try {
    const { password } = req.body;
    const decodedToken = jwt.decode(req.params.token);
    console.log(
      `🚀 ~ file: employeeController.js:232 ~ decodedToken:`,
      decodedToken
    );
    // Check if the token is valid and not expired
    if (!decodedToken || Date.now() >= decodedToken.exp * 1000) {
      return res.status(400).send({ message: "Invalid or expired token." });
    }

    const userInDb = await EmployeeModel.findById(decodedToken?._id);
    // Check if the user exists in the database
    if (!userInDb) {
      return res.status(400).send({ message: "Invalid user." });
    }
    // Update user's password
    userInDb.password = password;
    await userInDb.save();

    res.status(200).send({ message: "Password updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login API
exports.login = catchAssyncError(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if the user with the provided email or user_id exists
    const user = await EmployeeModel.findOne({
      $or: [
        { email: email ? email.toLowerCase() : null },
        { user_id: email ? email.toLowerCase() : null },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // If the user is not verified, send a verification email
    if (user.verified === false) {
      const userWithoutPassword = {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        middle_name: user.middle_name,
        email: user.email,
      };
      console.log(email);

      const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRETE, {
        expiresIn: "8m",
      });
      const verificationUrl = `${process.env.BASE_URL}/verify/${token}`;

      const emailContent = `
        <h2>Email Verification for Your Account</h2>
        <p>Dear ${user.first_name} ${user.last_name},</p>
        <p>We have received a request to verify your email address associated with your account on AEIGS software. Please click on the following link to complete the verification process:</p>
        <a href="${verificationUrl}" style="text-decoration: none; background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px;">Email Verification Link</a>
        <p>If you did not initiate this request, please ignore this email. Your account security is important to us.</p>
        <p>Thank you for choosing AEIGS software.</p>
        <p><strong>Best regards,</strong></p>
        <p>AEIGS software Team</p>
        <p>Email: <a href="mailto:arganitservices@gmail.com">arganitservices@gmail.com</a></p>
        <p>Phone: 9082462161</p>
        <p>Address: 603, Haware grand heritage, Kaspate Wasti, Wakad, Pune, Maharashtra 411057</p>
      `;

      await sendEmail(
        user.email,
        "Email Verification",
        emailContent,
        userWithoutPassword,
        token
      );

      return res.status(400).send({
        message:
          "Verification link sent to your email address. Please verify yourself first.",
      });
    }

    // If user is verified, send a token
    sendToken(user, res, 200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// // login api
// exports.login = catchAssyncError(async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     // Check if the user with the provided email exists
//     const user = await EmployeeModel.findOne({ email: email.toLowerCase()}|| {user_id : user_id.toLowerCase()});
//   //  console.log(user.email.toLowerCase())
//   //   console.log(email.toLowerCase())
//     console.log(email)
//     console.log(user)

//     // if (!user) {
//     //   return res.status(401).json({ message: "Invalid credentials." });
//     // }

//     if ((user?.email.toLowerCase() ===! email.toLowerCase()) || (user?.email.toLowerCase() ===! user_id.toLowerCase())
//       {
//       return res.status(401).json({ message: "Invlid credentials." });
//     }

//     // Compare the provided password with the hashed password in the database
//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch) {
//       return res.status(401).json({ message: "Invalid credentials." });
//     }

//     if (user.verified === false) {
//       const userWithoutPassword = {
//         _id: user._id,
//         first_name: user.first_name,
//         last_name: user.last_name,
//         middle_name: user.middle_name,
//         email: user.email,
//       };

//       const token = jwt.sign(userWithoutPassword, process.env.jWT_SECRETE, {
//         expiresIn: "5m",
//       });
//       const verificationUrl = `${process.env.BASE_URL}/verify/${token}`;

//       // Email content with inline styles for formatting
//       const emailContent = `
//       <h2>Email Verification for Your Account</h2>
//       <p>Dear ${user.first_name} ${user.last_name},</p>
//       <p>We have received a request to verify your email address associated with your account on AEIGS software. Please click on the following link to complete the verification process:</p>
//       <a href="${verificationUrl}" style="text-decoration: none; background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px;">Email Verification Link</a>
//       <p>If you did not initiate this request, please ignore this email. Your account security is important to us.</p>
//       <p>Thank you for choosing AEIGS software.</p>
//       <p><strong>Best regards,</strong></p>
//       <p>AEIGS software Team</p>
//       <p>Email: <a href="mailto:arganitservices@gmail.com">arganitservices@gmail.com</a></p>
//       <p>Phone: 9082462161</p>
//       <p>Address: 603, Haware grand heritage, Kaspate Wasti, Wakad, Pune, Maharashtra 411057</p>
//     `;

//       // Send the verification email
//       await sendEmail(
//         user.email,
//         "Email Verification",
//         emailContent,
//         userWithoutPassword,
//         token
//       );

//       return res.status(400).send({
//         message:
//           "Verification link sent to your email address. Please verify yourself first.",
//       });
//     }

//     sendToken(user, res, 200);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

//google sign in api for only intermidiate plan

exports.googleLogin = catchAssyncError(async (req, res, next) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).send("Missing code parameter");
    }

    // Exchange the authorization code for an access token
    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);

    // Fetch user info from Google
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    console.log("User result:", userRes.data);

    const { email } = userRes.data;
    const user = await EmployeeModel.findOne({ email }).populate(
      "organizationId"
    );
    console.log("user all data", user);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const organization = user.organizationId;
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Check if the organization's plan is 'Intermediate' or higher
    if (organization.packageInfo !== "Intermediate Plan") {
      console.log(organization.packageInfo);
      return res
        .status(403)
        .json({ message: "Organization plan does not allow sign in" });
    }

    // Generate a JWT token
    const token = jwt.sign({ email: user.email }, process.env.jWT_SECRETE, {
      expiresIn: "5m",
    });
    sendToken(user, res, 200);
    return res.status(200).json({ token, message: "Success", user });
  } catch (err) {
    console.error("Error during Google login:", err);
    res.status(500).json({ message: err.message });
  }
});

//google sign in api for all plan

// require('dotenv').config(); // Ensure environment variables are loaded

// exports.googleLogin = catchAssyncError(async (req, res, next) => {
//   try {
//     const { code } = req.query;
//     if (!code) {
//       return res.status(400).send('Missing code parameter');
//     }

//     // Exchange the authorization code for an access token
//     const googleRes = await oauth2client.getToken(code);
//     oauth2client.setCredentials(googleRes.tokens);

//     // Fetch user info from Google
//     const userRes = await axios.get(
//       `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
//     );
//     console.log("User result:", userRes.data);

//     const { email } = userRes.data;

//     if (!email) {
//       return res.status(400).send('Email not found in user info');
//     }
//     console.log("EMAIL:", email);

//     // Fetch the user from the database
//     const user = await EmployeeModel.findOne({ email: email.toLowerCase() });
//     console.log("User found in database:", user);

//     // Check if the user exists
//     if (!user) {
//       return res.status(401).json({ message: "Invalid credentials." });
//     }

//     // Generate a JWT token
//     const token = jwt.sign({ email: user.email }, process.env.jWT_SECRETE, {
//       expiresIn: "5m",
//     });
//     sendToken(user, res, 200);
//     return res.status(200).json({ token, message: "Success", user });

//   } catch (err) {
//     console.error("Error during Google login:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

exports.adduserid = catchAssyncError(async (req, res, next) => {
  try {
    const { email, newUserId } = req.body;
    console.log("body", req.body);

    // Find the employee and their organization using an object for the query
    const employee = await EmployeeModel.findOne({ email }).populate(
      "organizationId"
    );
    console.log("employee all data", employee);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const organization = employee.organizationId;
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Check if the organization's plan is 'Intermediate' or higher
    if (organization.packageInfo !== "Intermediate Plan") {
      console.log(organization.packageInfo);
      return res.status(403).json({
        message: "Organization plan does not allow adding new user IDs",
      });
    }

    // Check if the employee already has a user ID
    if (employee.user_id) {
      return res
        .status(400)
        .json({ message: "User ID already exists for this employee" });
    }

    // Assign the new user ID
    employee.user_id = newUserId;
    await employee.save();

    res.status(200).json({ message: "User ID added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// login api for android
exports.loginapp = async (req, res) => {
  try {
    const { email, password, deviceId } = req.body;
    console.log("Login request received for email:", email);

    const employee = await EmployeeModel.findOne({ email });
    if (!employee) {
      console.log("Employee not found for email:", email);
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    console.log("Employee found:", employee);

    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      console.log("Invalid password for email:", email);
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    console.log("Password is valid");

    // Ensure sessions is initialized as an array
    if (!Array.isArray(employee.sessions)) {
      console.log("Initializing sessions array");
      employee.sessions = [];
    }

    // Check if the employee is logged in from another device
    const existingSession = employee.sessions.find(
      (session) => session.deviceId !== deviceId
    );
    if (existingSession) {
      console.log(
        "Employee is logged in on another device. Device ID:",
        existingSession.deviceId
      );
      return res.status(409).json({
        success: false,
        message:
          "You are logged in on another device. Do you want to log out from the previous device?",
        token: existingSession.token,
      });
    }

    console.log("No existing session found. Generating token...");

    // Use sendToken to generate the same token
    sendToken(employee, res, 200);

    // Invalidate old sessions
    console.log("Invalidating old sessions for device ID:", deviceId);
    employee.sessions = employee.sessions.filter(
      (session) => session.deviceId === deviceId
    );

    // Add the new session
    console.log("Adding new session for device ID:", deviceId);
    employee.sessions.push({
      deviceId,
      token: employee.getJWTToken(),
      lastActive: new Date(),
    });

    await employee.save();
    console.log("Employee session saved successfully");
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.confirmLogout = async (req, res) => {
  try {
    const { token, deviceId } = req.body;

    if (!token || !deviceId) {
      return res
        .status(400)
        .json({ success: false, message: "Token and deviceId are required" });
    }

    // Find the employee by token
    const employee = await EmployeeModel.findOne({ "sessions.token": token });
    if (!employee) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    try {
      // Decode the old token to extract user details
      const decodedToken = jwt.verify(token, process.env.jWT_SECRETE);

      // Remove the old session
      employee.sessions = employee.sessions.filter(
        (session) => session.token !== token
      );

      // Add the new session
      const newToken = jwt.sign(
        {
          user: {
            _id: employee._id,
            first_name: employee.first_name,
            last_name: employee.last_name,
            email: employee.email,
            profile: employee.profile,
            organizationId: employee.organizationId,
            deptname: employee.deptname,
            birthdate: employee.birthdate,
          },
        },
        process.env.jWT_SECRETE,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      employee.sessions.push({
        deviceId,
        token: newToken,
        lastActive: new Date(),
      });

      await employee.save();

      // Construct the response with user details
      const responsePayload = {
        success: true,
        token: newToken,
        user: {
          _id: employee._id,
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
          profile: employee.profile,
          organizationId: employee.organizationId,
          deptname: employee.deptname,
          birthdate: employee.birthdate,
        },
        iat: decodedToken.iat,
        exp: decodedToken.exp,
      };

      res.status(200).json(responsePayload);
    } catch (tokenError) {
      if (tokenError.name === "TokenExpiredError") {
        // Handle token expiration
        // Generate a new token and return it
        const newToken = jwt.sign(
          {
            user: {
              _id: employee._id,
              first_name: employee.first_name,
              last_name: employee.last_name,
              email: employee.email,
              profile: employee.profile,
              organizationId: employee.organizationId,
              deptname: employee.deptname,
              birthdate: employee.birthdate,
            },
          },
          process.env.jWT_SECRETE,
          { expiresIn: process.env.JWT_EXPIRE }
        );

        // Replace the old token with the new one
        employee.sessions = employee.sessions.map((session) => {
          if (session.token === token) {
            return { deviceId, token: newToken, lastActive: new Date() };
          }
          return session;
        });

        await employee.save();

        // Construct the response with user details
        const responsePayload = {
          success: true,
          token: newToken,
          user: {
            _id: employee._id,
            first_name: employee.first_name,
            last_name: employee.last_name,
            email: employee.email,
            profile: employee.profile,
            organizationId: employee.organizationId,
            deptname: employee.deptname,
            birthdate: employee.birthdate,
          },
        };

        return res.status(200).json(responsePayload);
      } else {
        // Handle other JWT errors
        return res
          .status(500)
          .json({ success: false, message: "Failed to verify token." });
      }
    }
  } catch (error) {
    console.error("Error in confirmLogout:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// logout mobile api to update isActive field
exports.employeeIsActiveMobile = catchAssyncError(async (req, res, next) => {
  try {
    // Extract user ID and isActive status from the request body
    const { userId, isActive } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Log the ID and isActive status for debugging
    console.log(
      `Updating isActive status for user ID: ${userId} to ${isActive}`
    );

    // Update the user document in the database
    const user = await EmployeeModel.findByIdAndUpdate(
      userId,
      { isActive: isActive },
      { new: true }
    );

    if (!user) {
      console.log(`User with ID ${userId} not found.`);
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      success: true,
      message: "isActive status updated successfully.",
    });
  } catch (error) {
    console.error(`Error updating isActive status: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});
// add api
exports.createDepartmentHead = catchAssyncError(async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      middle_name,
      email,
      address,
      joining_date,
      gender,
      creatorId,
      number,
    } = req.body;
    if (
      !first_name ||
      !last_name ||
      !middle_name ||
      !email ||
      !address ||
      !joining_date ||
      !gender ||
      !creatorId ||
      !number
    ) {
      return res.status(400).json({
        message:
          "Please provide all required fields: first_name, last_name, email, creatorId ,address,joining_date,gender,creatorId,number",
      });
    }

    // Check if the email is already registered
    const existingUser = await EmployeeModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Create a new user instance with the provided data
    let newUser = new EmployeeModel({
      first_name,
      last_name,
      middle_name,
      address,
      number,
      joining_date,
      gender,
      email,
      creatorId,
      password: "default@123",
      organizationId: "653511246ac5449b98ac9113", // Replace with the actual organization ID
    });

    // Save the user to the database
    await newUser.save();

    // Create a verification token
    const token = jwt.sign(
      {
        _id: newUser._id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
      },
      process.env.jWT_SECRETE,
      {
        expiresIn: "5m",
      }
    );

    // Construct email verification URL
    const verificationUrl = `${process.env.BASE_URL}/verify/${token}`;

    // Email content with inline styles for formatting
    const emailContent = `
  <h2>Congratulations on Your Selection as Department Head</h2>
  <p>Dear ${newUser.first_name} ${newUser.last_name},</p>
  <p>Congratulations! You have been selected as the Department Head for our organization. We appreciate your dedication and commitment to the role.</p>
  <p>To activate your account and begin your responsibilities, please click on the following link:</p>
  <a href="${verificationUrl}" style="text-decoration: none; background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px;">Activate Your Account</a>
  <p>If you did not expect this email, please contact our support team for assistance.</p>
  <p>Thank you for being a valuable part of our team.</p>
  <p><strong>Best regards,</strong></p>
  <p>AEIGS software Team</p>
  <p>Email: <a href="mailto:arganitservices@gmail.com">arganitservices@gmail.com</a></p>
  <p>Phone: 9082462161</p>
  <p>Address: 603, Haware grand heritage, Kaspate Wasti, Wakad, Pune, Maharashtra 411057</p>
`;

    // Send the verification email
    await sendEmail(
      newUser.email,
      "Added Department Head",
      emailContent,
      newUser,
      token
    );

    // Send a success response
    res.status(201).send({
      message:
        "An email has been sent to the Department Head. The department has been created successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

exports.addReporteeToManager = catchAssyncError(async (req, res, next) => {
  try {
    const { managerId, reporteeId } = req.body;

    // Check if the manager exists
    const managerExists = await EmployeeModel.exists({ _id: managerId });
    if (!managerExists) {
      return res.status(404).json({ message: "Manager not found" });
    }

    // Check if the reportee exists
    const reporteeExists = await EmployeeModel.exists({ _id: reporteeId });
    if (!reporteeExists) {
      return res.status(404).json({ message: "Reportee not found" });
    }

    // Check if the relationship already exists
    const existingRelationship = await EmployeeManagementModel.findOne({
      managerId,
      reporteeIds: reporteeId,
    });
    if (existingRelationship) {
      return res.status(400).json({ message: "Relationship already exists" });
    }

    // Add reportee to manager's reporteeIds array
    await EmployeeManagementModel.updateOne(
      { managerId },
      { $addToSet: { reporteeIds: reporteeId } }
    );

    res.status(200).json({ message: "Reportee added successfully" });
  } catch (error) {
    console.error("Error adding reportee to manager:", error.message);
    res.status(500).json({
      message: `Failed to add reportee to manager: ${error.message}`,
    });
  }
});

exports.checkProfileExists = catchAssyncError(async (req, res, next) => {
  try {
    const { profile } = req.body;
    const organizationId = req.params.organizationId; // Extract organization ID from the request parameters

    const profileExists = await EmployeeModel.exists({
      organizationId, // Match the organization ID
      profile: { $in: profile },
    });

    // Adjust the response message based on profile existence
    if (profileExists) {
      return res.status(200).json({
        profileExists,
        message: "Profile(s) already exist(s) for this organization.",
      });
    } else {
      return res.status(200).json({
        profileExists,
        message: "Profile does not exist for this organization.",
      });
    }
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
});

exports.addEmployee = catchAssyncError(async (req, res, next) => {
  try {
    let {
      first_name,
      last_name,
      email,
      password,
      companyemail,
      address,
      adhar_card_number,
      pan_card_number,
      dept_cost_center_no,
      shift_allocation,
      bank_account_no,
      phone_number,
      deptname,
      citizenship,
      employmentType,
      date_of_birth,
      joining_date,
      designation,
      profile,
      empId,
      salarystructure,
      worklocation,
      gender,
      pwd,
      uanNo,
      esicNo,
      organizationId,
      creatorId,
      mgrempid,
      ...dynamicFields
    } = req.body;

    // check if employee count limit is over or not
    const empLimit = await OrganisationModel.findById(organizationId);

    const empCountInOrg = await EmployeeModel.find({ organizationId });

    if (empCountInOrg.length >= empLimit.memberCount) {
      return res.status(400).json({
        message:
          "You have exceed employee onboarding limit kindly upgrade your organization pack or increase member count",
        status: false,
      });
    }
    if (profile) {
      profile = [...profile, "Employee"];
    } else {
      profile = ["Employee"];
    }
    const existingEmployee = await EmployeeModel.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: "Email already registered." });
    }
    const isEmpCodeExist = await EmployeeModel.findOne({
      empId,
      organizationId,
    });
    if (isEmpCodeExist) {
      return res.status(400).json({
        message: "Employee code already exists for this organization.",
      });
    }

    const filteredFields = Object.fromEntries(
      Object.entries(dynamicFields).filter(([_, value]) => value !== "")
    );
    let newEmployee = new EmployeeModel({
      first_name,
      last_name,
      email,
      password,
      salarystructure,
      companyemail,
      address,
      adhar_card_number,
      pan_card_number,
      dept_cost_center_no,
      shift_allocation: shift_allocation ? shift_allocation : null,
      bank_account_no,
      phone_number,
      deptname: deptname ? deptname : null,
      citizenship,
      salarystructure,
      date_of_birth,
      joining_date,
      designation: designation ? designation : null,
      worklocation,
      gender,
      profile,
      empId,
      employmentType,
      mgrempid,
      pwd,
      uanNo,
      esicNo,
      organizationId,
      creatorId,
      additionalInfo: filteredFields,
    });

    if (profile.includes("Manager")) {
      await EmployeeManagementModel.create({
        managerId: newEmployee._id,
        organizationId,
      });
    }

    if (mgrempid) {
      const assigneddata = await EmployeeManagementModel.findOneAndUpdate(
        { managerId: mgrempid },
        { $addToSet: { reporteeIds: newEmployee._id } },
        { new: true }
      );

      newEmployee.mgrempid = assigneddata._id;
    }

    await newEmployee.save();
    console.log("new employee", newEmployee);
    // return res.status(400).json({
    //   message: "Invalid profile provided.",
    // });

    const userWithoutPassword = {
      _id: newEmployee._id,
      first_name: newEmployee.first_name,
      last_name: newEmployee.last_name,
      middle_name: newEmployee.middle_name,
      email: newEmployee.email,
    };

    // Create a verification token
    const token = jwt.sign(userWithoutPassword, process.env.jWT_SECRETE, {
      expiresIn: "10m",
    });

    // Construct email verification URLs
    const verificationUrl = `${process.env.BASE_URL}/verify/${token}`;

    // Email content with inline styles for formatting
    const emailContent = `
          <h2>Email Verification for Your Account</h2>
          <p>Dear ${newEmployee.first_name} ${newEmployee.last_name},</p>
          <p>We have received a request to verify your email address associated with your account on AEIGS software. Please click on the following link to complete the verification process:</p>
          <a href="${verificationUrl}" style="text-decoration: none; background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px;">Email Verification Link</a>
          <p>If you did not initiate this request, please ignore this email. Your account security is important to us.</p>
          <p>Thank you for choosing AEIGS software.</p>
          <p><strong>Best regards,</strong></p>
          <p>AEIGS software Team</p>
          <p>Email: <a href="mailto:arganitservices@gmail.com">arganitservices@gmail.com</a></p>
          <p>Phone: 9082462161</p>
          <p>Address: 603, Haware grand heritage, Kaspate Wasti, Wakad, Pune, Maharashtra 411057</p>
        `;

    // Send the verification email
    await sendEmail(
      newEmployee.email,
      "Email Verification",
      emailContent,
      newEmployee,
      token
    );
    // Send a success response
    res.status(201).send({
      message:
        "An Email has been sent to your account. Please verify your email address.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

exports.addEmployeeExcel = catchAssyncError(async (req, res, next) => {
  try {
    const employeesData = req.body; // Expecting an array of employee objects
    console.log("employeesData", employeesData);

    const results = [];
    const errorMessages = [];
    const emailList = []; // Array to hold all employee emails
    const verificationLinks = []; // Array to hold all verification links

    // Check organization limit
    const { organizationId } = employeesData[0];
    console.log("organizationId====", organizationId);

    const empLimit = await OrganisationModel.findById(organizationId);
    const empCountInOrg = await EmployeeModel.countDocuments({
      organizationId,
    });

    if (empCountInOrg >= empLimit.memberCount) {
      return res.status(400).json({
        message: "You have exceeded employee onboarding limit.",
        status: false,
      });
    }

    const employeePromises = employeesData.map(async (employeeData) => {
      const {
        first_name,
        last_name,
        email,
        password,
        companyemail,
        address,
        adhar_card_number,
        pan_card_number,
        dept_cost_center_no,
        shift_allocation,
        bank_account_no,
        phone_number,
        deptname,
        citizenship,
        employmentType,
        date_of_birth,
        joining_date,
        designation,
        profile,
        empId,
        salarystructure,
        worklocation,
        gender,
        pwd,
        uanNo,
        esicNo,
        mgrempid,
        ...dynamicFields
      } = employeeData;

      // Check for existing employee by email
      let existingEmployee = await EmployeeModel.findOne({ email });
      if (existingEmployee) {
        errorMessages.push(`Email ${email} already registered.`);
        return;
      }

      // Check for existing employee code
      const isEmpCodeExist = await EmployeeModel.findOne({
        empId,
        organizationId,
      });
      if (isEmpCodeExist) {
        errorMessages.push(
          `Employee code ${empId} already exists for this organization.`
        );
        return;
      }

      const filteredFields = Object.fromEntries(
        Object.entries(dynamicFields).filter(([_, value]) => value !== "")
      );

      let newEmployee = new EmployeeModel({
        first_name,
        last_name,
        email,
        password, // Make sure to hash this before saving
        companyemail,
        address,
        adhar_card_number,
        pan_card_number,
        dept_cost_center_no,
        shift_allocation: shift_allocation ? shift_allocation : null,
        bank_account_no,
        phone_number,
        deptname: deptname || null,
        citizenship,
        employmentType,
        date_of_birth,
        joining_date,
        designation: designation || null,
        worklocation,
        gender,
        profile: profile ? [...profile, "Employee"] : ["Employee"],
        empId,
        salarystructure,
        organizationId,
        creatorId: req.user.id, // Assuming creatorId is from the authenticated user
        additionalInfo: filteredFields,
      });

      // Handle manager logic
      if (newEmployee.profile.includes("Manager")) {
        await EmployeeManagementModel.create({
          managerId: newEmployee._id,
          organizationId,
        });
      }

      if (mgrempid) {
        const assignedData = await EmployeeManagementModel.findOneAndUpdate(
          { managerId: mgrempid },
          { $addToSet: { reporteeIds: newEmployee._id } },
          { new: true }
        );
        newEmployee.mgrempid = assignedData._id;
      }

      await newEmployee.save();
      console.log("newEmployee========", newEmployee);
      results.push(newEmployee);
      emailList.push(newEmployee.email); // Collect email addresses

      // Verification token creation logic
      const userWithoutPassword = {
        _id: newEmployee._id,
        first_name: newEmployee.first_name,
        last_name: newEmployee.last_name,
        email: newEmployee.email,
      };

      // Create a verification token
      const token = jwt.sign(userWithoutPassword, process.env.jWT_SECRETE, {
        expiresIn: "10m",
      });

      console.log("TOKEN===", token);

      // Construct email verification URL
      const verificationUrl = `${process.env.BASE_URL}/verify/${token}`;
      verificationLinks.push({
        email: newEmployee.email,
        name: newEmployee.first_name,
        verificationUrl,
      });
    });

    await Promise.all(employeePromises);

    // Send individual verification emails to each employee
    await Promise.all(
      verificationLinks.map(async ({ email, name, verificationUrl }) => {
        const emailContent = `
        <h2>Email Verification for Your Account</h2>
        <p>Dear ${name},</p>
        <p>We have received requests to verify the email address associated with your account on AEIGS software. Please click on the following link to complete the verification process:</p>
        <p><a href="${verificationUrl}" style="text-decoration: none; background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px;">Verify Email</a></p>
        <p>If you did not initiate this request, please ignore this email. Your account security is important to us.</p>
        <p>Thank you for choosing AEIGS software.</p>
        <p><strong>Best regards,</strong></p>
        <p>AEIGS software Team</p>
        <p>Email: <a href="mailto:support@aegishrms.com">support@aegishrms.com</a></p>
        <p>Phone: 9082462161</p>
        <p>Address: 603, Haware grand heritage, Kaspate Wasti, Wakad, Pune, Maharashtra 411057</p>
      `;

        // Send the email to each employee
        await sendEmail(email, "Email Verification", emailContent);
      })
    );

    res.status(201).send({
      message: `${results.length} Emails have been sent to the respective accounts. Please verify your email address.`,
      successes: results,
      errors: errorMessages,
    });
  } catch (error) {
    console.error("Error in addEmployee:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// send email using bcc
//  exports.addEmployeeExcel = catchAssyncError(async (req, res, next) => {
//    try {
//     const employeesData = req.body; // Expecting an array of employee objects
//     console.log("employeesData", employeesData);

//     const results = [];
//     const errorMessages = [];
//     const emailList = []; // Array to hold all employee emails
//     const verificationLinks = []; // Array to hold all verification links

//     // Check organization limit
//     const { organizationId } = employeesData[0];
//     console.log("organizationId====", organizationId);

//     const empLimit = await OrganisationModel.findById(organizationId);
//     const empCountInOrg = await EmployeeModel.countDocuments({
//       organizationId,
//     });

//     if (empCountInOrg >= empLimit.memberCount) {
//       return res.status(400).json({
//         message: "You have exceeded employee onboarding limit.",
//         status: false,
//       });
//     }

//     const employeePromises = employeesData.map(async (employeeData) => {
//       const {
//         first_name,
//         last_name,
//         email,
//         password,
//         companyemail,
//         address,
//         adhar_card_number,
//         pan_card_number,
//         dept_cost_center_no,
//         shift_allocation,
//         bank_account_no,
//         phone_number,
//         deptname,
//         citizenship,
//         employmentType,
//         date_of_birth,
//         joining_date,
//         designation,
//         profile,
//         empId,
//         salarystructure,
//         worklocation,
//         gender,
//         pwd,
//         uanNo,
//         esicNo,
//         mgrempid,
//         ...dynamicFields
//       } = employeeData;

//       // Check for existing employee by email
//       let existingEmployee = await EmployeeModel.findOne({ email });
//       if (existingEmployee) {
//         errorMessages.push(`Email ${email} already registered.`);
//         return;
//       }

//       // Check for existing employee code
//       const isEmpCodeExist = await EmployeeModel.findOne({
//         empId,
//         organizationId,
//       });
//       if (isEmpCodeExist) {
//         errorMessages.push(
//           `Employee code ${empId} already exists for this organization.`
//         );
//         return;
//       }

//       const filteredFields = Object.fromEntries(
//         Object.entries(dynamicFields).filter(([_, value]) => value !== "")
//       );

//       let newEmployee = new EmployeeModel({
//         first_name,
//         last_name,
//         email,
//         password, // Make sure to hash this before saving
//         companyemail,
//         address,
//         adhar_card_number,
//         pan_card_number,
//         dept_cost_center_no,
//         shift_allocation: shift_allocation ? shift_allocation : null,
//         bank_account_no,
//         phone_number,
//         deptname: deptname || null,
//         citizenship,
//         employmentType,
//         date_of_birth,
//         joining_date,
//         designation: designation || null,
//         worklocation,
//         gender,
//         profile: profile ? [...profile, "Employee"] : ["Employee"],
//         empId,
//         salarystructure,
//         organizationId,
//         creatorId: req.user.id, // Assuming creatorId is from the authenticated user
//         additionalInfo: filteredFields,
//       });

//       // Handle manager logic
//       if (newEmployee.profile.includes("Manager")) {
//         await EmployeeManagementModel.create({
//           managerId: newEmployee._id,
//           organizationId,
//         });
//       }

//       if (mgrempid) {
//         const assignedData = await EmployeeManagementModel.findOneAndUpdate(
//           { managerId: mgrempid },
//           { $addToSet: { reporteeIds: newEmployee._id } },
//           { new: true }
//         );
//         newEmployee.mgrempid = assignedData._id;
//       }

//       await newEmployee.save();
//       console.log("newEmployee========", newEmployee);
//       results.push(newEmployee);
//       emailList.push(newEmployee.email); // Collect email addresses

//       // Verification token creation logic
//       const userWithoutPassword = {
//         _id: newEmployee._id,
//         first_name: newEmployee.first_name,
//         last_name: newEmployee.last_name,
//         email: newEmployee.email,
//       };

//       // Create a verification token
//       const token = jwt.sign(userWithoutPassword, process.env.jWT_SECRETE, {
//         expiresIn: "5m",
//       });

//       console.log("TOKEN===", token);

//       // Construct email verification URL
//       const verificationUrl = `${process.env.BASE_URL}/verify/${token}`;
//       verificationLinks.push({ email: newEmployee.email, name: newEmployee.first_name, verificationUrl });
//     });

//     await Promise.all(employeePromises);

//     // Send emails with BCC
//     const bccEmails = verificationLinks.map(link => link.email).join(", ");
//     await Promise.all(verificationLinks.map(async ({ email, name, verificationUrl }) => {
//       const emailContent = `
//         <h2>Email Verification for Your Account</h2>
//         <p>Dear ${name},</p>
//         <p>Please verify your email using the following link:</p>
//         <p><a href="${verificationUrl}">Verify Email</a></p>
//       `;
//       // Send individual email
//       await sendEmail(email, "Email Verification", emailContent, { bcc: bccEmails });
//     }));

//     res.status(201).send({
//       message: `${results.length} Emails have been sent to the respective accounts. Please verify your email address.`,
//       successes: results,
//       errors: errorMessages,
//     });
//   } catch (error) {
//     console.error("Error in addEmployee:", error);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// });

// exports.addEmployeeExcel = catchAssyncError(async (req, res, next) => {
//   try {
//     const employeesData = req.body; // Expecting an array of employee objects
//     console.log("employeesData", employeesData);

//     const results = [];
//     const errorMessages = [];

//     // Check organization limit
//     const { organizationId } = employeesData[0];
//     console.log("organizationId====", organizationId);

//     const empLimit = await OrganisationModel.findById(organizationId);
//     const empCountInOrg = await EmployeeModel.countDocuments({
//       organizationId,
//     });

//     if (empCountInOrg >= empLimit.memberCount) {
//       return res.status(400).json({
//         message: "You have exceeded employee onboarding limit.",
//         status: false,
//       });
//     }

//     const employeePromises = employeesData.map(async (employeeData) => {
//       const {
//         first_name,
//         last_name,
//         email,
//         password,
//         companyemail,
//         address,
//         adhar_card_number,
//         pan_card_number,
//         dept_cost_center_no,
//         shift_allocation,
//         bank_account_no,
//         phone_number,
//         deptname,
//         citizenship,
//         employmentType,
//         date_of_birth,
//         joining_date,
//         designation,
//         profile,
//         empId,
//         salarystructure,
//         worklocation,
//         gender,
//         pwd,
//         uanNo,
//         esicNo,
//         mgrempid,
//         ...dynamicFields
//       } = employeeData;

//       // Check for existing employee by email
//       let existingEmployee = await EmployeeModel.findOne({ email });
//       if (existingEmployee) {
//         errorMessages.push(`Email ${email} already registered.`);
//         return;
//       }

//       // Check for existing employee code
//       const isEmpCodeExist = await EmployeeModel.findOne({
//         empId,
//         organizationId,
//       });
//       if (isEmpCodeExist) {
//         errorMessages.push(
//           `Employee code ${empId} already exists for this organization.`
//         );
//         return;
//       }

//       const filteredFields = Object.fromEntries(
//         Object.entries(dynamicFields).filter(([_, value]) => value !== "")
//       );

//       let newEmployee = new EmployeeModel({
//         first_name,
//         last_name,
//         email,
//         password, // Make sure to hash this before saving
//         companyemail,
//         address,
//         adhar_card_number,
//         pan_card_number,
//         dept_cost_center_no,
//         shift_allocation: shift_allocation ? shift_allocation : null,
//         bank_account_no,
//         phone_number,
//         deptname: deptname || null,
//         citizenship,
//         employmentType,
//         date_of_birth,
//         joining_date,
//         designation: designation || null,
//         worklocation,
//         gender,
//         profile: profile ? [...profile, "Employee"] : ["Employee"],
//         empId,
//         salarystructure,
//         organizationId,
//         creatorId: req.user.id, // Assuming creatorId is from the authenticated user
//         additionalInfo: filteredFields,
//       });

//       // Handle manager logic
//       if (newEmployee.profile.includes("Manager")) {
//         await EmployeeManagementModel.create({
//           managerId: newEmployee._id,
//           organizationId,
//         });
//       }

//       if (mgrempid) {
//         const assignedData = await EmployeeManagementModel.findOneAndUpdate(
//           { managerId: mgrempid },
//           { $addToSet: { reporteeIds: newEmployee._id } },
//           { new: true }
//         );
//         newEmployee.mgrempid = assignedData._id;
//       }

//       await newEmployee.save();
//       console.log("newEmployee========", newEmployee);
//       results.push(newEmployee);

//       // Verification token creation and email sending logic
//       const userWithoutPassword = {
//         _id: newEmployee._id,
//         first_name: newEmployee.first_name,
//         last_name: newEmployee.last_name,
//         email: newEmployee.email,
//       };

//       // Create a verification token
//       const token = jwt.sign(userWithoutPassword, process.env.jWT_SECRETE, {
//         expiresIn: "5m",
//       });

//       console.log("TOKEN===", token);

//       // Construct email verification URLs
//       const verificationUrl = `${process.env.BASE_URL}/verify/${token}`;
//       const emailContent = `
//         <h2>Email Verification for Your Account</h2>
//         <p>Dear ${newEmployee.first_name} ${newEmployee.last_name},</p>
//         <p>We have received a request to verify your email address associated with your account on AEIGS software. Please click on the following link to complete the verification process:</p>
//         <a href="${verificationUrl}" style="text-decoration: none; background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px;">Email Verification Link</a>
//         <p>If you did not initiate this request, please ignore this email. Your account security is important to us.</p>
//         <p>Thank you for choosing AEIGS software.</p>
//         <p><strong>Best regards,</strong></p>
//         <p>AEIGS software Team</p>
//         <p>Email: <a href="mailto:support@aegishrms.com">support@aegishrms.com</a></p>
//         <p>Phone: 9082462161</p>
//         <p>Address: 603, Haware grand heritage, Kaspate Wasti, Wakad, Pune, Maharashtra 411057</p>
//       `;

//       // Send the verification email

//       await sendEmail(
//         newEmployee.email,
//         "Email Verification",
//         emailContent,
//         newEmployee,
//         token
//       );
//     });

//     await Promise.all(employeePromises);

//     res.status(201).send({
//       message: `${results.length} employees processed successfully.`,
//       successes: results,
//       errors: errorMessages,
//     });
//   } catch (error) {
//     console.error("Error in addEmployee:", error);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// });

exports.updateEmployee = catchAssyncError(async (req, res, next) => {
  try {
    const { id, organizationId } = req.params;
    const {
      first_name,
      last_name,
      email,
      gender,
      phone_number,
      location,
      companyemail,
      address,
      citizenship,
      adhar_card_number,
      pan_card_number,
      dept_cost_center_no,
      shift_allocation,
      date_of_birth,
      joining_date,
      bank_account_no,
      profile,
      creatorId,
      worklocation,
      designation,
      deptname,
      salarystructure,
      employmentType,
      mgrempid,
      pwd,
      uanNo,
      esicNo,
      empId,
      ...filteredData
    } = req.body;

    console.log("req.boyd", req.body);

    // Check if the email is already registered with another employee
    const existingEmployeeEmail = await EmployeeModel.findOne({
      email,
      organizationId, // Ensure the check is within the same organization
      _id: { $ne: id }, // Exclude the current employee being edited
    });

    if (existingEmployeeEmail) {
      return res
        .status(400)
        .json({ message: "Email already registered by another employee." });
    }

    const filteredProfile = profile.filter((role) => role);
    if (!filteredProfile.includes("Employee")) {
      filteredProfile.push("Employee");
    }

    const additionalInfo = Object.fromEntries(
      Object.entries(filteredData).filter(([_, value]) => value !== "")
    );
    const updateFields = {
      first_name,
      last_name,
      email,
      phone_number,
      location,
      companyemail,
      address,
      adhar_card_number,
      pan_card_number,
      dept_cost_center_no,
      shift_allocation,
      citizenship,
      date_of_birth,
      joining_date,
      bank_account_no,
      profile: filteredProfile,
      creatorId,
      worklocation,
      designation,
      deptname,
      pwd,
      uanNo,
      esicNo,
      gender,
      salarystructure,
      employmentType,
      mgrempid: mgrempid || null,
      empId,
      additionalInfo: additionalInfo || {},
    };
    console.log("update field", updateFields);
    let isManagerAssign, isManager;
    if (id) {
      isManagerAssign = await EmployeeManagementModel.findOne({
        reporteeIds: id,
      });

      isManager = await EmployeeManagementModel.findOne({
        managerId: id,
      });
    }

    if (!profile.includes("Manager")) {
      await EmployeeManagementModel.deleteMany({
        managerId: id,
      });

      await EmployeeModel.updateMany(
        {
          mgrempid: id,
        },
        {
          mgrempid: null,
        },
        {
          new: true,
        }
      );
    }

    // TODO @required
    if (!isManager) {
      if (profile.includes("Manager")) {
        console.log("includes condition this condition runs");
        await EmployeeManagementModel.create({
          managerId: id,
          organizationId,
        });
      }
    }

    if (isManagerAssign?._id !== mgrempid && isManagerAssign) {
      await EmployeeManagementModel.findByIdAndUpdate(
        isManagerAssign._id,
        {
          $pull: { reporteeIds: id },
        },
        {
          new: true,
        }
      );
    }

    if (mgrempid) {
      await EmployeeManagementModel.findByIdAndUpdate(
        mgrempid,
        {
          $addToSet: { reporteeIds: id },
        },
        {
          new: true,
        }
      );
    } else {
      await EmployeeManagementModel.findByIdAndUpdate(
        mgrempid,
        {
          $pull: { reporteeIds: id },
        },
        {
          new: true,
        }
      );
    }

    const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
      id,
      updateFields,
      {
        new: true,
      }
    );

    return res.status(200).json({
      message: "Employee updated successfully",
      success: true,
      updatedEmployee,
    });
  } catch (err) {
    console.log(`🚀 ~ file: employeeController.js:861 ~ err:`, err);
    return res.status(500).json({ message: err.message, success: false });
  }
});

exports.uploadImage = catchAssyncError(async (req, res, next) => {
  try {
    const url = await generateSignedUrl();

    res.status(200).json({ url });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});
//
exports.addUserProfileData = catchAssyncError(async (req, res, next) => {
  try {
    const { additional_phone_number, status_message, chat_id, user_logo_url } =
      req.body;

    const employeeId = req.params.employeeId;

    const employee = await EmployeeModel.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // Update the employee's additional details if they exist in the request body
    employee.additional_phone_number =
      additional_phone_number !== undefined
        ? additional_phone_number
        : employee.additional_phone_number;
    employee.status_message =
      status_message !== undefined ? status_message : employee.status_message;
    employee.chat_id = chat_id !== undefined ? chat_id : employee.chat_id;
    employee.user_logo_url =
      user_logo_url !== undefined ? user_logo_url : employee.user_logo_url;

    const updatedEmployee = await employee.save();

    res.status(200).json({
      message: "Employee details added successfully.",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("Error adding employee details:", error);
    res
      .status(500)
      .json({ message: "Failed to add employee details. Please try again." });
  }
});

// Delete the profile photo
exports.deleteProfilePhoto = catchAssyncError(async (req, res, next) => {
  try {
    const employeeId = req.params.employeeId;

    const employee = await EmployeeModel.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }
    employee.user_logo_url = null; // Clear the URL field
    await employee.save();

    res.status(200).json({ message: "Profile photo deleted successfully." });
  } catch (error) {
    console.error("Error deleting profile photo:", error);
    res.status(500).json({ message: error.message });
  }
});

exports.getManagerDetails = catchAssyncError(async (req, res, next) => {
  try {
    // Get additional details about the manager from EmployeeManagementModel or any other related models
    const managerDetails = await EmployeeManagementModel.find({
      organizationId: req.params.organizationId, // Get organizationId from route parameters
    }).populate("managerId");

    return res.status(200).json({ manager: managerDetails });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

exports.getAllManagers = catchAssyncError(async (req, res, next) => {
  try {
    const manager = await EmployeeManagementModel.find({
      organizationId: req.params.organizationId,
      managerId: { $ne: req.params.employeeId },
    }).populate("managerId");

    return res.status(200).json({ manager: manager });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

exports.getAllManagersForOnboarding = catchAssyncError(
  async (req, res, next) => {
    try {
      const manager = await EmployeeModel.find({
        organizationId: req.params.organizationId,
        profile: "Manager",
      });

      return res.status(200).json({ manager: manager });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  }
);

// get employee under manager
exports.getEmployeeUnderManaer = catchAssyncError(async (req, res, next) => {
  const { managerId, organizationId } = req.params;
  try {
    const manager = await EmployeeManagementModel.findOne({
      managerId,
      organizationId,
    }).populate("reporteeIds");

    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    // Extract the reporteeIds from the manager document
    const reporteeIds = manager.reporteeIds.map((reportee) => reportee._id);

    // Populate the 'deptname' field directly on the EmployeeModel.find() query
    const reportees = await EmployeeModel.find({
      _id: { $in: reporteeIds },
    })
      .populate("deptname")
      .populate("worklocation");

    return res.status(200).json({ reportees });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

exports.addSalaryData = catchAssyncError(async (req, res, next) => {
  try {
    const { income, deductions, totalSalary } = req.body;
    const { employeeId } = req.params;

    const updatedSalaryComponent = await SalaryComponentModel.findOneAndUpdate(
      { EmployeeId: employeeId },
      {
        $set: {
          income,
          deductions,
          totalSalary,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );
    res.status(200).json({
      success: true,
      message: "Salary data added/updated successfully.",
      data: updatedSalaryComponent,
    });
  } catch (error) {
    console.error("Error adding employee details:", error);
    res
      .status(500)
      .json({ message: "Failed to add employee details. Please try again." });
  }
});
exports.getSalaryData = catchAssyncError(async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const getSalaryComponent = await SalaryComponentModel.findOne({
      EmployeeId: employeeId,
    });

    res.status(200).json({
      success: true,
      message: "Salary data fetched successfully.",
      data: getSalaryComponent,
    });
  } catch (error) {
    console.error("Error fetching salary details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get salary component. Please try again.",
    });
  }
});

exports.getTotalSalary = catchAssyncError(async (req, res, next) => {
  try {
    const employeeId = req.user.user._id;
    const getSalaryComponent = await SalaryComponentModel.findOne({
      EmployeeId: employeeId,
    });
    const totalSalary = getSalaryComponent.totalSalary;

    res.status(200).json({ totalSalary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete the employee

exports.deleteEmployee = catchAssyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const isIdExists = await EmployeeModel.find({
      _id: id,
    });

    if (!isIdExists)
      return res.status(400).json({ message: "Invalid ID", success: false });

    const deleteEmployee = await EmployeeModel.findByIdAndDelete({
      _id: id,
    });

    await EmployeeManagementModel.findOneAndDelete({
      managerId: id,
    });

    await EmployeeManagementModel.updateOne(
      {
        reporteeIds: { $in: [id] },
      },
      { $pull: { reporteeIds: id } }
    );
    return res.status(200).json({
      message: "Employee deleted successfully.",
      success: true,
    });
  } catch (err) {
    console.error(err);
  }
});

exports.deleteMultipleEmployees = catchAssyncError(async (req, res, next) => {
  try {
    const { ids } = req.body; // Array of employee IDs to d   elete

    // Validate if IDs array is empty or not provided
    if (!ids || ids.length === 0) {
      return res.status(400).json({
        message: "No employee IDs provided for deletion",
        success: false,
      });
    }

    // Check if any of the provided IDs is invalid or not found in the database
    const invalidIds = [];
    for (const id of ids) {
      const isIdExists = await EmployeeModel.findById(id);
      if (!isIdExists) {
        invalidIds.push(id);
      }
    }

    if (invalidIds.length > 0) {
      return res.status(400).json({
        message: "Invalid employee IDs",
        invalidIds,
        success: false,
      });
    }

    // Perform bulk deletion of employees
    const deleteEmployees = await EmployeeModel.deleteMany({
      _id: { $in: ids },
    });

    return res.status(200).json({
      message: "Employees deleted successfully.",
      success: true,
      deletedCount: deleteEmployees.deletedCount,
    });
  } catch (err) {}
});

// fetch employee
exports.getPaginatedEmployees = catchAssyncError(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const perPage = 10;
  const skip = (page - 1) * perPage;
  const organizationId = req.params.organizationId;

  // Extract search queries
  const { nameSearch, deptSearch, locationSearch } = req.query;

  // Create a base filter object for querying
  let filter = { organizationId };

  // Apply search filters if they are provided
  if (nameSearch && nameSearch.trim()) {
    filter.first_name = { $regex: nameSearch.trim(), $options: "i" };
  }

  if (deptSearch && deptSearch.trim()) {
    filter["deptname.departmentName"] = {
      $regex: deptSearch.trim(),
      $options: "i",
    };
  }

  if (locationSearch && locationSearch.trim()) {
    filter["worklocation.city"] = {
      $regex: locationSearch.trim(),
      $options: "i",
    };
  }

  try {
    // Query the database with the filter and populate relevant fields
    let employeesData = await EmployeeModel.find(filter)
      .populate({
        path: "worklocation",
        match:
          locationSearch && locationSearch.trim()
            ? { city: { $regex: locationSearch.trim(), $options: "i" } }
            : {},
      })
      .populate({
        path: "deptname",
        match:
          deptSearch && deptSearch.trim()
            ? { departmentName: { $regex: deptSearch.trim(), $options: "i" } }
            : {},
      })
      .populate("designation")
      .populate("salarystructure");

    // Count total employees after search filters
    const totalEmployees = employeesData.length;

    // Apply pagination AFTER filtering the results
    employeesData = employeesData.slice(skip, skip + perPage);

    // Send the response with the employees data and pagination details
    res.status(200).json({
      employees: employeesData,
      totalEmployees,
      currentPage: page,
      totalPages: Math.ceil(totalEmployees / perPage),
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: error.message });
  }
});

// exports.getPaginatedEmployees = catchAssyncError(async (req, res, next) => {
//   const page = parseInt(req.query.page) || 1;
//   const perPage = 10;
//   const skip = (page - 1) * perPage;
//   const organizationId = req.params.organizationId;

//   // Extract search queries
//   const { nameSearch, deptSearch, locationSearch } = req.query;

//   // Create a base filter object for querying
//   let filter = { organizationId };

//   // Apply search filters if they are provided (non-empty, non-null, non-undefined)
//   if (nameSearch && nameSearch.trim()) {
//     filter.first_name = { $regex: nameSearch.trim(), $options: "i" };
//   }

//   if (deptSearch && deptSearch.trim()) {
//     filter["deptname.departmentName"] = {
//       $regex: deptSearch.trim(),
//       $options: "i",
//     };
//   }

//   if (locationSearch && locationSearch.trim()) {
//     filter["worklocation.city"] = {
//       $regex: locationSearch.trim(),
//       $options: "i",
//     };
//   }

//   try {
//     // Query the database with the filter and populate relevant fields
//     const employeesData = await EmployeeModel.find(filter)
//       .populate({
//         path: "worklocation",
//         match:
//           locationSearch && locationSearch.trim()
//             ? { city: { $regex: locationSearch.trim(), $options: "i" } }
//             : {},
//       })
//       .populate({
//         path: "deptname",
//         match:
//           deptSearch && deptSearch.trim()
//             ? { departmentName: { $regex: deptSearch.trim(), $options: "i" } }
//             : {},
//       })
//       .populate("designation")
//       .populate("salarystructure")
//       .skip(skip)
//       .limit(perPage);

//     // Count total employees based on the same filter
//     const totalEmployees = await EmployeeModel.countDocuments(filter);

//     // Send the response with the employees data and pagination details
//     res.status(200).json({
//       employees: employeesData,
//       totalEmployees,
//       currentPage: page,
//       totalPages: Math.ceil(totalEmployees / perPage),
//     });
//   } catch (error) {
//     // Log and respond with error if something goes wrong
//     console.error("Error fetching employees:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

exports.getUserProfileData = catchAssyncError(async (req, res, next) => {
  try {
    const employeeId = req.params.employeeId;
    const employee = await EmployeeModel.findById(employeeId)
      .populate("worklocation") // Populating worklocation field
      .populate("designation") // Populating designation field
      .populate("salarystructure")
      .populate("organizationId")
      .populate("deptname")
      .populate("employmentType");
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    res.status(200).json({ employee });
  } catch (error) {
    console.error("Error fetching employee details:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch employee details. Please try again." });
  }
});
exports.getDeptHeadUserData = catchAssyncError(async (req, res, next) => {
  try {
    const organizationId = req.params.organizationId;
    const employees = await EmployeeModel.find({
      organizationId: organizationId,
      profile: { $in: ["Department-Head"] },
    });

    if (!employees || employees.length === 0) {
      return res
        .status(404)
        .json({ message: "No employees found with the required roles." });
    }

    res.status(200).json({ employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch employee details. Please try again." });
  }
});
exports.getDeptDelegateHeadData = catchAssyncError(async (req, res, next) => {
  try {
    const organizationId = req.params.organizationId;

    // Assuming 'profile' is an array field in the EmployeeModel
    const employees = await EmployeeModel.find({
      organizationId: organizationId,
      profile: { $in: ["Delegate-Department-Head"] },
    });

    if (!employees || employees.length === 0) {
      return res
        .status(404)
        .json({ message: "No employees found with the required roles." });
    }

    res.status(200).json({ employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch employee details. Please try again." });
  }
});
exports.getHr = catchAssyncError(async (req, res, next) => {
  try {
    const organizationId = req.params.organizationId;
    const employees = await EmployeeModel.find({
      organizationId: organizationId,
      profile: { $in: ["HR"] },
    });

    if (!employees || employees.length === 0) {
      return res
        .status(404)
        .json({ message: "No employees found with the required roles." });
    }
    res.status(200).json({ employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch employee details. Please try again." });
  }
});
exports.getEmployee = catchAssyncError(async (req, res, next) => {
  const organizationId = req.params.organizationId;
  try {
    const employees = await EmployeeModel.find({ organizationId })
      .populate("worklocation")
      .populate("designation")
      .populate("salarystructure")
      .populate("deptname");

    // Count total number of employees in the specific organization
    const totalEmployees = await EmployeeModel.countDocuments({
      organizationId,
    });

    res.status(200).json({
      employees,
      totalEmployees,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch employees", error: error.message });
  }
});
exports.getEmployeeDateBasedOrgId = catchAssyncError(async (req, res, next) => {
  try {
    const organizationId = req.params.organizationId;
    const employees = await EmployeeModel.find({
      organizationId: organizationId,
    });
    res.status(200).json({ employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch employee details. Please try again." });
  }
});

// employee counta api
exports.employeeCountManager = catchAssyncError(async (req, res, next) => {
  try {
    const userId = mongoose.Types.ObjectId(req.user.user._id);

    if (!userId) {
      return res.json({ message: "Manager not found", success: false });
    }
    const data = await EmployeeManagementModel.find({
      managerId: userId,
    }).populate("reporteeIds");
    return res.json({ data });
  } catch (error) {}
});

// employee counta api
exports.createDelegate = catchAssyncError(async (req, res, next) => {
  try {
    let {
      first_name,
      middle_name,
      last_name,
      phone_number,
      joining_date,
      citizenship,
      email,
      password,
      gender,
      date_of_birth,
      profile,
      _id,
      empId,
    } = req.body;
    console.log(`🚀 ~ file: employeeController.js:1390 ~ _id:`, _id);

    const creatorId = req.user.user._id;

    if (
      !first_name ||
      !last_name ||
      !phone_number ||
      !joining_date ||
      !citizenship ||
      !email ||
      !password ||
      !gender ||
      !date_of_birth ||
      !profile ||
      !empId
    ) {
      return res
        .status(403)
        .json({ message: "Please provide all required field", success: false });
    }
    // search for unique employee code
    const isEmpIdExists = await EmployeeModel.findOne({
      empId,
      _id: { $ne: _id },
    });
    if (isEmpIdExists) {
      return res.status(400).json({ message: "Employee code already exists" });
    }

    if (_id !== undefined) {
      password = await bcrypt.hash(password, 10);
      await EmployeeModel.findByIdAndUpdate(
        _id,
        {
          $set: {
            first_name,
            last_name,
            middle_name,
            phone_number,
            joining_date,
            citizenship,
            email,
            password,
            gender,
            date_of_birth,
            creatorId,
            empId,
          },
        },
        { new: true }
      );

      await OrganizationRelationModel.findOneAndUpdate(
        { employeeId: _id },
        { $addToSet: { employeeId: _id } }
      );
      return res
        .status(201)
        .json({ message: "Delegate Super Admin updated successfully" });
    } else {
      let newUser = new EmployeeModel({
        first_name,
        last_name,
        middle_name,
        phone_number,
        joining_date,
        citizenship,
        email,
        password,
        gender,
        date_of_birth,
        profile,
        creatorId,
        empId,
      });
      const userWithoutPassword = {
        _id: newUser._id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        middle_name: newUser.middle_name,
        email: newUser.email,
      };

      // Save the user to the database
      await newUser.save();

      // Create a verification token
      const token = jwt.sign(userWithoutPassword, process.env.jWT_SECRETE, {
        expiresIn: "5m",
      });

      // Construct email verification URLs
      const verificationUrl = `${process.env.BASE_URL}/verify/${token}`;

      // Email content with inline styles for formatting
      const emailContent = `
          <h2>Email Verification for Your Account</h2>
          <p>Dear ${newUser.first_name} ${newUser.last_name},</p>
          <p>We have received a request to verify your email address associated with your account on AEIGS software. Please click on the following link to complete the verification process:</p>
          <a href="${verificationUrl}" style="text-decoration: none; background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px;">Email Verification Link</a>
          <p>If you did not initiate this request, please ignore this email. Your account security is important to us.</p>
          <p>Thank you for choosing AEIGS software.</p>
          <p><strong>Best regards,</strong></p>
          <p>AEIGS software Team</p>
          <p>Email: <a href="mailto:arganitservices@gmail.com">arganitservices@gmail.com</a></p>
          <p>Phone: 9082462161</p>
          <p>Address: 603, Haware grand heritage, Kaspate Wasti, Wakad, Pune, Maharashtra 411057</p>
    `;

      // Send the verification email
      await sendEmail(
        newUser.email,
        "Email Verification",
        emailContent,
        newUser,
        token
      );
      res.status(201).json({ message: "Delegate super admin created" });
    }
  } catch (error) {
    console.error(`🚀 ~ file: employeeController.js:1065 ~ error:`, error);
    if (error.code === 11000 && error.keyValue.email) {
      return res.status(400).json({ message: "Email already exists" });
    }
    return res.status(404).json({ message: "Something went wrong", error });
  }
});

exports.deleteDelegate = catchAssyncError(async (req, res, next) => {
  try {
    const { employeeId } = req.query;
    const isIdExists = await EmployeeModel.find({
      _id: employeeId,
    });

    if (!isIdExists)
      return res.status(400).json({ message: "Invalid ID", success: false });

    await EmployeeModel.findByIdAndDelete({
      _id: employeeId,
    });

    // remove delegate super admin from relation
    await OrganizationRelationModel.findOneAndUpdate(
      { employeeId: employeeId },
      { $pull: { employeeId: employeeId } }
    );
    return res.status(200).json({
      message: "Delegate Super Admin deleted successfully.",
      success: true,
    });
  } catch (err) {
    console.error(err);
  }
});

exports.getDelegateSuperAdmin = catchAssyncError(async (req, res, next) => {
  const employeeId = req.user.user._id;
  let relation = await OrganizationRelationModel.findOne({
    employeeId,
  });
  const set = new Set(relation.employeeId.map((item) => item._id.toString()));
  console.log(
    `🚀 ~ file: employeeController.js:1483 ~ relation.employeeId.length:`,
    relation.employeeId.length
  );
  console.log(
    `🚀 ~ file: employeeController.js:1483 ~ Array.from(set).length:`,
    Array.from(set).length
  );
  if (Array.from(set).length !== relation.employeeId.length) {
    relation = await OrganizationRelationModel.findByIdAndUpdate(
      relation._id,
      {
        $set: {
          employeeId: Array.from(set),
        },
      },
      { new: true }
    ).populate("employeeId");
  }
  await relation.populate("employeeId");

  let delegateSuperAdmin = relation.employeeId.filter((doc) => {
    return doc._id.toString() !== employeeId.toString();
  });

  console.log("deletegate super admin", delegateSuperAdmin.length);

  if (delegateSuperAdmin.length < 1) {
    return res.status(404).json({ message: "Delegate super admin not found" });
  }
  delegateSuperAdmin[0].password = undefined;
  console.log(
    `🚀 ~ file: employeeController.js:1511 ~ delegateSuperAdmin:`,
    delegateSuperAdmin[0]
  );

  res.status(201).json({
    delegateSuperAdmin: delegateSuperAdmin[0],
    message: "Delegate super admin fetched successfully",
  });
});

exports.populateEmp = catchAssyncError(async (req, res, next) => {
  try {
    const emp = await EmployeeModel.findById({ _id: req.user.user._id });
    res.status(200).json({ emp });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

exports.getAllOrganizationEmployee = catchAssyncError(
  async (req, res, next) => {
    try {
      // const currentEmployeeId = req.user.user._id;

      const { organizationId, trainingId } = req.params;
      const employees = await EmployeeModel.find({ organizationId });
      const adminAndSuperAdmin = await OrganizationRelationModel.findOne({
        organizationId,
      }).populate("employeeId");

      let training = await trainingEmployeeModel
        .find({ trainingId })
        .populate("employeeId");

      let allEmployee = employees.concat(adminAndSuperAdmin?.employeeId);
      // allEmployee = allEmployee;
      training = training.map((doc) => {
        return {
          label: doc.employeeId.first_name + " " + doc.employeeId.last_name,
          value: doc.employeeId._id,
        };
      });
      allEmployee = allEmployee.map((doc) => {
        return {
          label: doc.first_name + " " + doc.last_name,
          value: doc._id,
        };
      });

      const set1 = new Set(allEmployee.map((item) => JSON.stringify(item)));
      const set2 = new Set(training.map((item) => JSON.stringify(item)));

      let difference = new Set([...set1].filter((x) => !set2.has(x)));

      // convert difference to array
      difference = Array.from(difference, (x) => JSON.parse(x));

      res.status(200).json({
        allEmployee: difference,
        success: true,
      });
    } catch (error) {
      console.log(`🚀 ~ file: employeeController.js:1487 ~ error:`, error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

exports.getOrgEmployeeWithFilter = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const { firstName, email, page, circleId } = req.query;

    let filter = {
      organizationId,
    };
    if (firstName && firstName !== "" && firstName !== "undefined") {
      filter.first_name = { $regex: firstName, $options: "i" };
    }
    if (email && email !== "" && email !== "undefined") {
      filter.email = { $regex: email, $options: "i" };
    }

    const employees = await EmployeeModel.find(filter)
      .skip(Number(page) * 10)
      .limit(10);

    return res.status(200).json({
      employees,
      success: true,
      addedEmployee,
    });
  } catch (error) {
    console.log(`🚀 ~ file: employeeController.js:1487 ~ error:`, error);
    res.status(500).json({ success: false, message: error.message });
  }
});

exports.setOrgIdtoSA = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.body;

    if (!organizationId) {
      return res.json({ message: "organisation id not found", success: false });
    }
    const result = await EmployeeModel.findByIdAndUpdate(
      req.user.user._id,
      {
        $set: { organizationId },
      },
      { new: true }
    );

    const plainResult = {
      user: {
        first_name: result.first_name,
        last_name: result.last_name,
        _id: result._id,
        email: result.email,
        profile: result.profile,
        organizationId: result.organizationId,
        deptname: result.deptname,
        birthdate: result.date_of_birth,
      },
    };
    console.log(`🚀 ~ plainResult:`, plainResult);

    const token = jwt.sign(plainResult, process.env.jWT_SECRETE);

    return res
      .status(200)
      .cookie("token", token, {
        expires: new Date(
          Date.now() + process.env.COKKIE_EXPIRE * 24 * 60 * 1000
        ),
        httpOnly: true,
      })
      .json({ success: true, plainResult, token });
  } catch (error) {
    console.log(error);
  }
});

exports.getOrgTree = catchAssyncError(async (req, res, next) => {
  const { orgId } = req.params;
  // Find the organization and get the creatorId
  const organization = await OrganisationModel.findById(orgId);
  if (!organization) {
    return res.status(404).json({ message: "Organization not found" });
  }
  // Find the Super Admin in the EmployeeModel
  const sa = await EmployeeModel.findById(organization.creator).populate(
    "designation"
  );
  if (!sa) {
    return res.status(404).json({ message: "Super Admin not found" });
  }
  // Get all employees in the organization
  const allEmployees = await EmployeeModel.find({
    organizationId: orgId,
    profile: { $nin: ["Super-Admin"] },
  }).populate("designation");

  const relationshipModels = await EmployeeManagementModel.find({
    organizationId: orgId,
  })
    .populate({
      path: "managerId",
      match: { profile: { $nin: ["Super-Admin"] } },
      populate: {
        path: "designation",
      },
    })
    .populate({
      path: "reporteeIds",
      populate: {
        path: "designation",
      },
    });
  const idToNodeMap = new Map();
  const managedEmployees = new Set();
  // Initialize the Super Admin node
  let orgTree = {
    id: String(sa._id),
    title: `${sa.first_name} ${sa.last_name}`,
    desg: `Super Admin`,
    image: sa?.user_logo_url,
    children: [],
  };
  idToNodeMap.set(String(sa._id), orgTree);
  // Process each relationship model
  for (let model of relationshipModels) {
    const managerId = String(model?.managerId?._id);
    // Check if this manager has a manager
    const hasManager = relationshipModels?.some((rel) =>
      rel?.reporteeIds?.some((r) => r?._id?.equals(model?.managerId?._id))
    );
    let parentNode = orgTree;
    if (hasManager) {
      // If the manager has a manager, find their reporting manager and add them under that manager
      const parentModel = relationshipModels.find((rel) =>
        rel.reporteeIds.some((r) => r._id.equals(model.managerId._id))
      );
      const parentId = String(parentModel.managerId._id);
      parentNode = idToNodeMap.get(parentId);
    }
    // Check if the manager already exists in the tree, and if so, remove it
    if (idToNodeMap.has(managerId)) {
      const existingManagerNode = idToNodeMap.get(managerId);
      const parentChildren = parentNode.children;
      const indexToRemove = parentChildren.findIndex(
        (node) => node.id === managerId
      );
      if (indexToRemove !== -1) {
        parentChildren.splice(indexToRemove, 1);
      }
    }
    // Add the manager under the appropriate parent node
    const managerNode = {
      id: managerId,
      title: `${model.managerId.first_name} ${model.managerId.last_name}`,
      image: model.managerId?.user_logo_url,
      desg:
        model.managerId?.designation &&
        model.managerId?.designation[0]?.designationName,
      children: [],
    };
    parentNode?.children?.push(managerNode);
    idToNodeMap.set(managerId, managerNode);
    // Add reportees under their manager
    for (let reportee of model.reporteeIds) {
      const reporteeId = String(reportee._id);
      managedEmployees.add(reporteeId);
      const reporteeNode = {
        id: reporteeId,
        title: `${reportee.first_name} ${reportee.last_name}`,
        image: reportee?.user_logo_url,
        desg:
          reportee?.designation && reportee?.designation[0]?.designationName,
        children: [],
      };
      managerNode?.children?.push(reporteeNode);
      idToNodeMap.set(reporteeId, reporteeNode);
    }
  }
  // Add employees without managers directly under Super Admin
  for (let employee of allEmployees) {
    const employeeId = String(employee._id);
    // If the employee is neither a manager nor a reportee, add them directly under Super Admin
    if (!managedEmployees.has(employeeId)) {
      const employeeNode = {
        id: employeeId,
        title: `${employee.first_name} ${employee.last_name}`,
        image: employee?.user_logo_url,
        desg:
          employee?.designation && employee?.designation[0]?.designationName,
        children: [],
      };
      orgTree.children.push(employeeNode);
      idToNodeMap.set(employeeId, employeeNode);
    }
  }
  res.status(200).json(orgTree);
});

//  exports.getOrgTree = catchAssyncError(async (req, res, next) => {
//  const { orgId } = req.params;
//  // Find the organization and get the creatorId
//  const organization = await OrganisationModel.findById(orgId);
//  if (!organization) {
//  return res.status(404).json({ message: "Organization not found" });
//  }
//  // Find the Super Admin in the EmployeeModel
//  const sa = await EmployeeModel.findById(organization.creator).populate(
//  "designation"
//  );
//  if (!sa) {
//     return res.status(404).json({ message: "Super Admin not found" });
//   }

//   let orgTree = {
//     id: String(sa._id),
//     title: `${sa.first_name} ${sa.last_name}`,
//     desg: `Super Admin`,
//     image: sa?.user_logo_url,
//     children: [],
//   };

//   const idToNodeMap = new Map();
//   idToNodeMap.set(String(sa._id), orgTree);

//   const relationshipModels = await EmployeeManagementModel.find({
//     organizationId: orgId,
//   })
//     .populate({
//       path: "managerId",
//       populate: {
//         path: "designation",
//       },
//     })
//     .populate({
//       path: "reporteeIds",
//       populate: {
//         path: "designation",
//       },
//     });

//   relationshipModels.forEach((item) => {
//     if (item.managerId) {
//       orgTree.children.push({
//         id: item?.managerId._id,
//         title: `${item.managerId?.first_name} ${item.managerId?.last_name}`,
//         desg: "Manager",
//         children: item?.reporteeIds.map((rep) => ({
//           id: String(rep._id),
//           title: `${rep.first_name} ${rep.last_name}`,
//           desg: rep.profile.includes("Manager") ? "Manager" : "Emp",
//           image: rep?.user_logo_url,
//           children: [],
//         })),
//       });
//     }
//   });

//   return res.json(orgTree);
// });
