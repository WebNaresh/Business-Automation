const mongoose = require("mongoose");

const investmentArray = {
  name: {
    type: String,
    required: true,
  },
  sectionname: {
    type: String,
    required: false,
  },
  section: {
    type: String,
    required: false,
  },
  property1: {
    type: String,
    default: 0,
    required: false,
  },
  property2: {
    type: String,
    default: 0,
    required: false,
  },
  declaration: {
    type: Number,
    default: 0,
    required: true,
  },
  amountAccepted: {
    type: Number,
    default: 0,
  },
  proof: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    default: "Pending",
    required: false,
  },
  message: {
    type: String,
  },
};
const TDSSchema = new mongoose.Schema({
  empId: {
    type: String,
    required: true,
  },
  financialYear: {
    type: String,
    required: true,
  },
  investment: [investmentArray],
});

const TDSModel = mongoose.model("TDS", TDSSchema);
module.exports = { TDSModel };
