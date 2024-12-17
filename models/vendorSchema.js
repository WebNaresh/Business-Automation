const mongoose = require('mongoose');
const validator = require("validator");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

const sessionSchema = new mongoose.Schema({
    deviceId: { type: String, required: true },
    token: { type: String, required: true },
    lastActive: { type: Date, default: Date.now },
  });
const Vendor = new mongoose.Schema({
    sessions: [sessionSchema],
    first_name: {
        type: String,
        required: [true, "Please Enter Your name"],
        maxLength: [30, "name cannot exceed 15 characters"],
        minLength: [1, "name should have more than 2 characters"],
      },
      last_name: {
        type: String,
        required: [true, "Please Enter Your name"],
        maxLength: [30, "name cannot exceed 15 characters"],
        minLength: [1, "name should have more than 2 characters"],
      },
      middle_name: {
        type: String,
        default: "",
      },
      isActive: {
        type: String,
      },
    
      email: {
        type: String,
        unique: [true, "Email is already exists"],
        required: [true, "Please Enter E-mail"],
        validate: [validator.isEmail, "Please fill a valid email address"],
      },
      password: {
        type: String,
        required: [true, "Please Enter Password"],
      },
      phone_number: {
        type: String,
      },
    
      company_name: { type: String,
        default: "",
      },
       
      vendor_code: { type: String,
      },

      vendor_document: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Document' // Reference to the Document model for PDFs
      }],

      bank_details: {
        type: String, 
      },
      scanner_image: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Document' // Reference to the Document model for scanner images
      }],
      
      frequency_of_menuupdating: {
        type: String,
      }
    });

    const VendorModel = mongoose.model("Vendor", Vendor);
    module.exports = { VendorModel };
    