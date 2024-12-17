// const { default: axios } = require("axios");
const { default: axios } = require("axios");
const { otpModel } = require("../models/OtpStore/otpSchema");
const { EmployeeModel } = require("../models/employeeSchema");
const { Vonage } = require("@vonage/server-sdk");
const {
  NumberOtpModal,
} = require("../models/NumberOtpCount/numberCountSchema");

class Otp {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    console.error("test one");
  }

  generateOtp() {
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp;
  }

  async verifyOTP() {
    const { number, otp } = this.req.body;
    console.log(number, otp);
    const isOTPValid = await otpModel.findOne({
      mobileNo: number,
    });

    if (isOTPValid?.otp !== parseInt(otp)) {
      return this.res.json({
        success: false,
        message: "Invalid OTP Please try again",
      });
    }
    return this.res.json({
      success: true,
      message: "OTP verified Successfully",
    });
  }

  // Handle POST requests to update or create a document
  async countOfOtps(phoneNumber) {
    try {
      console.log("runs");
      if (!phoneNumber) {
        return res
          .status(400)
          .json({ error: "Phone number is required in the request body." });
      }

      const existingPhoneNumber = await NumberOtpModal.findOne({
        mobileNo: phoneNumber,
      });

      if (existingPhoneNumber) {
        // Increment tryCount for the existing phone number
        existingPhoneNumber.tryCount += 1;
        await existingPhoneNumber.save();
      } else {
        // Create a new document with the provided phone number
        const newPhoneNumber = new NumberOtpModal({ mobileNo: phoneNumber });
        await newPhoneNumber.save();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async sendOTP() {
    try {
      const { number, countryCode } = this.req.body;
      const isOTPExists = await otpModel.findOne({
        mobileNo: number,
      });

      const isLimitExceeded = await NumberOtpModal.findOne({
        mobileNo: number,
      });

      if (isLimitExceeded && isLimitExceeded.tryCount >= 5) {
        return this.res.status(500).json({
          message: "You have excceded the limit for this number",
          success: false,
        });
      }

      // if (isOTPExists) {
      //     return this.res.json({ message: "You can't send otp wait for 5 min" })
      // }

      const isNumberExists = await EmployeeModel.findOne({
        phone_number: number,
      });

      const otp = this.generateOtp();

      // if (isNumberExists) {
      //   return this.res
      //     .status(400)
      //     .json({ message: "Mobile Number already exists", success: false });
      // }

      // const vonage = new Vonage({
      //   apiKey: "022364dc",
      //   apiSecret: "9SK4RS3jOicc1aWn",
      // });

      //TODO: sms process

      // const from = "Vonage APIs";
      // const to = `91${number}`;
      // const text = `Otp No is ${otp}`;

      // await vonage.sms
      //   .send({ to, from, text })
      //   .then((resp) => {
      //     console.log("Message sent successfully");
      //     console.log(resp);
      //   })
      //   .catch((err) => {
      //     console.log("There was an error sending the messages.");
      //     console.error(err);
      //   });

      //TODO: otp process
      // vonage.verify
      //   .start({
      //     number: `91${number}`,
      //     brand: "AEGIS HRMS",
      //   })
      //   .then((resp) => console.log(resp.request_id))
      //   .catch((err) => console.error(err));

      //TODO: Twillo verify

      // const accountSid = "AC1a65ab1d6983ee10027d7c654b3ee28c";
      // const authToken = "61271a96ff6f80594869e8124529ed59";
      // const client = require("twilio")(accountSid, authToken);

      // client.messages
      //   .create({
      //     body: "this is test otp 1234",
      //     from: "+12564455368",
      //     to: "+917219725697",
      //   })
      //   .then((message) => console.log(message.sid));

      // if (
      //   process.env.isProduction === "true" ||
      //   process.env.isProduction === true
      // ) {
      await axios.post(
        "https://www.fast2sms.com/dev/bulkV2",
        {
          route: "otp",
          numbers: number,
          variables_values: otp,
        },
        {
          headers: {
            authorization: process.env.FAST2SMS_API,
            "Content-Type": "application/json",
          },
        }
      );
      // }

      await this.addOtp(otp, number);
      await this.countOfOtps(number);
    } catch (error) {
      console.error(
        "Error sending SMS:",
        error.response ? error.response.data : error.message
      );
      return this.res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async addOtp(otp, number) {
    const addData = await otpModel.create({
      mobileNo: number,
      otp: otp,
    });

    return this.res.status(200).json({
      message: "Otp has been send on your mobile no",
      addData,
      test: 123,
    });
  }
}

module.exports = { Otp };
