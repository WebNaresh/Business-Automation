const { default: mongoose } = require("mongoose");

const NumberOtpCountSchema = new mongoose.Schema({
    mobileNo: {
        type: Number,
        required: true
    },
    tryCount: {
        type: Number,
        default: 1
    }
})

const NumberOtpModal = new mongoose.model("NumberOtpCount", NumberOtpCountSchema)

NumberOtpCountSchema.post('save', function (doc, next) {
    if (this.isNew) {
        // Increment tryCount for the corresponding mobileNo
        NumberOtpModal.updateOne(
            { mobileNo: this.mobileNo },
            { $inc: { tryCount: 1 } },
            (error, result) => {
                if (error) {
                    console.error('Error incrementing tryCount:', error);
                }
                next();
            }
        );
    } else {
        next();
    }
});

module.exports = { NumberOtpModal }