const mongoose = require("mongoose");
const { OrganisationLocationModel } = require("./organizationLocationsSchema");
const { EmployeeModel } = require("./employeeSchema");
const {
  LeaveTypeDetailModel,
  LeaveTypeModel,
} = require("./leaves/leave-schma");
const {
  inputFieldModel,
  InputFieldDetailsModel,
} = require("../models/InputField/inputFieldSchema");
const {
  OrganizationRelationModel,
} = require("./org-rel-emp/organisationRelation");
const { RemotePunchingModel } = require("./RemotePunching/remote-punching");
const { RolesModel } = require("./roles/union-roles-models");

const Organization = new mongoose.Schema(
  {
    orgName: {
      type: String,
      required: true,
      unique: true,
    },
    foundation_date: {
      type: String,
      required: true,
    },
    web_url: {
      type: String,
      // required: true,
    },
    organization_linkedin_url: {
      type: String,
      // required: false,
    },
    industry_type: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      address: {
        type: String,
        required: true,
      },
      position: {
        lat: {
          type: Number,
          required: true,
        },
        lng: {
          type: Number,
          required: true,
        },
      },
    },
    contact_number: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      // required: true,
    },
    gst_number: {
      type: Number,
      // required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    logo_url: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: false,
    },

    memberCount: {
      type: Number,
      default: 0,
    },
    cycleCount: {
      type: Number,
      default: 1,
    },
    coupan: {
      type: String,
      required: false,
    },
    packageInfo: {
      type: String,
      default: "Basic Plan",
    },
    updatablePackageInfo: {
      type: String,
      default: "",
    },
    remainingBalance: {
      type: Number,
      default: 0,
    },
    paymentToComplete: {
      type: Number,
      default: 0,
    },
    memberUpdatePaymentDetails: [
      {
        razorpay_payment_id: {
          type: String,
          required: true,
        },
        razorpay_signature: {
          type: String,
          required: true,
        },
        razorpay_order_id: {
          type: String,
          required: true,
        },
      },
    ],
    memberToAdd: {
      type: Number,
      default: 0,
    },
    packageToChange: {
      type: String,
    },
    upcomingPackageInfo: {
      packageName: {
        type: String,
      },
      packageStartDate: {
        type: Date,
      },
      packageEndDate: {
        type: Date,
      },
      memberCount: {
        type: Number,
      },
    },
  },
  { timestamps: true }
);

Organization.pre("save", async function () {
  try {
    const defaultInput = [
      {
        inputType: "text",
        label: "Middle Name",
        placeholder: "Enter Middle Name",
        isActive: false,
        organisationId: this._id,
      },
      {
        inputType: "text",
        label: "Marital  Status",
        placeholder: "Enter Marital Status",
        isActive: false,
        organisationId: this._id,
      },
      {
        inputType: "text",
        label: "Primary Nationality",
        placeholder: "Enter Primary Nationality",
        isActive: false,
        organisationId: this._id,
      },
      {
        inputType: "text",
        label: "Passport No",
        placeholder: "Passport",
        isActive: false,
        organisationId: this._id,
      },
      {
        inputType: "text",
        label: "Education",
        placeholder: "Enter Education",
        isActive: false,
        organisationId: this._id,
      },
      {
        inputType: "text",
        label: "Permanent Address",
        placeholder: "Enter Permanent Address",
        isActive: false,
        organisationId: this._id,
      },

      {
        inputType: "text",
        label: "Relative Information",
        placeholder: "Enter Relative Information",
        isActive: false,
        organisationId: this._id,
      },

      {
        inputType: "Number",
        label: "Emergency Contact",
        placeholder: "Enter Emergency Contact",
        isActive: false,
        organisationId: this._id,
      },
    ];
    // Step 1: Create InputFieldDetails documents
    const createdInputDetails = await InputFieldDetailsModel.insertMany(
      defaultInput
    );
    const defaultLeaveTypes = [
      {
        leaveName: "Unpaid leave",
        isActive: true,
        color: "#BB1F11",
        count: -1,
        organisationId: this._id,
      },
      {
        leaveName: "Work From Home",
        isActive: true,
        color: "#00C2FF",
        count: -1,
        organisationId: this._id,
      },
      {
        leaveName: "Available",
        isActive: true,
        color: "#00ff00",
        count: -1,
        organisationId: this._id,
      },
      {
        leaveName: "Public Holiday",
        isActive: true,
        color: "#00ff00",
        count: -1,
        organisationId: this._id,
      },
    ];

    const defaultLeaveTypeCreation = await LeaveTypeDetailModel.insertMany(
      defaultLeaveTypes
    );
    const mappedIds = defaultLeaveTypeCreation.map((ele) => ele._id);

    await LeaveTypeModel.create({
      leaveTypes: mappedIds,
      organisationId: this._id,
      creatorId: this.creator,
    });

    // Extract the IDs of created InputFieldDetails
    const inputDetailsIds = createdInputDetails.map((detail) => detail._id);

    // Step 2: Create an InputField document referencing the created InputFieldDetails
    await inputFieldModel.create({
      organisationId: this._id,
      inputDetail: inputDetailsIds,
    });
    await RolesModel.create({
      organisationId: this._id,
    });
    const organisationRelation = await OrganizationRelationModel.findOne({
      employeeId: this.creator,
    });

    if (organisationRelation) {
      organisationRelation.organizationId.push(this._id);
      organisationRelation.save();
    } else {
      const newRel = await OrganizationRelationModel.create({
        employeeId: [this.creator],
        organizationId: [this._id],
      });
      newRel.save();
    }
    const defaultRemotePunching = await RemotePunchingModel.create({
      organizationId: this._id,
    });
    await defaultRemotePunching.save();
  } catch (error) {
    console.error(`🚀 ~ file: organizationSchema.js:93 ~ error:`, error);
    throw new Error(error);
  }
});
Organization.pre("remove", async function (next) {
  try {
    await inputFieldModel.deleteMany({ organisationId: this._id });
    await InputFieldDetailsModel.deleteMany({ organisationId: this._id });
    await LeaveTypeDetailModel.deleteMany({ organisationId: this._id });
    await LeaveTypeModel.deleteMany({ organisationId: this._id });
    await OrganizationRelationModel.findOneAndUpdate(
      { organizationId: this._id },
      {
        $pull: { organizationId: this._id },
      }
    );
    await RemotePunchingModel.deleteMany({ organizationId: this._id });
    await RolesModel.deleteOne({
      organisationId: this._id,
    });
    next();
  } catch (error) {
    next(error);
  }
});
const OrganisationModel = mongoose.model("Organization", Organization);
module.exports = { OrganisationModel };
