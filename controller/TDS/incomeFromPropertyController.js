const catchAssyncError = require("../../middleware/catchAssyncError");
const {
  IncomeFromHouseSchemaModel,
} = require("../../models/TDS/IncomeFromHouseModel");

exports.createIncomeHouseProperty = catchAssyncError(async (req, res, next) => {
  try {
    const {
      empId,
      financialYear,
      sectionName,
      investmentTypeName,
      requestData,
    } = req.body;

    let incomeFromHouse = await IncomeFromHouseSchemaModel.findOneAndUpdate(
      { empId, financialYear },
      {},
      { upsert: true, new: true }
    );

    let section = incomeFromHouse.section.find(
      (sec) => sec.sectionName === sectionName
    );

    if (!section) {
      section = {
        sectionName,
        investmentType: [{ name: investmentTypeName, ...requestData }], // Initialize investmentType array with requestData
      };
      incomeFromHouse.section.push(section);
    } else {
      let investmentType = section.investmentType.find(
        (invType) => invType.name === investmentTypeName
      );

      if (investmentType) {
        Object.assign(investmentType, requestData);
      } else {
        section.investmentType.push({
          name: investmentTypeName,
          ...requestData,
        });
      }
    }

    await incomeFromHouse.save();

    return res.json(incomeFromHouse);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.deleteIncomeHouseProperty = catchAssyncError(async (req, res, next) => {
  try {
    const { empId, financialYear, sectionName, investmentTypeName } = req.body;

    const requestData = {
      property1: 0,
      property2: 0,
      declaration: 0,
      proof: "",
      status: "Not Submitted",
    };

    let incomeFromHouse = await IncomeFromHouseSchemaModel.findOneAndUpdate(
      { empId, financialYear },
      {},
      { upsert: true, new: true }
    );

    let section = incomeFromHouse.section.find(
      (sec) => sec.sectionName === sectionName
    );

    if (!section) {
      section = {
        sectionName,
        investmentType: [{ name: investmentTypeName, ...requestData }],
        // Initialize investmentType array with requestData
      };
      incomeFromHouse.section.push(section);
    } else {
      let investmentType = section.investmentType.find(
        (invType) => invType.name === investmentTypeName
      );

      if (investmentType) {
        Object.assign(investmentType, requestData);
      } else {
        section.investmentType.push({
          name: investmentTypeName,
          ...requestData,
        });
      }
    }

    await incomeFromHouse.save();

    return res.json(incomeFromHouse);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.getIncomeHouseProperty = catchAssyncError(async (req, res, next) => {
  try {
    const empId = req.user.user._id;
    const { financialYear } = req.params;
    let amountApproved = 0;

    let incomeFromHouse = await IncomeFromHouseSchemaModel.findOne({
      empId,
      financialYear,
    });

    if (!incomeFromHouse) {
      console.log("runs");
      return res.json({ message: "no data found" });
    }

    let firstSectionDeclarationSum = getValueBySectionName(
      "(A) Self Occupied Property (Loss)",
      incomeFromHouse
    );

    const section1 = incomeFromHouse?.section?.find(
      (section) => section?.sectionName === "(A) Self Occupied Property (Loss)"
    );

    section1?.investmentType.forEach((investmentType) => {
      if (investmentType.status === "Approved") {
        amountApproved += investmentType.declaration;
      }
    });

    section1?.investmentType.forEach((investmentType) => {
      amountApproved += investmentType.declaration;
    });

    const section2 = incomeFromHouse?.section?.find(
      (section) =>
        section?.sectionName === "(B) Let out property (Enter name of Property)"
    );

    const section3 = incomeFromHouse?.section?.find(
      (section) =>
        section?.sectionName === "(C) Let out property (Enter name of Property)"
    );

    const section2Data = getPropertyValues(section2);
    const section3Data = getPropertyValues(section3);

    const totalHeads =
      firstSectionDeclarationSum -
      section2Data.ActualDeductedValue -
      section3Data.ActualDeductedValue;

    return res.json({
      incomeFromHouse,
      firstSectionDeclarationSum,
      amountApproved,
      secondData2: { ...section2Data },
      secondData3: { ...section3Data },
      totalHeads,
    });
  } catch (error) {
    console.log(error);
  }
});

function getValueBySectionName(name, incomeFromHouse) {
  let data = 0;
  const selfOccupiedPropertySection = incomeFromHouse?.section?.find(
    (section) => section?.sectionName === name
  );

  if (selfOccupiedPropertySection) {
    selfOccupiedPropertySection?.investmentType.forEach((investmentType) => {
      data += investmentType.declaration;
    });

    if (
      selfOccupiedPropertySection?.sectionName ===
      "(A) Self Occupied Property (Loss)"
    ) {
      if (data > 200000) {
        data = 200000;
      }
    }
  }

  return data;
}

function getPropertyValues(sec) {
  const netValue =
    sec.investmentType[0].declaration - sec.investmentType[1].declaration;

  const deductedAmount = (netValue * 30) / 100;

  const ActualDeductedValue = sec.investmentType[2].declaration
    ? netValue - deductedAmount - sec.investmentType[2].declaration
    : netValue - deductedAmount;

  return {
    ActualDeductedValue,
    deductedAmount,
    netValue,
  };
}
