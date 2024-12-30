const { default: mongoose } = require("mongoose");

const otpSchema = new mongoose.Schema({
    otp: {
        type: Number,
        required: true
    },
    mobileNo: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        expires: '5m',
        default: Date.now
    }
})

const otpModel = new mongoose.model("Otp", otpSchema)

module.exports = { otpModel }