const catchAssyncError = require("../../middleware/catchAssyncError");
const {
  SalaryTemplateModel,
} = require("../../models/SalaryTemplate/SalaryTemplateSchema");

exports.createSalaryTemplate = catchAssyncError(async (req, res, next) => {
  try {
    const { organisationId } = req.params;

    const { income, deductions, name, desc, empType } = req.body;

    const existingSalaryTemp = await SalaryTemplateModel.findOne({
      name,
      organisationId,
    });

    if (existingSalaryTemp) {
      return res.status(400).json({
        success: false,
        error: "Salary template name already exists in this organization",
      });
    }

    if (!name || !empType) {
      return res.status(400).json({ message: "All Fileds is mandatory" });
    }

    const salaryTemplate = new SalaryTemplateModel({
      deductions,
      income,
      name,
      desc,
      empType,
      organisationId,
    });

    await salaryTemplate.save();

    res.status(201).json({
      message: "Salary template  created successfully.",
      success: true,
      salaryTemplate: salaryTemplate,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.updateSalaryTemplate = catchAssyncError(async (req, res, next) => {
  try {
    const { income, deductions, name, desc, empType } = req.body;
    const templateId = req.params.id; // Assuming the template ID is passed in the URL params

    if (!name || !empType) {
      return res.status(400).json({ message: "All fields are mandatory" });
    }

    // Check if the template with the given ID exists
    const existingTemplate = await SalaryTemplateModel.findById(templateId);
    if (!existingTemplate) {
      return res.status(404).json({ message: "Salary template not found" });
    }

    // Update the template fields
    existingTemplate.income = income;
    existingTemplate.deductions = deductions;
    existingTemplate.name = name;
    existingTemplate.desc = desc;
    existingTemplate.empType = empType;

    // Save the updated template to the database
    const updatedTemplate = await existingTemplate.save();

    // Send a success response
    res.status(200).json({
      message: "Salary Template updated successfully.",
      success: true,
      salaryTemplate: updatedTemplate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

exports.getSalaryTemplate = catchAssyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const SalarTemplates = await SalaryTemplateModel.findById(id).populate(
      "empType"
    );

    return res.status(200).json({
      SalarTemplates,
    });
  } catch (err) {
    console.log(err);
  }
});

exports.getSalaryTemplates = catchAssyncError(async (req, res, next) => {
  try {
    const { organisationId } = req.params;
    const salaryTemplates = await SalaryTemplateModel.find({
      organisationId,
    }).populate("empType");

    return res.status(200).json({
      salaryTemplates,
    });
  } catch (err) {
    console.log(err);
  }
});

exports.deleteSalaryTemplate = catchAssyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const isIdExists = await SalaryTemplateModel.findById(id);

    if (!isIdExists)
      return res.status(400).json({ message: "Invalid ID", success: false });

    const deleteEmployeeType = await SalaryTemplateModel.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Salary template deleted successfully.",
      success: true,
      deleteEmployeeType,
    });
  } catch (err) {
    console.log(err);
  }
});
