const mongoose = require("mongoose");
const InputFieldDetails = new mongoose.Schema({
  inputType: {
    type: String,
  },
  label: {
    type: String,
  },
  placeholder: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  organisationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
  },
});

const InputField = new mongoose.Schema({
  organisationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    unique: true,
  },
  inputDetail: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InputFieldDetails",
    },
  ],
});

InputField.pre("remove", async function (next) {
  const InputFieldDetailModels = mongoose.model("InputFieldDetails");
  await InputFieldDetailModels.deleteMany({ _id: { $in: this.inputDetail } });
});
const inputFieldModel = mongoose.model("InputField", InputField);
const InputFieldDetailsModel = mongoose.model(
  "InputFieldDetails",
  InputFieldDetails
);
module.exports = { inputFieldModel, InputFieldDetailsModel };
