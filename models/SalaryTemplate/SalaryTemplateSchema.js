const mongoose = require("mongoose");

// chnages need to be done as income/ deductinn added
// const SalaryStructureSchema = new mongoose.Schema({
//   salaryComponent: {
//     type: String,
//     required: true,
//   },
// });

const SalaryTemplateSchema = new mongoose.Schema(
  {
    //! previous
    // salaryStructure: [SalaryStructureSchema],

    income: {
      type: [String],
      // required: true,
    },
    deductions: {
      type: [String],
      // required: true,
    },
    organisationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
    },
    empType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmploymentTypes",
      required: true,
    },
  },
  { timestamps: true }
);

const SalaryTemplateModel = mongoose.model(
  "SalaryTemplate",
  SalaryTemplateSchema
);

module.exports = { SalaryTemplateModel };
