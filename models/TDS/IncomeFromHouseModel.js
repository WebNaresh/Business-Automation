const mongoose = require("mongoose");
const { TDSModel } = require("./tdsSchema");

const IncomeFromHouseSchema = new mongoose.Schema({
  empId: {
    type: mongoose.Types.ObjectId,
    ref: "Employee",
  },
  financialYear: {
    type: String,
    required: true,
  },
  approverId: {
    type: mongoose.Types.ObjectId,
    required: false,
    ref: "employee",
  },

  section: [
    {
      sectionName: {
        type: String,
        required: true,
      },
      investmentType: [
        {
          name: String,
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
        },
      ],
    },
  ],
});
IncomeFromHouseSchema.post("findOneAndUpdate", async function () {
  try {
    const { empId, financialYear } = this.getQuery();
    const updatedDoc = await this.model.findOne(this.getFilter());

    console.log(empId, financialYear);
    // Find the corresponding TDS document
    let prevTDS = await TDSModel.findOne({
      empId,
      financialYear,
    });

    if (!prevTDS) {
      // If TDS document doesn't exist, create a new one
      const newTDS = await TDSModel.create({
        empId,
        financialYear,
        incomeFromHouseProperty: updatedDoc._id,
        organizationId: updatedDoc.organizationId,
      });
      newTDS.save();
    } else {
      // If TDS document exists, update the incomeFromHouseProperty field
      prevTDS.incomeFromHouseProperty = updatedDoc._id;
      await prevTDS.save();
    }
  } catch (error) {
    console.error(error);
  }
});

const IncomeFromHouseSchemaModel = mongoose.model(
  "houseIncome",
  IncomeFromHouseSchema
);

module.exports = { IncomeFromHouseSchemaModel };
