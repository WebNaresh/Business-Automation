// employeeController a User
const catchAssyncError = require("../middleware/catchAssyncError");
const crypto = require("crypto");
const logger = require("../utils/logger/index");
const {
  inputFieldModel,
  InputFieldDetailsModel,
} = require("../models/InputField/inputFieldSchema");
const {
  LeaveTypeDetailModel,
  LeaveTypeModel,
} = require("../models/leaves/leave-schma");
const {
  createRolesFunction,
} = require("./union-roles-controller/role-controller");
const { OrganisationModel } = require("../models/organizationSchema");
const { log } = require("winston");
const { uploadImage, updateUploadedImageUrl } = require("../utils/s3");
const moment = require("moment");
const {
  cancelSubscription,
  getSubscription,
  getPlanDetails,
  createOrderWithAmount,
  createOrderRazorpay,
  createOrganizationWithRazorPay,
  createOrderWithAmountPhonePay,
  verifyPhonePayStatus,
  upgradePlanWithRazorPay,
  upgradePlanWihPhonePay,
  renewPlanWithRazorPay,
  renewPlanWihPhonePay,
  verifyPhonePayUpgradeStatus,
  verifyPhonePayRenewStatus,
  payPlanWithRazorPay,
  payPlanWihPhonePay,
  verifyPhonePayPayStatus,
} = require("../utils/razorypay");
const {
  OrganizationRelationModel,
} = require("../models/org-rel-emp/organisationRelation");
const { EmployeeModel } = require("../models/employeeSchema");
const { RolesModel } = require("../models/roles/union-roles-models");
const {
  EmployeeSummaryModel,
} = require("../models/employeeSummarySchema/employeeSummarySchema");
const {
  AttendanceModel,
} = require("../models/leaves/leave-requesation-schema");
const {
  EmployeeSalaryModel,
} = require("../models/employeeSalarySchema/employeeSalarySchema");
const {
  EmployeeManagementModel,
} = require("../models/employeManager/employeeManagementSchema");
const { TDSModel } = require("../models/TDS/tdsSchema");
const { CouponModel } = require("../models/coupanSchema");
// const { createRolesDefault } = require("./role-controller");
const mongoose = require("mongoose");

exports.updateOrganization = catchAssyncError(async (req, res, next) => {
  try {
    const { userId, organizationId } = req.body;

    await User.findByIdAndUpdate(userId, { organization: organizationId });

    res.status(200).json({ message: "Organization updated successfully." });
  } catch (error) {
    logger.error(error, "message: server error");
    res.status(500).json({ message: "Server Error" });
  }
});

exports.getOrganization = catchAssyncError(async (req, res, next) => {
  const employeeId = req.user.user._id;
  console.log(`🚀 ~ employeeId:`, employeeId);
  try {
    const organizations = await OrganizationRelationModel.findOne({
      // active: true,
      employeeId,
    }).populate({
      path: "organizationId",
      populate: { path: "creator" },
    });
    console.log(`🚀 ~ organizations:`, organizations);

    // const organizations = await OrganisationModel.find({
    //   creator,
    //   active: true,
    // }).populate("creator");
    return res
      .status(200)
      .json({ organizations: organizations.organizationId });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

exports.getSingleOrganization = catchAssyncError(async (req, res, next) => {
  try {
    const id = req.params.id;
    const organizations = await OrganisationModel.findById({ _id: id });

    return res.status(200).json({ organizations });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ message: error.message });
  }
});
exports.currentOrganizationMembers = catchAssyncError(
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const members = await EmployeeModel.find({ organizationId: id });
      return res.status(200).json({ members });
    } catch (error) {
      logger.error(error.message);
      return res.status(500).json({ message: error.message });
    }
  }
);

exports.addOrganization = catchAssyncError(async (req, res, next) => {
  try {
    const id = req.user.user._id;
    const {
      name,
      location,
      organization_linkedin_url,
      organization_tagline,
      foundation_date,
      web_url,
      industry_type,
      email,
      contact_number,
      description,
      logo_url,
    } = req.body;

    const newOrganization = new OrganisationModel({
      name,
      foundation_date,
      web_url,
      industry_type,
      email,
      organization_linkedin_url,
      organization_tagline,
      location,
      contact_number,
      description,
      creator: id,
      logo_url,
    });

    await newOrganization.save();

    const isOrganizationAlreadyExists = await OrganisationModel.findOne({
      creator: id,
    });

    if (!isOrganizationAlreadyExists) {
      const updatedOne = await EmployeeModel.findByIdAndUpdate(id, {
        organizationId: newOrganization._id,
      });

      console.log(updatedOne);
    }
    console.log(isOrganizationAlreadyExists);

    const defaultInput = [
      {
        inputType: "text",
        label: "Middle Name",
        placeholder: "Enter Middle Name",
        isActive: false,
        organisationId: newOrganization._id,
      },
      {
        inputType: "text",
        label: "Marital Status",
        placeholder: "Enter Martial Status",
        isActive: false,
        organisationId: newOrganization._id,
      },
      {
        inputType: "text",
        label: "Primary Nationality",
        placeholder: "Enter Primary nationality",
        isActive: false,
        organisationId: newOrganization._id,
      },
      {
        inputType: "text",
        label: "Education",
        placeholder: "Enter Education",
        isActive: false,
        organisationId: newOrganization._id,
      },
      {
        inputType: "text",
        label: "Passport No",
        placeholder: "Passport",
        isActive: false,
        organisationId: newOrganization._id,
      },
      {
        inputType: "text",
        label: "Permanent Address",
        placeholder: "Enter Permanent Address",
        isActive: false,
        organisationId: newOrganization._id,
      },

      {
        inputType: "text",
        label: "Relative Information",
        placeholder: "Enter Relative Information",
        isActive: false,
        organisationId: newOrganization._id,
      },

      {
        inputType: "Number",
        label: "Emergency Contact",
        placeholder: "Enter Emergency contact",
        isActive: false,
        organisationId: newOrganization._id,
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
        organisationId: newOrganization._id,
      },
      {
        leaveName: "Work From Home",
        isActive: true,
        color: "#00C2FF",
        count: -1,
        organisationId: newOrganization._id,
      },
      {
        leaveName: "Available",
        isActive: true,
        color: "#00ff00",
        count: -1,
        organisationId: newOrganization._id,
      },
      {
        leaveName: "Public Holiday",
        isActive: true,
        color: "#00ff00",
        count: -1,
        organisationId: newOrganization._id,
      },
      {
        leaveName: "Comp Off",
        isActive: true,
        color: "#BB1F11",
        count: -1,
        organisationId: newOrganization._id,
      },
    ];

    const defaulLeaveTypeCreation = await LeaveTypeDetailModel.insertMany(
      defaultLeaveTypes
    );

    const mappedIds = defaulLeaveTypeCreation.map((ele) => ele._id);

    await LeaveTypeModel.create({
      leaveTypes: mappedIds,
      organisationId: newOrganization._id,
      creatorId: req.user.user._id,
    });
    z;
    // Extract the IDs of created InputFieldDetails
    const inputDetailsIds = createdInputDetails.map((detail) => detail._id);

    // Step 2: Create an InputField document referencing the created InputFieldDetails
    await inputFieldModel.create({
      organisationId: newOrganization._id,
      inputDetail: inputDetailsIds,
    });
    // await createRolesFunction(newOrganization._id);

    res.status(201).json({
      message: "Organization created successfully.",
      organization: newOrganization,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

exports.deleteOrganization = catchAssyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const isIdExists = await OrganisationModel.findById(id);

    if (!isIdExists)
      return res.status(400).json({ message: "Invalid ID", success: false });

    const deleteOrganization = await OrganisationModel.findByIdAndDelete(id);

    if (!deleteOrganization) {
      return res
        .status(400)
        .json({ message: "Failed to delete organization", success: false });
    }

    return res.status(200).json({
      message: "Organization deleted successfully.",
      success: true,
    });
  } catch (err) {
    console.error(`Error deleting organization:`, err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
});
exports.getAllOrgDetails = catchAssyncError(async (req, res, next) => {
  try {
    const orgData = await OrganisationModel.find({});
    return res.status(200).json({ orgData });
  } catch (err) {
    console.error(`error finding org data:`, err);
    return res.status(500).json({ message: error.message, success: false });
  }
});

exports.editOrganization = catchAssyncError(async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      foundation_date,
      web_url,
      industry_type,
      email,
      location,
      contact_number,
      description,
      logo_url,
    } = req.body;
    const updateFields = {};
    if (name) updateFields.name = name;
    if (foundation_date) updateFields.foundation_date = foundation_date;
    if (web_url) updateFields.web_url = web_url;
    if (industry_type) updateFields.industry_type = industry_type;
    if (email) updateFields.email = email;
    if (location) updateFields.location = location;
    if (contact_number) updateFields.contact_number = contact_number;
    if (description) updateFields.description = description;
    if (logo_url) updateFields.logo_url = logo_url;
    const isIdExists = await OrganisationModel.find({
      _id: id,
    });

    if (!isIdExists)
      return res.status(400).json({ message: "Invalid ID", success: false });

    const editOrg = await OrganisationModel.findByIdAndUpdate(
      { _id: id },
      { $set: updateFields },
      { new: true }
    );
    if (editOrg) {
      return res.status(200).json({
        message: "Organization updated successfully.",
        success: true,
      });
    }
  } catch (err) {
    console.error(err.message);
  }
});

exports.createAndPayOrganization = catchAssyncError(async (req, res) => {
  try {
    const {
      orgName,
      foundation_date,
      web_url,
      industry_type,
      email,
      organization_linkedin_url,
      location,
      contact_number,
      description,
      creator,
      isTrial,
      packageInfo,
      packages,
      count,
      cycleCount,
      totalPrice,
      paymentType,
      coupan,
    } = req.body;
    console.log(
      `🚀 ~ file: organizationController.js:372 ~ req.body:`,
      req.body
    );
    const user = req?.user?.user;

    if (!user) {
      return res.status(401).json({
        message: "Something went wrong try reloading",
        success: false,
      });
    }
    const dataToEncode = {
      orgName,
      foundation_date,
      web_url,
      industry_type,
      email,
      organization_linkedin_url,
      industry_type,
      location: location,
      contact_number,
      description,
      creator,
      memberCount: count,
      cycleCount,
      coupan,
      packageInfo,
    };

    const org = await OrganisationModel.create(dataToEncode);
    org.save();

    console.log(5);
    return res.status(201).json({
      message: "Organisation created You can go ahead",
      success: true,
    });
  } catch (err) {
    console.error(`🚀 ~ file: organizationController.js:349 ~ err:`, err);
    let message;
    if (err.message.includes("contact_number_1")) {
      message =
        "This organisation Contact Number is already registered please go to step one and change organisational Contact Number";
    } else if (err.message.includes("email_1")) {
      message =
        "This organisation email is already registered please go to step one and change organisational email";
    } else if (err.message.includes("orgName_1")) {
      message =
        "This organisation organisation name is already registered please go to step one and change organisational organisation name";
    } else {
      message = "something went wrong";
    }
    return res.status(401).json({
      message,
      success: false,
    });
  }
});

exports.verifyOrganization = catchAssyncError(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { paymentType, data } = req.params;

    if (paymentType === "Phone_Pay") {
      return verifyPhonePayStatus(req, res);
    } else {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
        req.body;

      const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id, "utf-8")
        .digest("hex");

      const isAuthentic = generated_signature === razorpay_signature;

      if (!isAuthentic) {
        return res.redirect(`${process.env.BASE_URL}/paymentfailed`);
      }

      const orgData = JSON.parse(data);

      const organisation = await OrganisationModel.create(
        [
          {
            ...orgData,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return res.redirect(
        `${process.env.BASE_URL}/organisation/${organisation._id}/setup`
      );
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error during organization verification:", err);
    return res.status(401).json({
      message: "failed",
      success: false,
    });
  }
});

exports.verifyCoupon = catchAssyncError(async (req, res) => {
  try {
    const { coupan } = req.body;
    const user = req.user.user;

    if (!coupan) {
      return res.status(202).json({ status: false, message: "Invalid Coupon" });
    }

    const isUsed = await OrganisationModel.findOne({ coupan });

    if (isUsed) {
      console.log(`🚀 ~ isUsed:`, isUsed);
      return res.status(202).json({
        status: false,
        message: "Coupan has been already used or expired",
      });
    }

    const verfiyCoupan = await CouponModel.findOne({
      coupan,
      userid: user._id,
    });
    console.log(`🚀 ~ user._id:`, user._id);

    if (!verfiyCoupan) {
      return res.status(204).json({ status: false, message: "Invalid Coupon" });
    }
    return res
      .status(200)
      .json({ status: true, message: "Valid Coupon", verfiyCoupan });
  } catch (err) {
    console.log(err);
  }
});

exports.getSubscriptionDetails = catchAssyncError(async (req, res) => {
  console.log(
    `🚀 ~ file: organizationController.js:534 ~  req.params.organizationId:`,
    req.params.organizationId
  );
  try {
    if (!req.params.organizationId) {
      return res.status(401).json({
        message: "Please provide organization id",
        success: false,
      });
    }
    const organisation = await OrganisationModel.findById(
      req.params.organizationId
    );

    return res.status(201).json({
      organisation,
      success: true,
      mesaage: "our plan is retrieved successfully",
    });
  } catch (err) {
    console.error(
      `🚀 ~ file: organizationController.js:411 ~ err:`,
      err.message
    );
    return res.status(401).json({
      message: "failed",
      success: false,
    });
  }
});

exports.updateOrganizationStructure = catchAssyncError(async (req, res) => {
  try {
    const { organizationId } = req.params;

    const {
      orgName,
      foundation_date,
      web_url,
      industry_type,
      email,
      organization_linkedin_url,
      location,
      contact_number,
      description,
    } = req.body;

    const organization = await OrganisationModel.findById(organizationId);
    const user = await EmployeeModel.findById(organization?.creator);

    if (!organization) {
      return res.status(401).json({
        message: "This organisation is un-authentic",
        success: false,
      });
    }
    let url;
    if (req.file) {
      if (organization?.logo_url === "" || null || undefined) {
        url = await uploadImage(req.file, user, "organisation");
      } else {
        await updateUploadedImageUrl(req.file, organization?.logo_url);
      }
    }

    await OrganisationModel.findByIdAndUpdate(
      organization._id,
      {
        $set: {
          orgName,
          foundation_date,
          web_url,
          industry_type,
          email,
          organization_linkedin_url,
          location: JSON.parse(location),
          contact_number,
          description,
          logo_url: url ? url : organization?.logo_url,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Organisation updated successfully.",
      success: "true",
    });
  } catch (err) {
    console.error(`🚀 ~ file: organizationController.js:349 ~ err:`, err);
    let message;
    if (err.message.includes("contact_number_1")) {
      message =
        "This organisation Contact Number is already registered please go to step one and change organisational Contact Number";
    } else if (err.message.includes("email_1")) {
      message =
        "This organisation email is already registered please go to step one and change organisational email";
    } else if (err.message.includes("orgName_1")) {
      message =
        "This organisation organisation name is already registered please go to step one and change organisational organisation name";
    } else {
      message = "something went wrong";
    }
    return res.status(401).json({
      message,
      success: false,
    });
  }
});

module.exports.upgradeOrganizationPlan = catchAssyncError(async (req, res) => {
  const { organizationId } = req.params;
  if (!organizationId) {
    return res.status(401).json({
      message: "Organization not found",
      success: false,
    });
  }
  const organization = await OrganisationModel.findById(organizationId);
  if (!organization) {
    return res.status(401).json({
      message: "Organization not found",
      success: false,
    });
  }
  const encodedData = encodeURI(
    JSON.stringify({
      packageName: req.body.packageName,
      count: Number(req.body.count),
      totalPrice: req.body.totalPrice,
    })
  );

  if (req.body.paymentType === "RazorPay") {
    return upgradePlanWithRazorPay(req, res, encodedData);
  } else {
    return upgradePlanWihPhonePay(req, res, encodedData, req.user.user);
  }
});

module.exports.renewOrganizationPlan = catchAssyncError(async (req, res) => {
  const { organizationId } = req.params;

  if (!organizationId) {
    return res.status(401).json({
      message: "Organization not found",
      success: false,
    });
  }
  const organization = await OrganisationModel.findById(organizationId);
  if (!organization) {
    return res.status(401).json({
      message: "Organization not found",
      success: false,
    });
  }
  const encodedData = encodeURI(
    JSON.stringify({
      memberCount: req.body.memberCount,
      packageInfo: req.body.packageName,
      packageStartDate: organization?.subscriptionDetails.expirationDate,
      packageEndDate: moment(
        organization?.subscriptionDetails.expirationDate
      ).add(3 * (Number(req.body.cycleCount) ?? 1), "month"),
    })
  );

  if (req.body.paymentType === "RazorPay") {
    return renewPlanWithRazorPay(req, res, encodedData);
  } else {
    return renewPlanWihPhonePay(req, res, encodedData, req.user.user);
  }
});

module.exports.verifyUpgradePlan = catchAssyncError(async (req, res) => {
  const { paymentType, data, organizationId } = req.params;
  console.log(
    `🚀 ~ file: organizationController.js:1098 ~ { paymentType, data, organizationId }:`,
    { paymentType, data, organizationId }
  );

  if (paymentType === "Phone_Pay") {
    return verifyPhonePayUpgradeStatus(req, res);
  } else {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id, "utf-8")
      .digest("hex");

    const isAuthentic = generated_signature === razorpay_signature;
    console.log(
      `🚀 ~ file: organizationController.js:1111 ~ isAuthentic:`,
      isAuthentic
    );

    if (!isAuthentic) {
      return res.redirect(`${process.env.BASE_URL}/paymentfailed`);
    }

    const orgData = JSON.parse(data);
    console.log(
      `🚀 ~ file: organizationController.js:1121 ~ orgData:`,
      orgData
    );
    const organisation2 = await OrganisationModel.findByIdAndUpdate(
      organizationId,
      {
        $set: {
          packageInfo: orgData?.packageName,
        },
        $inc: {
          memberCount: orgData?.count,
        },
      }
    );
    // organisation2.save();
    return res.redirect(`${process.env.BASE_URL}/billing`);
  }
});

module.exports.verifyRenewPlan = catchAssyncError(async (req, res) => {
  const { paymentType, data, organizationId } = req.params;
  console.log(
    `🚀 ~ file: organizationController.js:1098 ~ { paymentType, data, organizationId }:`,
    { paymentType, data, organizationId }
  );

  if (paymentType === "Phone_Pay") {
    return verifyPhonePayRenewStatus(req, res);
  } else {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id, "utf-8")
      .digest("hex");

    const isAuthentic = generated_signature === razorpay_signature;
    console.log(
      `🚀 ~ file: organizationController.js:1111 ~ isAuthentic:`,
      isAuthentic
    );

    if (!isAuthentic) {
      return res.redirect(`${process.env.BASE_URL}/paymentfailed`);
    }

    const orgData = JSON.parse(data);
    console.log(
      `🚀 ~ file: organizationController.js:1121 ~ orgData:`,
      orgData
    );
    console.log(`🚀 ~ file: organizationController.js:736 ~ orgData:`, orgData);
    console.log(
      `🚀 ~ file: organizationController.js:737 ~ orgData?.packageInfo:`,
      orgData?.packageInfo
    );
    if (moment(orgData?.packageStartDate).isBefore(moment())) {
      return;
    }
    const organisation2 = await OrganisationModel.findByIdAndUpdate(
      organizationId,
      {
        upcomingPackageInfo: {
          packageName: orgData?.packageInfo,
          count: orgData?.count,
          packageStartDate: orgData?.packageStartDate,
          packageEndDate: orgData?.packageEndDate,
        },
      },
      {
        new: true,
      }
    );
    console.log(
      `🚀 ~ file: organizationController.js:738 ~ organisation2:`,
      organisation2
    );
    // organisation2.save();
    return res.redirect(`${process.env.BASE_URL}/billing`);
  }
});

module.exports.payOrganizationPlan = catchAssyncError(async (req, res) => {
  const { organizationId } = req.params;

  if (!organizationId) {
    return res.status(401).json({
      message: "Organization not found",
      success: false,
    });
  }
  const organization = await OrganisationModel.findById(organizationId);
  const employeCountInOrg = await EmployeeModel.countDocuments({
    organizationId,
  });
  console.log(
    `🚀 ~ file: organizationController.js:783 ~ employeCountInOrg:`,
    employeCountInOrg
  );
  if (employeCountInOrg >= Number(req?.body?.memberCount)) {
    return res.status(401).json({
      message: `Your overall employees are ${employeCountInOrg} and you are trying to add ${req?.body?.memberCount} employees`,
      success: false,
    });
  }
  if (!organization) {
    return res.status(401).json({
      message: "Organization not found",
      success: false,
    });
  }
  console.log(
    `🚀 ~ file: organizationController.js:795 ~  req.body:`,
    req.body
  );
  const encodedData = encodeURI(
    JSON.stringify({
      memberCount: req.body.memberCount,
      packageInfo: req.body.packageName,
      packageStartDate: req.body.packageStartDate,
      packageEndDate: req.body.packageEndDate,
    })
  );
  console.log(
    `🚀 ~ file: organizationController.js:796 ~ encodedData:`,
    encodedData
  );

  if (req.body.paymentType === "RazorPay") {
    return payPlanWithRazorPay(req, res, encodedData);
  } else {
    return payPlanWihPhonePay(req, res, encodedData, req.user.user);
  }
});

module.exports.verifyPayPlan = catchAssyncError(async (req, res) => {
  console.log(req.params);
  const { paymentType, data, organizationId } = req.params;
  console.log(
    `🚀 ~ file: organizationController.js:1098 ~ { paymentType, data, organizationId }:`,
    { paymentType, data, organizationId }
  );

  if (paymentType === "Phone_Pay") {
    return verifyPhonePayPayStatus(req, res);
  } else {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id, "utf-8")
      .digest("hex");

    const isAuthentic = generated_signature === razorpay_signature;
    console.log(
      `🚀 ~ file: organizationController.js:1111 ~ isAuthentic:`,
      isAuthentic
    );

    if (!isAuthentic) {
      return res.redirect(`${process.env.BASE_URL}/paymentfailed`);
    }

    const orgData = JSON.parse(data);
    console.log(
      `🚀 ~ file: organizationController.js:1121 ~ orgData:`,
      orgData
    );
    console.log(`🚀 ~ file: organizationController.js:736 ~ orgData:`, orgData);
    console.log(
      `🚀 ~ file: organizationController.js:737 ~ orgData?.packageInfo:`,
      orgData?.packageInfo
    );

    const organisation2 = await OrganisationModel.findByIdAndUpdate(
      organizationId,
      {
        $set: {
          packageInfo: orgData?.packageInfo,
          memberCount: orgData?.count,
          subscriptionDetails: {
            paymentDate: orgData?.packageStartDate,
            expirationDate: orgData?.packageEndDate,
            status: "Active",
          },
        },
      },
      {
        new: true,
      }
    );
    console.log(
      `🚀 ~ file: organizationController.js:738 ~ organisation2:`,
      organisation2
    );
    // organisation2.save();
    return res.redirect(`${process.env.BASE_URL}/billing`);
  }
});

const generateTDSData = async (data, organizationId) => {
  const TDSReport = await TDSModel.find({
    organizationId,
    financialYear: data.financialYear,
  }).populate("empId");

  const tdsData = TDSReport.map((item) => ({
    employeeName: `${item.empId.first_name} ${item.empId.last_name}`,
    empId: item.empId.empId,
    regime: item?.regime,
    salary: item.salary + 50000,
    afterStandardDeduction: item?.salary,
    otherDeclaration: item?.otherDeclaration,
    salaryDeclaration: item?.salaryDeclaration,
    sectionDeclaration: item?.sectionDeclaration,
    beforeCess: item?.getTotalTaxableIncome - item.cess,
    cess: item?.cess,
    taxableIncome: item?.getTotalTaxableIncome,
  }));

  return tdsData;
};

const generateSalaryData = async (data, organizationId, term) => {
  const startMonth = Number(data.startMonth);
  const endMonth = Number(data.endMonth);
  const startYear = Number(data.startYear);
  const endYear = Number(data.endYear);
  const monthRange = Array.from(
    { length: endMonth - startMonth + 1 },
    (_, i) => startMonth + i
  );
  const yearRange = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const getEmployerSalaries = await EmployeeSalaryModel.find({
    organizationId,
  }).populate("employeeId");

  const salaryDataArray = getEmployerSalaries.map((item) => ({
    employeeName: `${item.employeeId.first_name} ${item.employeeId.last_name}`,
    empId: item.employeeId.empId,
    salary: item.salary
      .filter(
        (sal) => monthRange.includes(sal.month) && yearRange.includes(sal.year)
      )
      .map((sal) => sal),
  }));

  const salary = salaryDataArray?.map((item) => ({
    employeeName: item?.employeeName,
    empId: item?.empId,
    salary: item.salary.map((salary) => ({
      month: salary?.month,
      year: salary?.year,
      basicSalary: salary?.basicSalary,
      daSalary: salary?.daSalary,
      hraSalary: salary?.hraSalary,
      foodAllowance: salary?.foodAllowance,
      salesAllowance: salary?.salesAllowance,
      specialAllowance: salary?.specialAllowance,
      travelAllowance: salary?.travelAllowance,
      variableAllowance: salary?.variableAllowance,
      totalGrossSalary: salary?.totalGrossSalary,
      shiftTotalAllowance: salary?.shiftTotalAllowance,
      remotePunchAllowance: salary?.remotePunchAllowance,
      totalDeduction: salary?.totalDeduction,
      totalNetSalary: salary?.totalNetSalary,
    })),
  }));

  return salary;
};

const generateAttendenceData = async (data, organizationId, dateRange) => {
  try {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    let employees;

    if (data?.manager) {
      let newEmp = await EmployeeManagementModel.findOne({
        managerId: data?.manager,
      })
        .populate("reporteeIds")
        .select("reporteeIds");
      console.log(newEmp);
      employees = newEmp?.reporteeIds?.map((item) => item);
    } else {
      // Fetch employee IDs based on the organization ID
      employees = await EmployeeModel.find({ organizationId });
    }

    // Map employee IDs for quick lookup
    const employeeIdMap = new Map(
      employees.map((emp) => [emp._id.toString(), emp])
    );

    // Fetch attendance data for the specified date range and employee IDs
    const summaryModel = await AttendanceModel.find({
      employeeId: {
        $in: employees.map((emp) => emp._id),
      },
      $or: [
        { start: { $gte: startDate, $lte: endDate } },
        { end: { $gte: startDate, $lte: endDate } },
        {
          $and: [{ start: { $lte: startDate } }, { end: { $gte: endDate } }],
        },
      ],
    }).populate("employeeId");

    // Create a Map to store attendance data by employee ID
    const attendanceMap = new Map();

    // Initialize attendance map with all employees and dates
    employees.forEach((employee) => {
      const empId = employee._id.toString();
      attendanceMap.set(empId, {
        name: `${employee.first_name} ${employee.last_name}`,
        empID: employee.empId,
        attendance: dateRange.map((date) => ({
          date: date.toISOString().split("T")[0],
          present: "N/A",
          title: "N/A",
        })),
        totalDaysPresent: 0,
        totalDaysAbsent: 0,
        totalDaysNotApplied: 0,
      });
    });

    // Populate the Map with attendance data from summaryModel
    summaryModel.forEach((item) => {
      const empId = item.employeeId._id.toString();
      const employee = employeeIdMap.get(empId);

      if (!employee) {
        console.warn(`Employee with ID ${empId} not found.`);
        return;
      }

      const recordStartDate = new Date(item.start) - 1;
      const recordEndDate = new Date(item.end);

      // Check if the record overlaps with the date range or includes the date range
      if (
        (recordStartDate >= startDate && recordStartDate <= endDate) ||
        (recordEndDate >= startDate && recordEndDate <= endDate) ||
        (recordStartDate <= startDate && recordEndDate >= endDate)
      ) {
        const isPresent = ["Available", "Work From Home"].includes(item.title)
          ? "P"
          : "A";

        attendanceMap.get(empId).attendance.forEach((entry) => {
          const entryDate = new Date(entry.date);
          if (entryDate >= recordStartDate && entryDate <= recordEndDate) {
            entry.present = isPresent;
            entry.title = item.title || "Not Applied";
          }
        });
      }
    });
    console.log(Array.from(attendanceMap.values()), "newArray");

    const finalArray = Array.from(attendanceMap.values()).map((emp) => {
      emp.attendance.forEach((att) => {
        if (att?.present === "P") {
          emp.totalDaysPresent += 1;
        }
        if (att?.present === "A") {
          emp.totalDaysAbsent += 1;
        }
        if (att?.present === "N/A") {
          emp.totalDaysNotApplied += 1;
        }
      });

      return emp;
    });
    // console.log(`🚀 ~ finalArray:`, finalArray);

    // Convert the attendance map to an array

    return finalArray;
  } catch (error) {
    console.error("Error in generateAttendenceData:", error);
    throw error;
  }
};

// Helper function to generate date range
const generateDateRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= new Date(endDate)) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

exports.generateMisReport = catchAssyncError(async (req, res) => {
  const data = req.query;
  const { organizationId } = req.params;
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  const dateRange = generateDateRange(startDate, endDate);
  let response;
  if (data.reportType === "Attendence") {
    response = await generateAttendenceData(data, organizationId, dateRange);

    return res.status(200).json(response);
  }
  if (data.reportType === "salary") {
    response = await generateSalaryData(data, organizationId, dateRange);

    return res.status(200).json(response);
  }

  if (data.reportType === "tds") {
    response = await generateTDSData(data, organizationId, dateRange);
    return res.status(200).json(response);
  }

  return res.status(400).json("no data found");
});
