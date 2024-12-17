const catchAssyncError = require("../middleware/catchAssyncError");
// const { EmployeeModel } = require("../models/employeeSchema");
const bcrypt = require("bcryptjs");
const sendToken = require("../utils/sendToken");
const sendEmail = require("../utils/sendEmail");

const nodemailer = require("nodemailer");
const { Setuppagevendor} = require("../models/FoodAndCateringSchema/Setup_page_food_Schema");
const jwt = require("jsonwebtoken");
const { Otp } = require("../utils/Otp-Validation");
const { default: mongoose } = require("mongoose");
const { OrganisationModel } = require("../models/organizationSchema");
const { VendorModel } = require("../models/vendorSchema");


require("dotenv").config(); // Ensure environment variables are loaded


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
  
  exports.Vendorsetup = catchAssyncError(async (req, res, next) => {
    const { organizationId } = req.params;
    const formData = req.body;
  
    try {
      let setuppagevendor = await Setuppagevendor.findOne({ organizationId });
  
      // If letterType does not exist, create a new one
      if (!setuppagevendor) {
        setuppagevendor = new Setuppagevendor({
          organizationId,
        });
      }
  
      // Update or create each document type based on formData
      Object.entries(formData).forEach(([documentName, values]) => {
        setuppagevendor[documentName] = {
          workflow: values.workflow,
        };
      });
  
      setuppagevendor = await setuppagevendor.save();
  
      res.status(200).json({
        message: "Setup page  updated successfully.",
        doc: setuppagevendor,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  });


  // exports.Vendorsetup = catchAssyncError(async (req, res, next) => {
  //   const { organizationId } = req.params;
  //   const formData = req.body;
  
  //   try {
  //     // Find the existing setup or create a new one
  //     let setuppagevendor = await Setuppagevendor.findOne({ organizationId }) || new Setuppagevendor({ organizationId });
  
  //     // Destructure relevant properties from formData
  //     const {
  //       canVendorsUploadDocuments,
  //       menuPricesApprovedByHR,
  //       documentsNeedApproval,
  //       uploadableDocuments = {}
  //     } = formData;
  
  //     // Update properties based on formData
  //     setuppagevendor.canVendorsUploadDocuments = canVendorsUploadDocuments;
  //     setuppagevendor.menuPricesApprovedByHR = menuPricesApprovedByHR;
  //     setuppagevendor.documentsNeedApproval = documentsNeedApproval;
  
  //     // Update uploadableDocuments booleans, defaulting to false if not provided
  //     setuppagevendor.uploadableDocuments = {
  //       bankAccount: uploadableDocuments.bankAccount || false,
  //       foodCateringLicense: uploadableDocuments.foodCateringLicense || false,
  //       aadhar: uploadableDocuments.aadhar || false,
  //       pan: uploadableDocuments.pan || false,
  //     };
  
  //     // Save the updated document
  //     setuppagevendor = await setuppagevendor.save();
  
  //     // Send success response
  //     res.status(200).json({
  //       message: "Setup page updated successfully.",
  //       doc: setuppagevendor,
  //     });
  //   } catch (error) {
  //     console.error("Error updating setup page:", error); // Log error for debugging
  //     res.status(500).json({
  //       message: "An error occurred while updating the setup page.",
  //       error: error.message, // Optionally include the error message
  //     });
  //   }
  // });
  











  // exports.Vendorsetup = catchAssyncError(async (req, res, next) => {
  //   const { organizationId } = req.params;
  //   const formData = req.body;
  
  //   try {
  //     let setuppagevendor = await Setuppagevendor.findOne({ organizationId });
  
  //     // If setuppagevendor does not exist, create a new one
  //     if (!setuppagevendor) {
  //       setuppagevendor = new Setuppagevendor({
  //         organizationId,
  //       });
  //     }
  
  //     // Update properties based on formData
  //     setuppagevendor.canVendorsUploadDocuments = formData.canVendorsUploadDocuments;
  //     setuppagevendor.menuPricesApprovedByHR = formData.menuPricesApprovedByHR;
  //     setuppagevendor.documentsNeedApproval = formData.documentsNeedApproval;
  
  //     // Update uploadableDocuments booleans
  //     if (formData.uploadableDocuments) {
  //       setuppagevendor.uploadableDocuments.bankAccount = formData.uploadableDocuments.bankAccount || false;
  //       setuppagevendor.uploadableDocuments.foodCateringLicense = formData.uploadableDocuments.foodCateringLicense || false;
  //       setuppagevendor.uploadableDocuments.aadhar = formData.uploadableDocuments.aadhar || false;
  //       setuppagevendor.uploadableDocuments.pan = formData.uploadableDocuments.pan || false;
  //     }
  
  //     setuppagevendor = await setuppagevendor.save();
  
  //     res.status(200).json({
  //       message: "Setup page updated successfully.",
  //       doc: setuppagevendor,
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       message: error.message,
  //     });
  //   }
  // });
  








  // add vendor
exports.createvendor = catchAssyncError(async (req, res, next) => {
    try {
      const { first_name, last_name, middle_name, email, password, phone,vendor_company,vendor_code,vendor_document,bank_details,scanner_image,frequency_of_menuupdating } =
        req.body;
      const existingUser = await VendorModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered." });
      }
      // Create a new user instance
      let newUser = new VendorModel({
        first_name,
        last_name,
        middle_name,
        email,
        password,
        phone_number: phone,
        vendor_company,
        vendor_code,
        vendor_document,
        bank_details,
        scanner_image,
        frequency_of_menuupdating

      });
  
    //   // Assign Super-Admin role to the user
    //   newUser.profile.push("Super-Admin");
  
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
  