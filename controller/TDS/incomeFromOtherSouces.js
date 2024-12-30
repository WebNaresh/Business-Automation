const catchAssyncError = require("../../middleware/catchAssyncError");
const {
  IncomeFromOtherSourcesModel,
} = require("../../models/TDS/incomeFromOtherSource");

exports.deleteIncomeOtherSources = catchAssyncError(async (req, res, next) => {
  try {
    const { empId, financialYear, investmentTypeName } = req.body;

    const requestData = {
      declaration: 0,
      proof: "",
      status: "Not Submitted",
    };

    let incomeFromOtherSources =
      await IncomeFromOtherSourcesModel.findOneAndUpdate(
        { empId, financialYear },
        {},
        { upsert: true, new: true }
      );

    let investment = incomeFromOtherSources.investmentType.find(
      (sec) => sec.name === investmentTypeName
    );

    if (investmentTypeName === "Family Pension") {
      let isPensionExists = incomeFromOtherSources.investmentType.find(
        (sec) =>
          sec.name === "Less : Deduction on Family Pension Income Sec. 57(IIA)"
      );

      let pension = {
        declaration: 0,
        proof: "-",
        status: "Complete family session first",
      };

      Object.assign(isPensionExists, pension);
    }
    if (investment) {
      Object.assign(investment, requestData);
    } else {
      incomeFromOtherSources.investmentType.push({
        name: investmentTypeName,
        ...requestData,
      });
    }

    await incomeFromOtherSources.save();

    return res.json(incomeFromOtherSources);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.createIncomeOtherSources = catchAssyncError(async (req, res, next) => {
  try {
    const { empId, financialYear, name, requestData } = req.body;
    const organizationId = req.user.user.organizationId;

    let incomeFromOtherSources =
      await IncomeFromOtherSourcesModel.findOneAndUpdate(
        { empId, financialYear, organizationId },
        {},
        { upsert: true, new: true }
      );

    let investment = incomeFromOtherSources.investmentType.find(
      (sec) => sec.name === name
    );

    if (name === "Family Pension") {
      let isPensionExists = incomeFromOtherSources.investmentType.find(
        (sec) =>
          sec.name === "Less : Deduction on Family Pension Income Sec. 57(IIA)"
      );
      let declaration =
        requestData.declaration < 1
          ? 0
          : requestData.declaration <= 15000
          ? Math.round((requestData.declaration * 33.33) / 100)
          : 15000;

      let pension = {
        declaration: declaration,
        proof: "-",
        status: "Auto",
      };

      if (isPensionExists) {
        Object.assign(isPensionExists, pension);
      } else {
        incomeFromOtherSources.investmentType.push({
          name: "Less : Deduction on Family Pension Income Sec. 57(IIA)",
          ...pension,
        });
      }
    }

    if (!investment) {
      investment = { name: name, ...requestData }; // Initialize investmentType array with requestData
      incomeFromOtherSources.investmentType.push(investment);
    } else {
      let investmentType = investment.name === name;

      if (investmentType) {
        Object.assign(investment, requestData);
      } else {
        investment.push({
          name: name,
          ...requestData,
        });
      }
    }

    await incomeFromOtherSources.save();

    return res.json(incomeFromOtherSources);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.getOtherIncome = catchAssyncError(async (req, res, next) => {
  try {
    const empId = req.user.user._id;

    const { financialYear } = req.params;

    let incomeFromOther = await IncomeFromOtherSourcesModel.findOne({
      empId,

      financialYear,
    });

    let totalAddition = getTotalIncome(incomeFromOther);

    return res.json({
      incomeFromOther,
      totalAddition,
    });
  } catch (error) {
    console.log(error);
  }
});

function getTotalIncome(incomeFromOther) {
  let data = 0;
  let deduction = 0;

  incomeFromOther.investmentType.forEach((investmentType) => {
    if (investmentType.name !== "Income taxable under the head Other Sources") {
      if (investmentType) {
        if (
          investmentType.name ===
          "Less : Deduction on Family Pension Income Sec. 57(IIA)"
        ) {
          deduction = investmentType.declaration;
        } else {
          data += investmentType.declaration;
        }
      } else {
        data += declaration;
      }
    }
  });

  return data - deduction;
}
