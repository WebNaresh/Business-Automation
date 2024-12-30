const mongoose = require("mongoose");
const { TDSModel } = require("./tdsSchema");

const IncomeFormSalarySchema = new mongoose.Schema({
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

  investmentType: [
    {
      name: {
        type: String,
        required: true,
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
});

IncomeFormSalarySchema.post("findOneAndUpdate", async function () {
  try {
    const { empId, financialYear } = this.getQuery();
    const updatedDoc = await this.model.findOne(this.getFilter());

    // Create a TDSMODEL if not exists
    const prevTDS = await TDSModel.findOne({
      empId,
      financialYear,
    });

    if (!prevTDS) {
      // If TDS document doesn't exist, create a new one
      const newTDS = await TDSModel.create({
        empId,
        financialYear,
        incomeFromSalarySource: updatedDoc._id,
        organizationId: updatedDoc.organizationId,
      });
      newTDS.save();
      return newTDS;
    } else {
      // If TDS document exists, update the incomeFromHouseProperty field
      prevTDS.incomeFromSalarySource = updatedDoc._id;

      await prevTDS.save();
    }
  } catch (error) {
    console.error(error);
  }
});

const IncomeFromSalary = mongoose.model("salaryIncome", IncomeFormSalarySchema);

module.exports = { IncomeFromSalary };
