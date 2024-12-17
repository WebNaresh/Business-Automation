const { default: mongoose } = require("mongoose");
const catchAssyncError = require("../../middleware/catchAssyncError");
const { TDSModel } = require("../../models/TDS/tdsSchema");
const { EmployeeModel } = require("../../models/employeeSchema");
const moment = require("moment");
const {
  OrganizationRelationModel,
} = require("../../models/org-rel-emp/organisationRelation");
const { OrganisationModel } = require("../../models/organizationSchema");

// within the finacial year and salary

exports.getTDSDetails = catchAssyncError(async (req, res, next) => {
  try {
    const { empId, financialYear } = req.params;

    const tds = await TDSModel.findOne({
      empId,
      financialYear,
    });

    return res.json(tds);
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message, status: false });
  }
});

// get Employee investment with overall salary

//TODO New TDS

exports.changeStatus = catchAssyncError(async (req, res, next) => {
  try {
    const organizationId = req.user.user.organizationId;
    const { financialYear } = req.params;
    const { empId, requestData, usersalary } = req.body;
    let isTDSExists = await TDSModel.findOne({
      empId,
      financialYear,
    });

    if (!isTDSExists) {
      isTDSExists = new TDSModel({
        empId,
        financialYear,
        organizationId,
        investment: [...requestData, { updatedAt: new Date.now() }],
      });
    } else {
      let investment = isTDSExists.investment.find(
        (sec) =>
          sec.name === requestData.name &&
          sec.sectionname === requestData.sectionname
      );

      let data = {
        ...requestData,
      };
      if (investment) {
        Object.assign(investment, data);
      } else {
        tds = isTDSExists.investment.push(data);
      }

      // console.log(tds, investment, "data");
    }
    const body = {
      empId,
      financialYear,
      organizationId,
      requestData,
      usersalary: usersalary,
    };
    console.log(requestData);
    await createInvestment(body, req, res, empId);

    await isTDSExists.save();
    return res.json({ message: "success" });
  } catch (error) {
    console.log(error);
  }
});

exports.changeRegime = catchAssyncError(async (req, res, next) => {
  try {
    const { financialYear } = req.params;
    const { regime } = req.body;
    const empId = req.user.user._id;
    const TDS = await TDSModel.findOneAndUpdate(
      {
        empId,
        financialYear,
      },
      {
        regime,
      },
      {
        new: true,
      }
    );

    return res.json({ message: "success", TDS });
  } catch (error) {}
});

const calculateNewRegimeTDSDetails = async (
  isTDSExists,
  empId,
  financialYear,
  usersalary,
  birthdate
) => {
  const age = moment().diff(moment(birthdate), "years");
  const tdsinvestments = isTDSExists;

  const salaryInvestment = tdsinvestments?.investment?.filter(
    (i) => i.sectionname === "Salary"
  );
  const salaryDeclaration = salaryInvestment?.reduce(
    (a, i) => (a += i.amountAccepted),
    0
  );

  const houseDeclaration =
    Number(getHouseDeclaration(tdsinvestments?.investment, "newRegime")) || 0;
  const otherInvestment =
    tdsinvestments?.investment?.filter(
      (i) => i.sectionname === "Otherincome"
    ) ?? [];
  const otherDeclaration = otherInvestment?.reduce((sum, item) => {
    if (
      item.name !== "Less : Deduction on Family Pension Income Sec. 57(IIA)"
    ) {
      return sum + item.amountAccepted;
    } else {
      return sum;
    }
  }, 0);

  const LessPension =
    otherInvestment.find(
      (item) =>
        item.name === "Less : Deduction on Family Pension Income Sec. 57(IIA)"
    )?.declaration ?? 0;
  const totalSum = otherDeclaration - LessPension;

  const sectionDeclaration = tdsinvestments?.investment?.find(
    (i) => i.subsectionname === "Section 80CCD NPS"
  );

  let salary = Number(usersalary) - 50000 < 0 ? 0 : Number(usersalary) - 50000;
  salary += salaryDeclaration;
  salary += totalSum;
  salary += Math.abs(houseDeclaration);
  salary -= sectionDeclaration?.amountAccepted ?? 0;
  console.log(`🚀 ~ sectionDeclaration:`, sectionDeclaration?.amountAccepted);
  console.log(`🚀 ~ salary:`, salary);
  const getTotalTaxableIncome = getNewRegimeTax(salary);

  return {
    salaryDeclaration,
    age,
    houseDeclaration,
    otherDeclaration: totalSum,
    sectionDeclaration: sectionDeclaration?.amountAccepted ?? 0,
    salary,
    regularTaxAmount: isNaN(getTotalTaxableIncome?.taxAmount)
      ? 0
      : getTotalTaxableIncome?.taxAmount,

    cess: isNaN(getTotalTaxableIncome?.cess) ? 0 : getTotalTaxableIncome?.cess,
    totalTaxableIncome: isNaN(getTotalTaxableIncome?.totalTaxableIncome)
      ? 0
      : getTotalTaxableIncome?.totalTaxableIncome,
  };
};

const calculateTDSDetails = async (
  isTDSExists,
  empId,
  financialYear,
  usersalary,
  birthdate,
  regime
) => {
  if (regime === "New Regime") {
    return calculateNewRegimeTDSDetails(
      isTDSExists,
      empId,
      financialYear,
      usersalary,
      birthdate
    );
  }

  const age = moment().diff(moment(birthdate), "years");

  const tdsinvestments = isTDSExists;

  const salaryInvestment = tdsinvestments?.investment?.filter(
    (i) => i.sectionname === "Salary"
  );

  const salaryDeclaration = salaryInvestment?.reduce(
    (a, i) => (a += i.amountAccepted),
    0
  );

  const houseDeclaration =
    Number(getHouseDeclaration(tdsinvestments?.investment, "oldRegime")) || 0;
  const otherInvestment =
    tdsinvestments?.investment?.filter(
      (i) => i.sectionname === "Otherincome"
    ) ?? [];
  const otherDeclaration = otherInvestment?.reduce((sum, item) => {
    if (
      item.name !== "Less : Deduction on Family Pension Income Sec. 57(IIA)"
    ) {
      return sum + item.amountAccepted;
    } else {
      return sum;
    }
  }, 0);

  const LessPension =
    otherInvestment.find(
      (item) =>
        item.name === "Less : Deduction on Family Pension Income Sec. 57(IIA)"
    )?.declaration ?? 0;
  const totalSum = otherDeclaration - LessPension;

  const sectionInvestment = tdsinvestments?.investment?.filter(
    (i) => i.sectionname === "SectionDeduction"
  );
  let section80C =
    sectionInvestment?.reduce(
      (a, i) =>
        i.subsectionname === "Section80" ? (a += i.amountAccepted) : a,
      0
    ) || 0;
  let section80CCD =
    sectionInvestment?.reduce(
      (a, i) =>
        i.subsectionname === "Section 80CCD NPS" ? (a += i.amountAccepted) : a,
      0
    ) || 0;
  let sectionOther =
    sectionInvestment?.reduce(
      (a, i) =>
        i.subsectionname === "Section80 50000"
          ? (a += Number(i.amountAccepted))
          : a,
      0
    ) || 0;

  section80C = section80C >= 150000 ? 150000 : section80C;
  section80CCD = section80CCD >= 50000 ? 50000 : section80CCD;
  const sectionDeclaration = section80C + section80CCD + sectionOther || 0;

  let salary = Number(usersalary) - 50000;
  console.log(`🚀 ~ usersalary:`, usersalary);

  if (regime !== "New Regime") {
    salary += totalSum;
    salary -= Math.abs(houseDeclaration);
  }
  salary += salaryDeclaration;
  salary -= sectionDeclaration;

  const getTotalTaxableIncome = getTax(age, salary);

  return {
    salaryDeclaration,
    age,
    houseDeclaration,
    otherDeclaration: totalSum,
    sectionDeclaration,
    salary,
    getTotalTaxableIncome: isNaN(getTotalTaxableIncome?.taxAmount)
      ? 0
      : getTotalTaxableIncome?.taxAmount,
    cess: isNaN(getTotalTaxableIncome?.cess) ? 0 : getTotalTaxableIncome?.cess,
  };
};

const createInvestment = async (body, req, res, empId) => {
  try {
    const organizationId = req.user.user.organizationId;
    const birthdate = req.user.user.date_of_birth;
    const currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let nextYear = currentYear + 1;

    if (currentDate.getMonth() < 3) {
      currentYear -= 1;
      nextYear -= 1;
    }

    const financialYear = `${currentYear}-${nextYear}`;
    const { requestData, usersalary } = body;

    let isTDSExists = await TDSModel.findOne({ empId, financialYear });

    if (!isTDSExists) {
      isTDSExists = new TDSModel({
        empId,
        financialYear,
        organizationId,
        investment: [requestData],
      });
    } else {
      let investment = isTDSExists.investment.find(
        (sec) =>
          sec?.name === requestData?.name &&
          sec?.sectionname === requestData?.sectionname
      );

      let data = { ...requestData };
      if (investment) {
        Object.assign(investment, data);
      } else {
        isTDSExists.investment.push(data);
      }

      // sending this tds for calculation might solve the problem
      // Calculate and update TDS details
      const tdsDetails = await calculateTDSDetails(
        isTDSExists,
        empId,
        financialYear,
        usersalary,
        birthdate,
        (regime = isTDSExists.regime)
      );
      Object.assign(isTDSExists, tdsDetails);
    }

    await isTDSExists.save();
    return res.json({ message: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to create or update TDS
exports.createInvestmentDeclaration = catchAssyncError(
  async (req, res, next) => {
    try {
      const empId = req.user.user._id;
      const organizationId = req.user.user.organizationId;
      const currentDate = new Date();
      let currentYear = currentDate.getFullYear();
      let nextYear = currentYear + 1;

      if (currentDate.getMonth() < 3) {
        currentYear -= 1;
        nextYear -= 1;
      }

      const financialYear = `${currentYear}-${nextYear}`;
      const { requestData, usersalary } = req.body;
      // createInvestment(req.body, req, res, empId);
      let tdsUpdate = await TDSModel.findOneAndUpdate(
        {
          empId,
          financialYear,
        },
        {
          empId,
          financialYear,
          usersalary,
          organizationId,
          $push: { investment: requestData },
        },
        {
          new: true,
          upsert: true,
        }
      );

      return res.status(200).json("Tds declaration uploaded successfully");
    } catch (error) {
      console.log(error);
    }
  }
);

// Function to get total TDS details
exports.getTotalTDSDetails = catchAssyncError(async (req, res, next) => {
  const empId = req.user.user._id;
  const birthdate = req.user.user.date_of_birth;
  const age = moment().diff(moment(birthdate), "years");
  const { financialYear, usersalary } = req.params;

  if (!empId || empId === undefined) {
    return res.json({ message: "Invalid employee" });
  }

  const tdsinvestments = await TDSModel.findOne({ empId, financialYear });

  const salaryInvestment = tdsinvestments?.investment?.filter(
    (i) => i.sectionname === "Salary"
  );
  const salaryDeclaration = salaryInvestment?.reduce(
    (a, i) => (a += i.amountAccepted),
    0
  );

  const houseValue = Number(
    getHouseDeclaration(tdsinvestments?.investment, "oldRegime")
  );

  const houseDeclaration = isNaN(houseValue) ? 0 : houseValue;
  const otherInvestment =
    tdsinvestments?.investment?.filter(
      (i) => i.sectionname === "Otherincome"
    ) ?? [];
  const otherDeclaration = otherInvestment?.reduce((sum, item) => {
    if (
      item.name !== "Less : Deduction on Family Pension Income Sec. 57(IIA)"
    ) {
      return isNaN(sum + item.amountAccepted) ? 0 : sum + item.amountAccepted;
    } else {
      return isNaN(sum) ? 0 : sum;
    }
  }, 0);

  const LessPension =
    otherInvestment.find(
      (item) =>
        item.name === "Less : Deduction on Family Pension Income Sec. 57(IIA)"
    )?.declaration ?? 0;
  const totalSum = isNaN(otherDeclaration - LessPension)
    ? 0
    : otherDeclaration - LessPension;

  const sectionInvestment = tdsinvestments?.investment?.filter(
    (i) => i.sectionname === "SectionDeduction"
  );
  let section80C =
    sectionInvestment?.reduce(
      (a, i) =>
        i.subsectionname === "Section80" ? (a += i.amountAccepted) : a,
      0
    ) || 0;
  let section80CCD =
    sectionInvestment?.reduce(
      (a, i) =>
        i.subsectionname === "Section 80CCD NPS" ? (a += i.amountAccepted) : a,
      0
    ) || 0;
  let sectionOther =
    sectionInvestment?.reduce(
      (a, i) =>
        i.subsectionname === "Section80 50000"
          ? (a += Number(i.amountAccepted))
          : a,
      0
    ) || 0;

  section80C = section80C >= 150000 ? 150000 : section80C;
  section80CCD = section80CCD >= 50000 ? 50000 : section80CCD;
  const sectionDeclaration = isNaN(section80C + section80CCD + sectionOther)
    ? 0
    : section80C + section80CCD + sectionOther;

  let salary = Number(usersalary) + salaryDeclaration - 50000;
  salary += totalSum;
  salary -= Math.abs(houseDeclaration);
  salary -= sectionDeclaration;
  console.log(`🚀 ~ salary:`, salary);

  const getTotalTaxableIncome = getTax(age, salary);

  // return {
  //   salaryDeclaration,
  //   houseDeclaration,
  //   otherDeclaration: totalSum,
  //   sectionDeclaration,
  //   salary,
  //   getTotalTaxableIncome,
  // };
  return res.json({
    salaryDeclaration,
    age,
    houseDeclaration,
    otherDeclaration: totalSum,
    sectionDeclaration,
    salary,
    getTotalTaxableIncome: isNaN(getTotalTaxableIncome?.taxAmount)
      ? 0
      : getTotalTaxableIncome?.taxAmount,
  });
});

exports.getSectionInvestmentDecalration = catchAssyncError(
  async (req, res, next) => {
    try {
      const empId = req.user.user._id;
      const { sectionname } = req.params;
      const currentDate = new Date();
      let currentYear = currentDate.getFullYear();
      let nextYear = currentYear + 1;

      if (currentDate.getMonth() < 3) {
        currentYear -= 1;
        nextYear -= 1;
      }

      const financialYear = `${currentYear}-${nextYear}`;
      const tdsinvestments = await TDSModel.findOne({
        empId,
        financialYear,
      });

      const investment = tdsinvestments?.investment?.filter(
        (i) => i.sectionname === sectionname
      );

      return res.json(investment);
    } catch (error) {
      console.log(error);
    }
  }
);

exports.getInvestmentDeclaration = catchAssyncError(async (req, res, next) => {
  try {
    const empId = req.user.user._id;
    const { page, search } = req.query;
    const currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let nextYear = currentYear + 1;
    const regex = new RegExp(search, "i");

    if (currentDate.getMonth() < 3) {
      currentYear -= 1;
      nextYear -= 1;
    }

    const financialYear = `${currentYear}-${nextYear}`;
    const tdsinvestments = await TDSModel.findOne({
      empId,
      financialYear,
    });

    const limit = 10;
    const offset = (page - 1) * limit;

    if (tdsinvestments?.investment) {
      const filteredInvestments = tdsinvestments.investment.filter((inv) =>
        regex.test(inv.name)
      );
      const paginatedInvestments = filteredInvestments.slice(
        offset,
        offset + limit
      );
      const totalPages = Math.ceil(filteredInvestments.length / limit);
      // Remove the investment property from tdsinvestments
      return res.json({
        investments: paginatedInvestments,
        allInvestment: tdsinvestments?.investment?.map((inv) => ({
          name: inv.name,
          amount: inv.amountAccepted,
          sectionname: inv.sectionname,
        })),
        // tds: tds,
        currentPage: page,
        totalPages: totalPages,
      });
    } else {
      return res.json({
        investments: [],

        currentPage: page,
        totalPages: 0,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// new one request which is used in new ui
exports.deleteInvestment = catchAssyncError(async (req, res, next) => {
  try {
    const { empId, financialYear, name } = req.body;

    if (!empId || !financialYear || !name) {
      return res.status(201).json({ message: "Attributes not found" });
    }

    const updatedInvestment = await TDSModel.findOneAndUpdate(
      { empId, financialYear },
      { $pull: { investment: { name: name } } },
      { new: true }
    );
    console.log(`🚀 ~ updatedInvestment:`, updatedInvestment);

    return res.json({ message: "Investment deleted successfully" });
  } catch (error) {
    console.log(error);
  }
});

exports.deleteInvestmentDecalration = catchAssyncError(
  async (req, res, next) => {
    try {
      const empId = req.user.user._id;
      const currentDate = new Date();
      let currentYear = currentDate.getFullYear();
      let nextYear = currentYear + 1;

      if (currentDate.getMonth() < 3) {
        currentYear -= 1;
        nextYear -= 1;
      }

      const financialYear = `${currentYear}-${nextYear}`;
      const { requestData } = req.body;
      console.log(`🚀 ~ requestData:`, requestData);

      let isTDSExists = await TDSModel.findOne({
        empId,
        financialYear,
      });

      if (!isTDSExists) {
        return res.json({ message: "No data found" });
      } else {
        let investment = isTDSExists?.investment?.find(
          (sec) =>
            sec?.name === requestData.name &&
            sec?.sectionname === requestData.sectionname
        );

        let data = {
          ...requestData,
        };
        if (investment) {
          Object.assign(investment, data);
        }
        // console.log(tds, investment, "data");
      }

      await isTDSExists.save();
      return res.json({ message: "success" });
    } catch (error) {
      console.log(error);
    }
  }
);

exports.getEmpUnderAccountant = catchAssyncError(async (req, res, next) => {
  const { profile } = req.params;

  const organizationId = req?.user?.user?.organizationId;

  let isAccountantExits = await EmployeeModel.find({
    organizationId,
  }).countDocuments();

  const isAccountant = await EmployeeModel.find({
    profile: { $elemMatch: { $eq: "Accountant" } },
    organizationId,
  });

  // profile for accountant
  if (profile === "Accountant") {
    const empUnderAccountant = await TDSModel.find({
      organizationId,
      empId: { $ne: req?.user?.user._id },
      "investment.status": "Pending",
    })
      .populate("empId")
      .select("empId");

    if (!empUnderAccountant || empUnderAccountant.length === 0) {
      return res.json([]);
    }
    return res.json(empUnderAccountant);
  }

  //for super admin
  if (profile === "Super-Admin" || profile === "Delegate-Super-Admin") {
    let getOrganizationIds = [];

    if (profile === "Super-Admin") {
      let delegateOrganizations = await EmployeeModel.find({
        creatorId: req.user.user._id,
      }).select("organizationId");

      let organizationIds = delegateOrganizations.map(
        (org) => org.organizationId
      );

      let organizationsWithoutAccountant = [];

      for (let orgId of organizationIds) {
        let accountantExists = await EmployeeModel.findOne({
          organizationId: orgId,
          profile: "Accountant",
        });
        if (!accountantExists) {
          organizationsWithoutAccountant.push(orgId);
        }
      }

      const empUnderAccountant = await TDSModel.find({
        organizationId: { $in: organizationsWithoutAccountant },
        "investment.status": "Pending",
      })
        .populate("empId")
        .select("empId");

      return res.json(empUnderAccountant);
    }

    if (profile === "Delegate-Super-Admin") {
      let getDelegate = await EmployeeModel.findById(req.user.user._id).select(
        "creatorId"
      );
      getOrganizationIds = await OrganisationModel.find({
        creator: getDelegate?.creatorId,
      }).select("_id");
    }

    const organizationIds = getOrganizationIds.map((item) =>
      item?._id?.toString()
    );

    const empIds = isAccountant?.map((item) => item._id);

    if (isAccountantExits === 1) {
      const empUnderAccountant = await TDSModel.find({
        empId: { $in: empIds },
        "investment.status": "Pending",
      })
        .populate("empId")
        .select("empId");

      return res.json(empUnderAccountant);
    }

    if (isAccountantExits < 1) {
      const empUnderAccountant = await TDSModel.find({
        organizationId: { $in: organizationIds },
        "investment.status": "Pending",
      })
        .populate("empId")
        .select("empId");
      return res.json(empUnderAccountant);
    }

    return res.json([]);
  }
});

// exports.getEmpUnderAccountant = catchAssyncError(async (req, res, next) => {
//   const { profile } = req.params;

//   const organizationId = req?.user?.user?.organizationId;

//   let isAccountantExits = await EmployeeModel.find({
//     organizationId,
//   }).countDocuments();

//   const isAccountant = await EmployeeModel.find({
//     profile: { $elemMatch: { $eq: "Accountant" } },
//     organizationId,
//   });

//   // profile for accountant
//   if (profile === "Accountant") {
//     const empUnderAccountant = await TDSModel.find({
//       organizationId,
//       empId: { $ne: req?.user?.user._id },
//       "investment.status": "Pending",
//     })
//       .populate("empId")
//       .select("empId");

//     if (!empUnderAccountant || empUnderAccountant.length === 0) {
//       return res.json([]);
//     }
//     return res.json(empUnderAccountant);
//   }

//   //for super admin
//   if (profile === "Super-Admin" || profile === "Delegate-Super-Admin") {
//     let getOrganizationIds = [];

//     if (profile === "Super-Admin") {
//       // Assuming req.user.user._id is the ID of the Delegate-Super-Admin
//       let delegateOrganizations = await EmployeeModel.find({
//         creatorId: req.user.user._id,
//       }).select("organizationId");

//       // Convert to array of organization IDs
//       let organizationIds = delegateOrganizations.map(
//         (org) => org.organizationId
//       );

//       // Find organizations without an accountant
//       let organizationsWithoutAccountant = [];
//       for (let orgId of organizationIds) {
//         let accountantExists = await EmployeeModel.findOne({
//           organizationId: orgId,
//           profile: "Accountant",
//         });
//         if (!accountantExists) {
//           organizationsWithoutAccountant.push(orgId);
//         }
//       }

//       // Fetch employees from organizations without an accountant
//       const empUnderAccountant = await TDSModel.find({
//         organizationId: { $in: organizationsWithoutAccountant },
//         "investment.status": "Pending",
//       })
//         .populate("empId")
//         .select("empId");

//       return res.json(empUnderAccountant);
//     }

//     if (profile === "Delegate-Super-Admin") {
//       let getDelegate = await EmployeeModel.findById(req.user.user._id).select(
//         "creatorId"
//       );
//       getOrganizationIds = await OrganisationModel.find({
//         creator: getDelegate?.creatorId,
//       }).select("_id");
//     }

//     const organizationIds = getOrganizationIds.map((item) =>
//       item?._id?.toString()
//     );

//     const empIds = isAccountant?.map((item) => item._id);

//     if (isAccountantExits === 1) {
//       const empUnderAccountant = await TDSModel.find({
//         empId: { $in: empIds },
//         "investment.status": "Pending",
//       })
//         .populate("empId")
//         .select("empId");

//       return res.json(empUnderAccountant);
//     }
//     if (isAccountantExits < 1) {
//       const empUnderAccountant = await TDSModel.find({
//         organizationId: { $in: organizationIds },
//         "investment.status": "Pending",
//       })
//         .populate("empId")
//         .select("empId");
//       return res.json(empUnderAccountant);
//     } else {
//       const isAccountantExits = await EmployeeModel.find({
//         organizationId: req.user.user.organizationId,
//         profile: { $elemMatch: { $eq: "Accountant" } },
//       });

//       const accountantData = isAccountantExits
//         .filter((item) => item.profile.includes("Accountant"))
//         .map((item) => item._id.toString());

//       const getAllAccountantsProfile = await TDSModel.find({
//         "investment.status": "Pending",
//         empId: { $in: accountantData },
//         organizationId: { $in: organizationIds },
//       })
//         .populate("empId")
//         .select("empId");
//       return res.json([]);
//     }
//   }
// });

exports.getTDSForEmployee = catchAssyncError(async (req, res, next) => {
  try {
    const { empId, financialYear } = req.params;

    console.log(`🚀 ~ empId:`, empId); // Log the empId

    if (!empId || empId === undefined) {
      return res.json({ message: "Invalid employee" });
    }

    const getTDSDeclarations = await TDSModel.findOne({
      empId,
      financialYear,
      "investment.status": "Pending",
    }).select("investment");

    if (!getTDSDeclarations) {
      return res.json([]);
    }

    const approvals = getTDSDeclarations?.investment?.filter(
      (tds) => tds.status === "Pending"
    );

    return res.json({ investment: approvals });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// exports.getCountNotificatins = catchAssyncError(async (req, res, next) => {
//   try {
//     const { financialYear, role } = req.params;

//     let notification = 0;

//     if (role === "Accountant") {
//       const getTDSDeclarations = await TDSModel.aggregate([
//         {
//           $match: {
//             organizationId: mongoose.Types.ObjectId(
//               req.user.user.organizationId
//             ),
//             financialYear,
//           },
//         },
//         { $unwind: "$investment" },
//         { $match: { "investment.status": "Pending" } },
//       ]);

//       notification = getTDSDeclarations.length;
//     } else {
//       const getTDsDeclartions = await TDSModel.findOne({
//         empId: req.user.user._id,
//         financialYear,
//       }).select("investment");

//       const data = getTDsDeclartions?.investment?.filter(
//         (est) =>
//           !est.isRead &&
//           est.status !== "Pending" &&
//           est.status !== "Not Submitted"
//       );
//       notification = data?.length;
//     }

//     return res.json(notification);
//   } catch (err) {
//     console.log(err);
//   }
// });

exports.getCountNotificatins = catchAssyncError(async (req, res, next) => {
  try {
    const { role: profile } = req.params;
    const organizationId = req?.user?.user?.organizationId;
    const isAccountant = await EmployeeModel.find({
      profile: { $elemMatch: { $eq: "Accountant" } },
      organizationId,
    });

    if (profile === "Employee") {
      const getTDsDeclartions = await TDSModel.findOne({
        empId: req.user.user._id,
        financialYear,
      }).select("investment");
      const data = getTDsDeclartions?.investment?.filter(
        (est) =>
          !est.isRead &&
          est.status !== "Pending" &&
          est.status !== "Not Submitted"
      );

      return res.status(200).json(data?.length);
    }

    // profile for accountant
    if (profile === "Accountant") {
      const empUnderAccountant = await TDSModel.find({
        organizationId,
        empId: { $ne: req?.user?.user._id },
        "investment.status": "Pending",
      });

      if (!empUnderAccountant || empUnderAccountant.length === 0) {
        return res.json(0);
      }
      return res.json(empUnderAccountant?.length);
    }

    //for super admin
    if (profile === "Super-Admin" || profile === "Delegate-Super-Admin") {
      let getOrganizationIds = [];

      if (profile === "Super-Admin") {
        // Assuming req.user.user._id is the ID of the Delegate-Super-Admin
        let delegateOrganizations = await EmployeeModel.find({
          creatorId: req.user.user._id,
        }).select("organizationId");

        // Convert to array of organization IDs
        let organizationIds = delegateOrganizations.map(
          (org) => org.organizationId
        );

        // Find organizations without an accountant
        let organizationsWithoutAccountant = [];
        for (let orgId of organizationIds) {
          let accountantExists = await EmployeeModel.findOne({
            organizationId: orgId,
            profile: "Accountant",
          });
          if (!accountantExists) {
            organizationsWithoutAccountant.push(orgId);
          }
        }

        // Fetch employees from organizations without an accountant
        const empUnderAccountant = await TDSModel.find({
          organizationId: { $in: organizationsWithoutAccountant },
          "investment.status": "Pending",
        }).populate("empId");
        console.log(`🚀 ~ empUnderAccountant:`, empUnderAccountant);

        const count = empUnderAccountant?.reduce((acc, i) => {
          // Filter the investments to include only those with a status of "pending"
          const pendingInvestments =
            i?.investment?.filter((inv) => inv.status === "Pending") || [];
          // Add the length of the filtered investments to the accumulator
          return acc + pendingInvestments.length;
        }, 0);

        return res.json(count);
      }

      if (profile === "Delegate-Super-Admin") {
        let getDelegate = await EmployeeModel.findById(
          req.user.user._id
        ).select("creatorId");
        getOrganizationIds = await OrganisationModel.find({
          creator: getDelegate?.creatorId,
        }).select("_id");
      }

      const organizationIds = getOrganizationIds.map((item) =>
        item?._id?.toString()
      );

      const empIds = isAccountant?.map((item) => item._id);

      if (isAccountant === 1) {
        const empUnderAccountant = await TDSModel.find({
          empId: { $in: empIds },
          "investment.status": "Pending",
        });

        return res.json(empUnderAccountant?.length);
      }
    }
    return res.json(0);
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});

exports.getTDSForEmployeeNotify = catchAssyncError(async (req, res, next) => {
  try {
    const { empId, financialYear, status = "Approved" } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    if (!empId || empId === undefined) {
      return res.json({ message: "Invalid employee" });
    }

    const getTDSDeclarations = await TDSModel.findOne({
      empId,
      financialYear,
    }).select("investment");

    if (!getTDSDeclarations) {
      return res.json([]);
    }

    const data = getTDSDeclarations.investment.filter(
      (est) =>
        !est.isRead &&
        est.status !== "Pending" &&
        est.status !== "Not Submitted"
    );

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = data.slice(startIndex, endIndex);

    return res.json({
      data: results,
      currentPage: page,
      totalPages: Math.ceil(data.length / limit),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

exports.getTotalDeclarations = catchAssyncError(async (req, res, next) => {
  const empId = req.user.user._id;
  const { financialYear } = req.params;

  const tdsinvestments = await TDSModel.findOne({
    empId,
    financialYear,
  });

  const otherInvestment = tdsinvestments?.investment?.filter(
    (i) => i.sectionname === "Otherincome"
  );
  const salary = tdsinvestments?.investment?.filter(
    (i) => i.sectionname === "Salary"
  );
  const house = tdsinvestments?.investment?.filter(
    (i) => i.sectionname === "House"
  );
  const section = tdsinvestments?.investment?.filter(
    (i) => i.sectionname === "SectionDeduction"
  );

  let Other = otherInvestment?.reduce((sum, item) => {
    return sum + item.declaration;
  }, 0);
  let Salary = salary?.reduce((sum, item) => {
    return sum + item.declaration;
  }, 0);
  let House = house?.reduce((sum, item) => {
    return sum + item.declaration;
  }, 0);
  let Section = section?.reduce((sum, item) => {
    return sum + item.declaration;
  }, 0);

  const amountAccepted = tdsinvestments?.investment?.reduce((a, i) => {
    if (i.status === "Approved") {
      return (a += i.amountAccepted);
    } else {
      return a;
    }
  }, 0);

  const amountRejected = tdsinvestments?.investment?.reduce((a, i) => {
    if (i.status === "Reject") {
      return (a += i.declaration);
    } else {
      return a;
    }
  }, 0);
  const amountPending = tdsinvestments?.investment?.reduce((a, i) => {
    if (i.status === "Pending") {
      return (a += i.declaration);
    } else {
      return a;
    }
  }, 0);

  const DeclaredAmount = tdsinvestments?.investment?.reduce((a, i) => {
    return (a += i.declaration);
  }, 0);

  return res.json({
    amountAccepted,
    DeclaredAmount,
    amountRejected,
    amountPending,
    Section,
    House,
    Other,
    Salary,
  });
});

// exports.getTotalTDSDetails = catchAssyncError(async (req, res, next) => {
//   const empId = req.user.user._id;
//   const birthdate = req.user.user.date_of_birth;

//   const age = moment().diff(moment(birthdate), "years");

//   const { financialYear, usersalary } = req.params;

//   if (!empId || empId === undefined) {
//     return res.json({ message: "Invalid employee" });
//   }

//   const tdsinvestments = await TDSModel.findOne({
//     empId,
//     financialYear,
//   });

//   const salaryInvestment = tdsinvestments?.investment?.filter(
//     (i) => i.sectionname === "Salary"
//   );
//   const salaryDeclaration = salaryInvestment?.reduce((a, i) => {
//     return (a -= i.amountAccepted);
//   }, 0);
//   console.log(`🚀 ~ salaryDeclaration:`, tdsinvestments?.investment);

//   const houseDeclaration = Number(
//     getHouseDeclaration(tdsinvestments?.investment, "oldRegime")
//   );
//   0;
//   const otherInvestment =
//     tdsinvestments?.investment?.filter(
//       (i) => i.sectionname === "Otherincome"
//     ) ?? [];
//   const otherDeclaration = otherInvestment?.reduce((sum, item) => {
//     if (
//       item.name !== "Less : Deduction on Family Pension Income Sec. 57(IIA)"
//     ) {
//       return sum + item.amountAccepted;
//     } else {
//       return sum;
//     }
//   }, 0);

//   const LessPension =
//     otherInvestment.find(
//       (item) =>
//         item.name === "Less : Deduction on Family Pension Income Sec. 57(IIA)"
//     )?.declaration ?? 0;

//   const totalSum = otherDeclaration - LessPension;

//   const sectionInvestment = tdsinvestments?.investment?.filter(
//     (i) => i.sectionname === "SectionDeduction"
//   );

//   let section80C = sectionInvestment?.reduce((a, i) => {
//     if (i.subsectionname === "Section80") {
//       return (a += i.amountAccepted);
//     } else {
//       return a;
//     }
//   }, 0);

//   let section80CCD = sectionInvestment?.reduce((a, i) => {
//     if (i.subsectionname === "Section 80CCD NPS") {
//       return (a += i.amountAccepted);
//     } else {
//       return a;
//     }
//   }, 0);

//   let sectionOther = sectionInvestment?.reduce((a, i) => {
//     if (i.subsectionname === "Section80 50000") {
//       return (a += Number(i.amountAccepted));
//     } else {
//       return a;
//     }
//   }, 0);
//   section80C = section80C >= 150000 ? 150000 : section80C;
//   section80CCD = section80CCD >= 50000 ? 50000 : section80CCD;

//   const sectionDeclaration = section80C + section80CCD + sectionOther ?? 0;

//   let salary = Number(usersalary) + salaryDeclaration - 50000;
//   salary += totalSum;
//   salary -= Math.abs(houseDeclaration);
//   salary -= sectionDeclaration;

//   const getTotalTaxableIncome = getTax(age, salary);
//   return res.json({
//     salaryDeclaration,
//     age,
//     houseDeclaration,
//     otherDeclaration: totalSum,
//     sectionDeclaration,
//     salary,
//     getTotalTaxableIncome,
//   });
// });

exports.getNewTotalTDSDetails = catchAssyncError(async (req, res, next) => {
  const empId = req.user.user._id;
  const birthdate = req.user.user.birthdate;

  const age = moment().diff(moment(birthdate), "years");

  const { financialYear, usersalary } = req.params;

  if (!empId || empId === undefined) {
    return res.json({ message: "Invalid employee" });
  }

  const tdsinvestments = await TDSModel.findOne({
    empId,
    financialYear,
  });

  const salaryInvestment = tdsinvestments?.investment?.filter(
    (i) => i.sectionname === "Salary"
  );

  const salaryDeclaration = salaryInvestment?.reduce((a, i) => {
    return (a += i.amountAccepted);
  }, 0);

  const houseDeclaration = Number(
    getHouseDeclaration(tdsinvestments?.investment, "newRegime")
  );
  0;
  const otherInvestment = tdsinvestments?.investment?.filter(
    (i) => i.sectionname === "Otherincome"
  );
  const otherDeclaration = otherInvestment
    ? otherInvestment?.reduce((sum, item) => {
        if (
          item.name !== "Less : Deduction on Family Pension Income Sec. 57(IIA)"
        ) {
          return sum + item.amountAccepted;
        } else {
          return sum;
        }
      }, 0)
    : 0;

  const LessPension = otherInvestment
    ? otherInvestment?.find(
        (item) =>
          item.name === "Less : Deduction on Family Pension Income Sec. 57(IIA)"
      )?.declaration
    : 0;

  const totalSum = otherDeclaration - LessPension;

  const sectionDeclaration =
    tdsinvestments?.investment?.filter(
      (i) =>
        i.name ===
        "Less: Additional Deduction under Sec 80CCD NPS (Max. ₹ 50,000/-)"
    )?.amountAccepted ?? 0;

  console.log(`🚀 ~ sectionDeclaration:`, sectionDeclaration);

  let salary = Number(usersalary) - 50000 < 0 ? 0 : Number(usersalary) - 50000;
  salary += totalSum;
  salary += Math.abs(houseDeclaration);
  salary -= sectionDeclaration;

  const getTotalTaxableIncome = getTax(age, salary);
  return res.json({
    salaryDeclaration,
    age,
    houseDeclaration,
    otherDeclaration: totalSum,
    sectionDeclaration,
    salary,
    getTotalTaxableIncome,
  });
});

function getTax(age, salary) {
  let taxAmount = 0;
  let cess = 0;
  let tax = 0;
  if (age < 60) {
    if (salary <= 500000) {
      cess = 0;
      taxAmount = 0;
      tax = 0;
      return;
    }

    if (salary > 250000 && salary > 500000) {
      let currentTax = 12500;
      taxAmount += currentTax;
    } else {
      let currentTax = (salary - 250000) * 0.05;
      taxAmount += currentTax;
    }

    if (salary > 500000 && salary > 1000000) {
      let currentTax = 100000;
      taxAmount += currentTax;
    } else if (salary > 500000 && salary < 1000000) {
      let currentTax = (salary - 500000) * 0.2;
      taxAmount += currentTax;
    }
    if (salary > 1000000) {
      let currentTax = (salary - 1000000) * 0.3;
      taxAmount += currentTax;
    }

    cess = taxAmount * 0.04;
    tax = taxAmount + cess;
  }

  if (age > 60 && age <= 80) {
    if (salary <= 500000) {
      cess = 0;
      taxAmount = 0;
      tax = 0;
      return;
    }

    if (salary > 300001 && salary > 500000) {
      let currentTax = 10000;
      taxAmount += currentTax;
    } else {
      let currentTax = (salary - 300001) * 0.05;
      taxAmount += currentTax;
    }

    if (salary > 500000 && salary > 1000000) {
      let currentTax = 100000;
      taxAmount += currentTax;
    } else {
      let currentTax = (salary - 500000) * 0.2;
      taxAmount += currentTax;
    }
    if (salary > 1000000) {
      let currentTax = (salary - 1000000) * 0.3;
      taxAmount += currentTax;
    }

    cess = taxAmount * 0.04;
    tax = taxAmount + cess;
  }

  if (age > 80) {
    if (salary <= 500000) {
      cess = 0;
      taxAmount = 0;
      tax = 0;
      return;
    }

    if (salary > 500000 && salary > 1000000) {
      let currentTax = 100000;
      taxAmount += currentTax;
    } else {
      let currentTax = (salary - 500000) * 0.2;
      taxAmount += currentTax;
    }
    if (salary > 1000000) {
      let currentTax = (salary - 1000000) * 0.3;
      taxAmount += currentTax;
    }

    cess = taxAmount * 0.04;
    tax = taxAmount + cess;
  }

  const getCess = isNaN(cess) ? 0 : cess;
  const getTaxAmount = isNaN(taxAmount) ? 0 : taxAmount;

  return {
    cess: getCess,
    taxAmount: getTaxAmount,
  };
}

function getNewRegimeTax(salary) {
  console.log(`🚀 ~ salary:`, salary);
  let taxAmount = 0;
  let cess = 0;
  let tax = 0;

  if (salary <= 700000) {
    return {
      cess: 0,
      taxAmount: 0,
      tax: 0,
    };
  }

  if (salary > 300000) {
    if (salary > 300000 && salary > 600000) {
      let currentTax = 15000;
      taxAmount += currentTax;
    } else {
      let currentTax = (salary - 300000) * 0.05;
      taxAmount += currentTax;
    }
  }

  if (salary > 600001) {
    if (salary > 600001 && salary > 900000) {
      let currentTax = 30000;
      taxAmount += currentTax;
    } else {
      let currentTax = (salary - 600000) * 0.1;
      taxAmount += currentTax;
    }
  }

  if (salary > 900001) {
    if (salary > 900001 && salary > 1200000) {
      let currentTax = 45000;
      taxAmount += currentTax;
    } else {
      let currentTax = (salary - 900000) * 0.15;
      taxAmount += currentTax;
    }
  }

  if (salary > 1200000) {
    let currentTax = (salary - 1200000) * 0.2;
    taxAmount += currentTax;
  }
  console.log(`🚀 ~ taxAmount:`, taxAmount);

  let getRebate = salary - 700000;

  if (getRebate < taxAmount) {
    cess = getRebate * 0.04;
    tax = getRebate + cess;
  } else {
    cess = taxAmount * 0.04;
    tax = taxAmount + cess;
  }

  return {
    cess: isNaN(cess) ? 0 : cess,
    taxAmount: isNaN(taxAmount) ? 0 : taxAmount,
    rebateAmount: getRebate,
    totalTaxableIncome: salary,
  };
}

function getHouseDeclaration(tds, regime) {
  const selfHouse = tds?.filter(
    (i) =>
      i.sectionname === "House" &&
      i.subsectionname === "(A) Self Occupied Property (Loss)"
  );
  const sec1 = selfHouse?.reduce((a, i) => {
    return (a += i.amountAccepted ?? 0);
  }, 0);

  const property1 =
    tds?.filter(
      (i) =>
        i.sectionname === "House" &&
        i.subsectionname === "(B) Let out property (Enter name of Property)"
    ) ?? [];
  const netDeduction =
    (property1[0]?.amountAccepted ?? 0) - (property1[1]?.amountAccepted ?? 0);

  const stdAmount = (netDeduction * 30) / 100;

  const property1Deduction =
    netDeduction - stdAmount - (property1[2]?.amountAccepted ?? 0) ?? [];

  const property2 =
    tds?.filter(
      (i) =>
        i.sectionname === "House" &&
        i.subsectionname === "(C) Let out property (Enter name of Property)"
    ) ?? [];

  const netDeduction2 =
    (property2[0]?.amountAccepted ?? 0) - (property2[1]?.amountAccepted ?? 0);

  const stdAmount2 = (netDeduction2 * 30) / 100;

  const property1Deduction2 =
    netDeduction2 - stdAmount2 - (property2[2]?.amountAccepted ?? 0) > 0
      ? netDeduction2 - stdAmount2 - (property2[2]?.amountAccepted ?? 0)
      : 0;

  let totalDeductionUnderHouse = 0;
  if (regime === "newRegime") {
    totalDeductionUnderHouse += property1Deduction + property1Deduction2;
  } else {
    totalDeductionUnderHouse += property1Deduction + property1Deduction2 - sec1;
  }

  return totalDeductionUnderHouse ?? 0; // If totalDeductionUnderHouse is undefined, default to 0
}
