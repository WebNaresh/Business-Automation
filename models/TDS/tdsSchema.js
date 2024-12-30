// const mongoose = require("mongoose");

// const tdsSchema = new mongoose.Schema({
//   empId: {
//     type: String,
//     required: true,
//   },
//   financialYear: {
//     type: String,
//     required: true,
//   },
//   incomeFromHouseProperty: {
//     type: mongoose.Types.ObjectId,
//     ref: "houseIncome",
//   },
//   incomeFromSalarySource: {
//     type: mongoose.Types.ObjectId,
//     ref: "salaryIncome",
//   },
//   incomeFromOtherSources: {
//     type: mongoose.Types.ObjectId,
//     ref: "otherIncome",
//   },
//   sectionDeduction: {
//     type: mongoose.Types.ObjectId,
//     ref: "sectionDeduction",
//   },
//   organizationId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Organization",
//   },
// });

// const TDSModel = mongoose.model("TDS", tdsSchema);
// module.exports = { TDSModel };

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
  subsectionname: {
    type: String,
    required: false,
  },
  section: {
    type: String,
    required: false,
  },
  property1: {
    type: Number,
    default: 0,
    required: false,
  },
  property2: {
    type: Number,
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
  message: {
    type: String,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: "Pending",
    required: false,
  },
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
};

const TDSSchema = new mongoose.Schema({
  empId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  financialYear: {
    type: String,
    required: true,
  },
  regime: {
    type: String,
    enum: ["Old Regime", "New Regime"],
    default: "New Regime",
  },
  investment: [investmentArray],
  salaryDeclaration: {
    type: Number,
  },
  houseDeclaration: {
    type: Number,
  },
  otherDeclaration: {
    type: Number,
  },
  sectionDeclaration: {
    type: Number,
  },
  salary: {
    type: Number,
  },
  cess: {
    type: Number,
  },
  totalTaxableIncome: {
    type: Number,
  },
  regularTaxAmount: {
    type: Number,
  },
  withCessTax: {
    type: Number,
  },
  rebateAmount: {
    type: Number,
  },
});

const TDSModel = mongoose.model("TDS", TDSSchema);
module.exports = { TDSModel };
