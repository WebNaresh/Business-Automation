const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  OrganizationRelationModel,
} = require("./org-rel-emp/organisationRelation");

const sessionSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  token: { type: String, required: true },
  lastActive: { type: Date, default: Date.now },
});

const Employee = new mongoose.Schema({
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

  employeeStatus: {
    type: String,
  },
  user_id: {
    type: String,
    default: null,
  },

  emergency_contact: {
    type: String,
  },
  joining_date: {
    type: Date,
  },
  gender: {
    type: String,
  },
  address: {
    type: String,
  },
  adhar_card_number: {
    type: Number,
  },
  pan_card_number: {
    type: String,
  },

  shift_allocation: {
    type: String,
    default: null,
  },
  profile: {
    type: [String],
    default: ["Employee"],
  },
  companyemail: {
    type: String,
  },

  citizenship: {
    type: String,
  },
  additional_phone_number: {
    type: Number,
  },
  status_message: {
    type: String,
  },
  chat_id: {
    type: String,
  },
  user_logo_url: {
    type: String,
  },
  date_of_birth: {
    type: Date,
  },
  empId: {
    type: String,
  },

  esicNo: {
    type: String,
  },
  uanNo: {
    type: String,
  },

  pwd: {
    type: Boolean,
    default: false,
  },

  designation: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Designation",
        default: null,
      },
    ],
  },
  worklocation: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrganizationLocations",
        default: null,
      },
    ],
  },
  deptname: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        default: null,
      },
    ],
  },
  employmentType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EmploymentTypes",
    default: null,
  },
  additionalInfo: mongoose.Schema.Types.Mixed,

  bank_account_no: {
    type: Number,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    default: null,
  },
  salarystructure: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SalaryTemplate",
    default: null,
  },
  emergency_contact_no: {
    type: Number,
  },
  emergency_contact_name: {
    type: String,
  },
  relationship_with_emergency_contact: {
    type: String,
  },
  height: {
    type: String,
  },
  weight: {
    type: String,
  },
  blood_group: {
    type: String,
  },
  voting_card_no: {
    type: String,
  },
  permanent_address: {
    type: String,
  },
  parent_name: {
    type: String,
  },
  spouse_name: {
    type: String,
  },
  father_first_name: {
    type: String,
  },
  father_middal_name: {
    type: String,
  },
  father_last_name: {
    type: String,
  },
  father_occupation: {
    type: String,
  },
  mother_first_name: {
    type: String,
  },
  mother_middal_name: {
    type: String,
  },
  mother_last_name: {
    type: String,
  },
  mother_occupation: {
    type: String,
  },
  smoking_habits: {
    type: String,
  },
  drinking_habits: {
    type: String,
  },
  sports_interest: {
    type: String,
  },
  favourite_book: {
    type: String,
  },
  favourite_travel_destination: {
    type: String,
  },
  disability_status: {
    type: String,
  },
  emergency_medical_condition: {
    type: String,
  },
  short_term_goal: {
    type: String,
  },
  long_term_goal: {
    type: String,
  },
  strength: {
    type: String,
  },
  weakness: {
    type: String,
  },
  bank_name: {
    type: String,
  },
  ifsc_code: {
    type: String,
  },
  current_ctc: {
    type: String,
  },
  exit_date: {
    type: Date,
  },
  travel_requirement: {
    type: String,
  },
  id_card_no: {
    type: String,
  },
  company_assets: {
    type: String,
  },

  verified: {
    type: Boolean,
    default: false,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    default: null,
  },
  mgrempid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    default: null,
  },
});

Employee.pre("save", async function (next) {
  console.log(this.profile);

  if (this.profile.includes("Delegate-Super-Admin")) {
    await OrganizationRelationModel.findOneAndUpdate(
      {
        employeeId: this.creatorId,
      },
      {
        $addToSet: {
          employeeId: this._id,
        },
      }
    );
  }
  if (this.profile.includes("Super-Admin")) {
    const relation = await OrganizationRelationModel.create({
      employeeId: [this._id],
      organizationId: [],
    });
    relation.save();
  }
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
Employee.pre("updateOne", async function (next) {
  console.log(
    `🚀 ~ file: employeeSchema.js:189 ~ this.isModified("password":`,
    this
  );
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});
Employee.methods.getJWTToken = function (role) {
  return jwt.sign(
    {
      user: {
        first_name: this.first_name,
        last_name: this.last_name,
        _id: this._id,
        email: this.email,
        profile: this.profile,
        organizationId: this.organizationId,
        deptname: this.deptname,
        birthdate: this.date_of_birth,
      },
      role: role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

const EmployeeModel = mongoose.model("Employee", Employee);
const SessionModel = mongoose.model("sessionSchema", sessionSchema);

module.exports = { EmployeeModel, SessionModel };
