const catchAssyncError = require("../../middleware/catchAssyncError");
const { IncomeFromSalary } = require("../../models/TDS/incomeFromSalaryModel");

exports.createIncomeSalary = catchAssyncError(async (req, res, next) => {
  try {
    const { empId, financialYear, name, requestData } = req.body;

    let IncomeSalary = await IncomeFromSalary.findOneAndUpdate(
      { empId, financialYear },
      {},
      { upsert: true, new: true }
    );

    let investment = IncomeSalary.investmentType.find(
      (sec) => sec.name === name
    );

    if (!investment) {
      investment = { name: name, ...requestData }; // Initialize investmentType array with requestData
      IncomeSalary.investmentType.push(investment);
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

    await IncomeSalary.save();

    return res.json(IncomeSalary);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.getSalaryIncome = catchAssyncError(async (req, res, next) => {
  try {
    const empId = req.user.user._id;
    const { financialYear } = req.params;

    let incomeFromSalary = await IncomeFromSalary.findOne({
      empId,
      financialYear,
    });

    let data = 0;
    incomeFromSalary.investmentType.forEach((investmentType) => {
      data += investmentType.declaration;
    });

    return res.json({
      incomeFromSalary,
      totalDeductions: data,
    });
  } catch (error) {
    console.log(error);
  }
});
