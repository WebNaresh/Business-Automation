const { default: mongoose } = require("mongoose");
const catchAssyncError = require("../../middleware/catchAssyncError");
const { OrgDocuments } = require("../../models/DocManagement/OrgDocumentModal");
const { generateSignedUrlToUploadOrgDocs } = require("../../s3");
const {
  EmployeeManagementModel,
} = require("../../models/employeManager/employeeManagementSchema");
const { LetterTypes } = require("../../models/LetterTypes/LetterTypeModal");
const { OrganisationModel } = require("../../models/organizationSchema");

exports.addDocument = catchAssyncError(async (req, res, next) => {
  const { title, details, applicableDate, url, type, header, footer } =
    req.body;
  try {
    const newDoc = new OrgDocuments({
      title,
      details,
      type,
      applicableDate,
      header,
      footer,
      url,
      organizationId: req.user.user.organizationId,
      creatorId: req.user.user._id,
    });

    await newDoc.save();
    res.status(200).json({
      message: `Documents Added Successfully.`,
      doc: newDoc,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
exports.getDocuments = catchAssyncError(async (req, res, next) => {
  try {
    const docs = await OrgDocuments.find({});
    res.status(200).json({
      doc: docs,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

exports.getNotificationManager = catchAssyncError(async (req, res, next) => {
  try {
    const letterTypes = await LetterTypes.find({
      organizationId: req.user.user.organizationId,
    });

    const types = [
      "EmploymentOfferLetter",
      "AppointmentLetter",
      "PromotionLetter",
      "TransferLetter",
      "TerminationLetter",
      "ResignationAcceptanceLetter",
      "ConfirmationLetter",
      "PerformanceAppraisalLetter",
      "WarningLetter",
      "SalaryIncrementLetter",
      "TrainingInvitationLetter",
      "EmployeeRecognitionLetter",
    ];

    const newArr = [];
    for (let i = 0; i < types.length; i++) {
      const letterType = letterTypes[0][types[i]];
      if (letterType && letterType.workflow === true) {
        newArr.push(types[i]);
      }
    }

    console.log("newArr", newArr);

    const docs = await OrgDocuments.find({
      "employeeId.mId": req.user.user._id,
    })
      .populate("creatorId")
      .populate("employeeId.empId");

    const filteredDocs = docs.filter((doc) => {
      const type = doc.type.replace(/\s/g, "");
      return newArr.includes(type);
    });

    const filteredDocs2 = filteredDocs.filter((doc) => {
      return doc.employeeId.some((emp) => emp.status === false);
    });

    console.log("filteredDocs", filteredDocs2);

    res.status(200).json({
      doc: filteredDocs2, // Send filteredDocs instead of docs
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

exports.acceptNotification = catchAssyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const docs = await OrgDocuments.findById(id);

    if (!docs) {
      return res.status(404).json({ message: "Document not found" });
    }

    docs.employeeId.forEach((employee) => {
      if (
        employee.mId &&
        employee.mId.toString() === req.user.user._id.toString()
      ) {
        employee.status = true;
      }
    });

    await docs.save();

    res.status(200).json({
      message: "Employee status updated successfully",
      updatedDoc: docs,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

exports.rejectNotification = catchAssyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const docs = await OrgDocuments.findById(id);

    if (!docs) {
      return res.status(404).json({ message: "Document not found" });
    }

    docs.employeeId.forEach((employee) => {
      if (
        employee.mId &&
        employee.mId.toString() === req.user.user._id.toString()
      ) {
        employee.status = true;
        employee.rejected = true;
      }
    });

    await docs.save();

    res.status(200).json({
      message: "Employee status updated successfully",
      updatedDoc: docs,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

exports.getDocById = catchAssyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await OrgDocuments.findById({ _id: id });
    res.status(200).json({
      message: "Documents Updated Successfully",
      doc: doc,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

exports.getOrgUnderSA = catchAssyncError(async (req, res, next) => {
  try {
    const orgData = await OrganisationModel.find({
      creator: mongoose.Types.ObjectId(req.user.user._id),
    });
    res.status(200).json({
      orgData,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

exports.getOneOrgHr = catchAssyncError(async (req, res, next) => {
  try {
    const orgData = await OrganisationModel.findOne({
      _id: mongoose.Types.ObjectId(req.user.user.organizationId),
    });
    res.status(200).json({
      orgData,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

exports.getManagersForDowncast = catchAssyncError(async (req, res, next) => {
  try {
    const managers = await EmployeeManagementModel.find({})
      .populate("managerId")
      .populate("reporteeIds");

    const filteredManagers = managers.filter(
      (manager) => manager.managerId !== null
    );

    console.log("filtered managers", filteredManagers);
    res.status(200).json({
      filteredManagers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

exports.updateDocs = catchAssyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, details, applicableDate, url, type } = req.body;
    const requiredFields = {};
    if (title) requiredFields.title = title;
    if (url) requiredFields.url = url;
    if (type) requiredFields.type = type;
    if (header) requiredFields.header = header;
    if (footer) requiredFields.footer = footer;
    if (details) requiredFields.details = details;
    if (applicableDate) requiredFields.applicableDate = applicableDate;
    requiredFields.creatorId = req.user.user._id;
    const docs = await OrgDocuments.findByIdAndUpdate(
      { _id: id },
      { $set: requiredFields },
      { new: true }
    );
    res.status(200).json({
      message: "Documents Updated Successfully",
      doc: docs,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

exports.uploadDocs = catchAssyncError(async (req, res, next) => {
  try {
    const { documentName } = req.body;

    let url = await generateSignedUrlToUploadOrgDocs(
      req.user.user,
      documentName
    );

    res.status(200).json({ url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.getDocsForEmp = catchAssyncError(async (req, res, next) => {
  try {
    const employeeId = req.user.user._id;

    const docs = await OrgDocuments.find({
      "employeeId.empId": employeeId,
    });

    const filteredDocs = docs.filter((doc) => {
      const empObj = doc.employeeId.find(
        (obj) => obj.empId.toString() === employeeId
      );

      if (
        empObj &&
        (empObj.mId === null || empObj.mId === undefined || empObj.mId === "")
      ) {
        return true;
      }

      return empObj && empObj.status === true;
    });

    res.status(200).json({ documents: filteredDocs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.deleteDoc = catchAssyncError(async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedDoc = await OrgDocuments.findByIdAndDelete({ _id: id });

    res
      .status(200)
      .json({ documents: deletedDoc, message: "doc deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.updateArray = catchAssyncError(async (req, res, next) => {
  const { id } = req.params;
  const { employeeId } = req.body;

  try {
    const document = await OrgDocuments.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const existingEmpIds = document.employeeId.map((emp) =>
      emp.empId.toString()
    );

    console.log("existingEmpIds", existingEmpIds);

    const filteredEmployeeId = employeeId.filter(
      (emp) => !existingEmpIds.includes(emp.empId)
    );

    document.employeeId = [...document.employeeId, ...filteredEmployeeId];

    await document.save();

    res.json({ message: "Employee IDs updated successfully" });
  } catch (error) {
    console.error("Error updating employee IDs:", error);
    res.status(500).json({ message: error.message });
  }
});

exports.getManager = catchAssyncError(async (req, res, next) => {
  const { id } = req.params;
  try {
    const approverId = await EmployeeManagementModel.findOne({
      reporteeIds: { $in: [id] },
    });

    res.json({
      message: "manager found successfully",
      id: approverId ? approverId.managerId : null,
    });
  } catch (error) {
    console.error("Error updating employee IDs:", error);
    res.status(500).json({ message: error.message });
  }
});
