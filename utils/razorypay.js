const Razorpay = require("razorpay");
const moment = require("moment");
const { OrganisationModel } = require("../models/organizationSchema");
const { getPhonePayInstance } = require("phonepe-payment-integration");

let razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});
const invokerazorpay = () => {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
  });
};
const createSubscription = async (data) => {
  const currentTimestamp = moment().unix();

  try {
    const start_at = await calculateStartAt(
      JSON.parse(data?.isTrial),
      currentTimestamp
    );
    const { subscription } = await createSubscriptionWithRespectToPlanId(
      data?.packageInfo,
      start_at,
      Number(data?.count)
    );
    console.log(`🚀 ~ file: razorypay.js:67 ~ subscription:`, subscription);

    return {
      subscription,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      subscription: null,
      error: error,
    };
  }
};

const createOrderWithAmount = async (data) => {
  try {
    const order = await razorpayInstance.orders.create({
      currency: "INR",
      amount: data.totalPrice * 100,
    });

    return { order, error: null };
  } catch (error) {
    console.error(error);
    return { error: error?.error, order: null };
  }
};
const createOrderWithAmountPhonePay = async (req, res, encodedData, user) => {
  try {
    const amount = Number(req?.body?.totalPrice);
    console.log(`🚀 ~ amount:`, amount);
    const name = `${user?.first_name} ${user?.last_name}`;
    const mobileNumber = req?.body?.contact_number;
    console.log(`🚀 ~ mobileNumber:`, mobileNumber);
    const redirectUrl = `${process.env.SERVER_URL}/route/organization/verify/${req?.body?.paymentType}/${encodedData}`;
    const { response } = await getPhonePayInstance().pay({
      amount,
      name,
      mobileNumber,
      redirectUrl,
    });

    console.log(`🚀 ~ file: razorypay.js:63 ~ response:`, response);

    console.log(
      `🚀 ~ file: razorypay.js:76 ~ response?.instrumentResponse?.redirectInfo?.url:`,
      response?.instrumentResponse?.redirectInfo?.url
    );
    if (response?.instrumentResponse?.redirectInfo?.url === undefined) {
      return res.status(401).json({
        message:
          `${response?.message} Try changing payment Payment Gateway ` ||
          "Issue creating subscription server has internal issue",
        success: response?.success || false,
      });
    }
    console.log(
      `🚀 ~ file: razorypay.js:91 ~ response?.data?.instrumentResponse?.redirectInfo?.url:`,
      response?.data?.instrumentResponse?.redirectInfo?.url
    );
    console.log(
      `🚀 ~ file: razorypay.js:91 ~ response?.data?.instrumentResponse?.redirectInfo?.url:`,
      response?.data
    );

    return res.status(200).json({
      message: "Organization saved temporary successfully.",
      success: "true",
      paymentType: req?.body?.paymentType,
      callbackURI: redirectUrl,
      redirectUrl: response?.instrumentResponse?.redirectInfo?.url,
    });
  } catch (error) {
    console.error(`🚀 ~ file: razorypay.js:79 ~ error:`, error);
  }
};

const createOrderRazorpay = async (amount) => {
  const order = await razorpayInstance.orders.create({
    currency: "INR",
    amount: amount * 100,
  });

  return order;
};
const getSubscription = async (id) => {
  try {
    const subscription = await razorpayInstance.subscriptions.fetch(id);

    return { subscription };
  } catch (error) {
    console.error(error);
    return { error: error?.error, subscription: null, createdAddons: null };
  }
};
const deleteSubscription = async (id) => {
  try {
    const subscription = await razorpayInstance.subscriptions.cancel(id);
    return { subscription };
  } catch (error) {
    console.error(error);
  }
};
const getPlanDetails = async (id) => {
  try {
    const plan = await razorpayInstance.plans.fetch(id);
    return { plan };
  } catch (error) {
    console.error(error);
  }
};
// const verifyPhonePayStatus = async (req, res) => {
//   console.log(res.redirect);
//   const { paymentType, data, merchantTransactionId: id } = req.params;

//   const merchantTransactionId = req.body.transactionId;
//   console.log(
//     `🚀 ~ file: razorypay.js:167 ~ merchantTransactionId:`,
//     merchantTransactionId
//   );
//   const merchantId = req.body.merchantId;
//   console.log(`🚀 ~ file: razorypay.js:169 ~ merchantId:`, merchantId);
//   const keyIndex = 1;
//   const key = process.env.SALT_KEY;
//   const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + key;
//   const sha256 = crypto.Hash("sha256").update(string).digest("hex");
//   const checksum = sha256 + "###" + keyIndex;
//   console.log(`🚀 ~ file: razorypay.js:166 ~ checksum:`, checksum);
//   const URL = `${process.env.PHONE_PAY_URL}/status/${merchantId}/${merchantTransactionId}`;
//   const options = {
//     method: "GET",
//     url: URL,
//     headers: {
//       accept: "application/json",
//       "Content-Type": "application/json",
//       "X-VERIFY": checksum,
//       "X-MERCHANT-ID": merchantId,
//     },
//   };
//   console.log(`🚀 ~ file: razorypay.js:175 ~ options:`, options);
//   const response = await axios.request(options);
//   console.log(`🚀 ~ file: razorypay.js:189 ~ response:`, response?.data?.data);
//   console.log(
//     `🚀 ~ file: razorypay.js:189 ~ response:`,
//     response?.data?.data?.state
//   );
//   if (response?.data?.data?.state === "COMPLETED") {
//     const orgData = JSON.parse(data);
//     console.log(`🚀 ~ file: razorypay.js:192 ~ orgData:`, orgData);
//     const organisation = await OrganisationModel.create({
//       ...orgData,
//       subscriptionDetails: {
//         status: "Active",
//         paymentDate: new Date(),
//         expirationDate: orgData?.isTrial
//           ? moment()
//               .add(3 * orgData?.cycleCount, "month")
//               .add(7, "days")
//           : moment().add(3 * orgData?.cycleCount, "month"),
//       },
//     });
//     console.log(`🚀 ~ file: razorypay.js:202 ~ organisation:`, organisation);
//     // await organisation.save();
//     if (organisation !== null) {
//       console.log(
//         `🚀 ~ file: razorypay.js:214 ~ organisation !== null:`,
//         organisation !== null
//       );
//       return res.redirect(
//         `${process.env.BASE_URL}/organisation/${organisation._id}/setup`
//       );
//     } else {
//       return res.redirect(`${process.env.BASE_URL}/payment-failed`);
//     }
//   } else {
//     return res.redirect(`${process.env.CLIENBASE_URLT_URL}/payment-failed`);
//   }
// };

const verifyPhonePayStatus = async (req, res) => {
  const { data } = req.params;
  const { response } = await getPhonePayInstance()?.verifyPayment(
    req?.body?.transactionId
  );
  console.log(`🚀 ~ file: razorypay.js:194 ~ response:`, response);
  if (response?.data.state === "COMPLETED") {
    const orgData = JSON.parse(data);
    console.log(`🚀 ~ file: razorypay.js:192 ~ orgData:`, orgData);
    const organisation = await OrganisationModel.create({
      ...orgData,
      subscriptionDetails: {
        status: "Active",
        paymentDate: new Date(),
        expirationDate: orgData?.isTrial
          ? moment()
              .add(3 * orgData?.cycleCount, "month")
              .add(7, "days")
          : moment().add(3 * orgData?.cycleCount, "month"),
      },
    });
    console.log(`🚀 ~ file: razorypay.js:202 ~ organisation:`, organisation);
    if (organisation !== null) {
      console.log(
        `🚀 ~ file: razorypay.js:214 ~ organisation !== null:`,
        organisation !== null
      );
      return res.redirect(
        `${process.env.BASE_URL}/organisation/${organisation._id}/setup`
      );
    } else {
      return res.redirect(`${process.env.BASE_URL}/payment-failed`);
    }
  } else {
    return res.redirect(`${process.env.CLIENBASE_URLT_URL}/payment-failed`);
  }
};

const verifyPhonePayUpgradeStatus = async (req, res) => {
  const { data, organizationId } = req.params;
  const { response } = await getPhonePayInstance()?.verifyPayment(
    req?.body?.transactionId
  );
  if (response?.data.state === "COMPLETED") {
    const orgData = JSON.parse(data);
    console.log(`🚀 ~ file: razorypay.js:192 ~ orgData:`, orgData);
    const organisation = await OrganisationModel.findByIdAndUpdate(
      organizationId,
      {
        $inc: {
          memberCount: orgData?.count,
        },
        $set: {
          packageInfo: orgData?.packageInfo,
        },
      }
    );
    console.log(`🚀 ~ file: razorypay.js:202 ~ organisation:`, organisation);
    if (organisation !== null) {
      return res.redirect(`${process.env.BASE_URL}/billing`);
    } else {
      return res.redirect(`${process.env.BASE_URL}/payment-failed`);
    }
  } else {
    return res.redirect(`${process.env.BASE_URL}/payment-failed`);
  }
};
const verifyPhonePayRenewStatus = async (req, res) => {
  const { data, organizationId } = req.params;
  const { response } = await getPhonePayInstance()?.verifyPayment(
    req?.body?.transactionId
  );
  if (response?.data.state === "COMPLETED") {
    const orgData = JSON.parse(data);
    console.log(`🚀 ~ file: razorypay.js:192 ~ orgData:`, orgData);
    const realDoc = await OrganisationModel.findById(organizationId);
    const organisation2 = await OrganisationModel.findByIdAndUpdate(
      organizationId,
      {
        $set: {
          packageInfo: orgData?.packageInfo,
          memberCount: orgData?.count,
          subscriptionDetails: {
            packageStartDate: orgData?.packageStartDate,
            packageEndDate: orgData?.packageEndDate,
          },
        },
      },
      {
        new: true,
      }
    );
    console.log(`🚀 ~ file: razorypay.js:202 ~ organisation:`, organisation);
    if (organisation !== null) {
      return res.redirect(`${process.env.BASE_URL}/billing`);
    } else {
      return res.redirect(`${process.env.BASE_URL}/payment-failed`);
    }
  } else {
    return res.redirect(`${process.env.BASE_URL}/payment-failed`);
  }
};
const verifyPhonePayPayStatus = async (req, res) => {
  const { data, organizationId } = req.params;
  const { response } = await getPhonePayInstance()?.verifyPayment(
    req?.body?.transactionId
  );
  if (response?.data.state === "COMPLETED") {
    const orgData = JSON.parse(data);
    console.log(`🚀 ~ file: razorypay.js:192 ~ orgData:`, orgData);
    const organisation = await OrganisationModel.findByIdAndUpdate(
      organizationId,
      {
        $set: {
          packageInfo: orgData?.packageInfo,
          memberCount: orgData?.count,
          subscriptionDetails: {
            packageStartDate: orgData?.packageStartDate,
            packageEndDate: orgData?.packageEndDate,
            status: "Active",
          },
        },
      },
      {
        new: true,
      }
    );
    console.log(`🚀 ~ file: razorypay.js:202 ~ organisation:`, organisation);
    if (organisation !== null) {
      return res.redirect(`${process.env.BASE_URL}/billing`);
    } else {
      return res.redirect(`${process.env.BASE_URL}/payment-failed`);
    }
  } else {
    return res.redirect(`${process.env.BASE_URL}/payment-failed`);
  }
};
const upgradePlanWithRazorPay = async (req, res, encodedData) => {
  let { order, error } = await createOrderWithAmount(req.body);
  if (error !== null) {
    return res.status(401).json({
      message: "Issue creating subscription server has internal issue",
      success: false,
    });
  }
  return res.status(200).json({
    message: "Organization saved temporary successfully.",
    success: "true",
    order: order,
    key: process.env.RAZORPAY_API_KEY,
    paymentType: req?.body?.paymentType,
    callbackURI: `${process.env.SERVER_URL}/route/organization/upgrade-organization/${req?.params?.organizationId}/${req.body.paymentType}/${encodedData}`,
  });
};
const renewPlanWithRazorPay = async (req, res, encodedData) => {
  let { order, error } = await createOrderWithAmount(req.body);
  if (error !== null) {
    return res.status(401).json({
      message: "Issue creating subscription server has internal issue",
      success: false,
    });
  }
  return res.status(200).json({
    message: "Organization saved temporary successfully.",
    success: "true",
    order: order,
    key: process.env.RAZORPAY_API_KEY,
    paymentType: req?.body?.paymentType,
    callbackURI: `${process.env.SERVER_URL}/route/organization/renew-organization/${req?.params?.organizationId}/${req.body.paymentType}/${encodedData}`,
  });
};
const payPlanWithRazorPay = async (req, res, encodedData) => {
  let { order, error } = await createOrderWithAmount(req.body);
  if (error !== null) {
    return res.status(401).json({
      message: "Issue creating subscription server has internal issue",
      success: false,
    });
  }
  return res.status(200).json({
    message: "Organization saved temporary successfully.",
    success: "true",
    order: order,
    key: process.env.RAZORPAY_API_KEY,
    paymentType: req?.body?.paymentType,
    callbackURI: `${process.env.SERVER_URL}/route/organization/pay-organization/${req?.params?.organizationId}/${req.body.paymentType}/${encodedData}`,
  });
};

const upgradePlanWihPhonePay = async (req, res, encodedData, user) => {
  try {
    const amount = Number(req?.body?.totalPrice);
    const name = `${user?.first_name} ${user?.last_name}`;
    const mobileNumber = user?.contact_number;
    const redirectUrl = `${process.env.SERVER_URL}/route/organization/upgrade-organization/${req?.params?.organizationId}/${req.body.paymentType}/${encodedData}`;
    const { response } = await getPhonePayInstance().pay({
      amount,
      name,
      mobileNumber,
      redirectUrl,
    });

    console.log(`🚀 ~ file: razorypay.js:63 ~ response:`, response);
    if (response?.success !== true) {
      return res.status(401).json({
        message:
          `${response?.message} Try changing payment Payment Gateway ` ||
          "Issue creating subscription server has internal issue",
        success: response?.success || false,
      });
    }

    return res.status(200).json({
      message: "Organization saved temporary successfully.",
      success: "true",
      paymentType: req?.body?.paymentType,
      callbackURI: redirectUrl,
      redirectUrl: response?.data?.instrumentResponse?.redirectInfo?.url,
    });
  } catch (error) {
    console.error(`🚀 ~ file: razorypay.js:79 ~ error:`, error);
  }
};
const renewPlanWihPhonePay = async (req, res, encodedData, user) => {
  try {
    const amount = Number(req?.body?.totalPrice);
    const name = `${user?.first_name} ${user?.last_name}`;
    const mobileNumber = user?.contact_number;
    const redirectUrl = `${process.env.SERVER_URL}/route/organization/renew-organization/${req?.params?.organizationId}/${req.body.paymentType}/${encodedData}`;
    const { response } = await getPhonePayInstance().pay({
      amount,
      name,
      mobileNumber,
      redirectUrl,
    });

    console.log(`🚀 ~ file: razorypay.js:63 ~ response:`, response);
    if (response?.success !== true) {
      return res.status(401).json({
        message:
          `${response?.message} Try changing payment Payment Gateway ` ||
          "Issue creating subscription server has internal issue",
        success: response?.success || false,
      });
    }

    return res.status(200).json({
      message: "Organization saved temporary successfully.",
      success: "true",
      paymentType: req?.body?.paymentType,
      callbackURI: redirectUrl,
      redirectUrl: response?.data?.instrumentResponse?.redirectInfo?.url,
    });
  } catch (error) {
    console.error(`🚀 ~ file: razorypay.js:79 ~ error:`, error);
  }
};
const payPlanWihPhonePay = async (req, res, encodedData, user) => {
  try {
    const amount = Number(req?.body?.totalPrice);
    const name = `${user?.first_name} ${user?.last_name}`;
    const mobileNumber = user?.contact_number;
    const redirectUrl = `${process.env.SERVER_URL}/route/organization/pay-organization/${req?.params?.organizationId}/${req.body.paymentType}/${encodedData}`;
    const { response } = await getPhonePayInstance().pay({
      amount,
      name,
      mobileNumber,
      redirectUrl,
    });

    console.log(`🚀 ~ file: razorypay.js:63 ~ response:`, response);
    if (response?.success !== true) {
      return res.status(401).json({
        message:
          `${response?.message} Try changing payment Payment Gateway ` ||
          "Issue creating subscription server has internal issue",
        success: response?.success || false,
      });
    }

    return res.status(200).json({
      message: "Organization saved temporary successfully.",
      success: "true",
      paymentType: req?.body?.paymentType,
      callbackURI: redirectUrl,
      redirectUrl: response?.data?.instrumentResponse?.redirectInfo?.url,
    });
  } catch (error) {
    console.error(`🚀 ~ file: razorypay.js:79 ~ error:`, error);
  }
};
const raozorPay = () => {
  if (razorpayInstance === undefined) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_API_SECRET,
    });
  }
  return razorpayInstance;
};
const cancelSubscription = async (subscriptionId, organisation) => {
  await razorpayInstance.subscriptions.cancel(subscriptionId);
  const gap = Data.now() - organisation.createdAt;
  let message;
  if (7 > gap) {
    razorpayInstance.payments.refund(
      organisation?.paymentDetails?.razorpay_payment_id
    );
    message =
      "Subscription is cancelled, You will receive full refund within 7 working days";
  } else {
    message =
      "Subscription is cancelled, No refund initiated as subscription was cancelled after 7 days trial period";
  }
  await OrganisationModel.findByIdAndUpdate(organisation._id, {
    $set: {
      "paymentDetails.razorpay_order_id": "",
      "paymentDetails.razorpay_payment_id": "",
      "paymentDetails.razorpay_signature": "",
      active: false,
    },
  });
  return { message };
};
const getSubscriptionAddons = async (id) => {
  try {
    const addons = await razorpayInstance.subscriptions.fetchAddons(id);
    return { addons };
  } catch (error) {
    console.error(error);
  }
};
const updateSubscriptionPlan = async (subscriptionId, data) => {
  const currentTimestamp = moment().unix();

  try {
    const start_at = await moment
      .unix(currentTimestamp)
      .add(10, "minute")
      .unix();
    const { subscription } = await updateSubscriptionWithRespectToPlanId(
      data.planDetails?.value,
      start_at,
      subscriptionId,
      Number(data?.count)
    );
    console.log(`🚀 ~ file: razorypay.js:139 ~ subscription:`, subscription);

    return {
      subscription,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      subscription: null,
      error: error,
    };
  }
};
const pauseSubscriptionPlan = async (subscriptionId) => {
  try {
    const result = await razorpayInstance.subscriptions.pause(subscriptionId, {
      pause_at: "now",
    });
    console.log(`🚀 ~ file: razorypay.js:139 ~ result:`, result);
    return {
      subscription: result,
    };
  } catch (error) {
    console.error(error);
  }
};
const resumeSubscriptionPlan = async (subscriptionId) => {
  console.log(`🚀 ~ file: razorypay.js:147 ~ subscriptionId:`, subscriptionId);
  try {
    const result = await razorpayInstance.subscriptions.resume(subscriptionId, {
      resume_at: "now",
    });
    console.log(`🚀 ~ file: razorypay.js:139 ~ result:`, result);
    return {
      subscription: result,
    };
  } catch (error) {
    console.error(error);
  }
};
const createOrganizationWithRazorPay = async (req, res, encodedData, user) => {
  let { order, error } = await createOrderWithAmount(req.body);
  if (error !== null) {
    return res.status(401).json({
      message: "Issue creating subscription server has internal issue",
      success: false,
    });
  }
  return res.status(200).json({
    message: "Organization saved temporary successfully.",
    success: "true",
    order: order,
    key: process.env.RAZORPAY_API_KEY,
    paymentType: req?.body?.paymentType,
    callbackURI: `${process.env.SERVER_URL}/route/organization/verify/${req.body.paymentType}/${encodedData}`,
  });
};

const calculateStartAt = async (isTrial, currentTimestamp) => {
  if (isTrial === true) {
    return moment.unix(currentTimestamp).add(7, "days").unix();
  } else {
    return moment.unix(currentTimestamp).add(10, "minute").unix();
  }
};

const createSubscriptionWithRespectToPlanId = async (
  plan_id,
  start_at,
  quantity
) => {
  console.log(`🚀 ~ file: razorypay.js:235 ~ start_at:`, start_at);
  console.log(`🚀 ~ file: razorypay.js:235 ~ plan_id:`, plan_id);
  console.log(`🚀 ~ file: razorypay.js:229 ~ quantity:`, quantity);
  const subscription = await razorpayInstance.subscriptions.create({
    plan_id,
    total_count: 100,
    quantity,
    start_at,
    customer_notify: 1,
  });
  return { subscription };
};
const updateSubscriptionWithRespectToPlanId = async (
  plan_id,
  start_at,
  subscriptionId,
  quantity
) => {
  const subscription = await razorpayInstance.subscriptions.update(
    subscriptionId,
    {
      plan_id,
      quantity,
      start_at,
      customer_notify: 1,
    }
  );
  console.log(`🚀 ~ file: razorypay.js:262 ~ subscription:`, subscription);

  return { subscription };
};

module.exports = {
  raozorPay,
  invokerazorpay,
  createSubscription,
  cancelSubscription,
  getSubscription,
  deleteSubscription,
  getPlanDetails,
  getSubscriptionAddons,
  updateSubscriptionPlan,
  pauseSubscriptionPlan,
  resumeSubscriptionPlan,
  createOrderWithAmount,
  createOrderRazorpay,
  createOrderWithAmountPhonePay,
  createOrganizationWithRazorPay,
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
};
