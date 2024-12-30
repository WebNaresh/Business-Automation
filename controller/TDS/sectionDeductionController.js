const catchAssyncError = require("../../middleware/catchAssyncError");
const { sectionModel } = require("../../models/TDS/sectionTDSModel");

exports.createSectionDeduction = catchAssyncError(async (req, res, next) => {
  try {
    const {
      empId,
      financialYear,
      sectionName,
      investmentTypeName,
      requestData,
    } = req.body;

    let SectionModel = await sectionModel.findOneAndUpdate(
      { empId, financialYear },
      {},
      { upsert: true, new: true }
    );

    let section = SectionModel.section.find(
      (sec) => sec.sectionName === sectionName
    );

    if (!section) {
      section = {
        sectionName,
        investmentType: [{ name: investmentTypeName, ...requestData }],
        // Initialize investmentType array with requestData
      };
      SectionModel.section.push(section);
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

    await SectionModel.save();

    return res.json(SectionModel);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.getSectionDeduction = catchAssyncError(async (req, res, next) => {
  try {
    const empId = req.user.user._id;
    const { financialYear } = req.params;

    let Section = await sectionModel.findOne({
      empId,
      financialYear,
    });

    return res.json({
      sectionData: Section,
    });
  } catch (error) {
    console.log(error);
  }
});
