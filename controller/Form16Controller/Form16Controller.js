const catchAssyncError = require("../../middleware/catchAssyncError");
const { Form16Modal } = require("../../models/Form16Schema/Form16Schema");
const { EmployeeModel } = require("../../models/employeeSchema");
const { generateSignedUrl, uploadImage } = require("../../utils/s3");

// get a form 16 file
exports.uploadImage = catchAssyncError(async (req, res, next) => {
  try {
    const url = await generateSignedUrl();
    res.status(200).json({ url });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    res.status(500).json({ message: "Failed to generate signed URL" });
  }
});

exports.uploadForm16File = catchAssyncError(async (req, res) => {
  try {
    const { employeeId, organizationId, year } = req.body;
    if (!organizationId || !employeeId) {
      return res
        .status(400)
        .json({ message: "Organization ID and User ID are required" });
    }
    const user = await EmployeeModel.findById(employeeId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const file = await uploadImage(req.file, user, "form16-images");
    const form16 = new Form16Modal({
      organizationId,
      employeeId,
      form16_file: file,
      year,
    });
    const newForm16 = await form16.save();
    return res.status(200).json({
      message: "Form 16 file uploaded successfully",
      data: newForm16,
    });
  } catch (error) {
    console.error("Error uploading Form 16 file:", error);
    return res.status(500).json({ message: "Failed to upload Form 16 file" });
  }
});

exports.checkForm16 = catchAssyncError(async (req, res, next) => {
  try {
    const { employeeId, year, organizationId } = req.body;
    const existingForm16 = await Form16Modal.findOne({
      organizationId,
      employeeId,
      year,
    });

    if (existingForm16) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking Form 16 file:", error);
    return res.status(500).json({ message: "Failed to check Form 16 file" });
  }
});

exports.getForm16 = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId, employeeId } = req.params;
    const form16 = await Form16Modal.findOne({ organizationId, employeeId });
    if (!form16) {
      return res.status(404).json({ message: "Form 16 file not found" });
    }
    return res.status(200).json({
      message: "Form 16 file retrieved successfully",
      data: form16.form16_file,
    });
  } catch (error) {
    console.error("Error retrieving Form 16 file:", error);
    return res.status(500).json({ message: "Failed to retrieve Form 16 file" });
  }
});
exports.deleteForm16 = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId, employeeId } = req.params;
    const form16 = await Form16Modal.findOne({ organizationId, employeeId });
    if (!form16) {
      return res.status(404).json({ message: "Form 16 file not found" });
    }
    await Form16Modal.deleteOne({ organizationId, employeeId });
    return res.status(200).json({
      message: "Form 16 record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting Form 16 record:", error);
    return res.status(500).json({ message: "Failed to delete Form 16 record" });
  }
});
exports.getForm16NotificationToEmp = catchAssyncError(
  async (req, res, next) => {
    try {
      const employeeId = req.user.user._id;
      const organizationId = req.user.user.organizationId;
      const form16 = await Form16Modal.findOne({ organizationId, employeeId });
      if (!form16) {
        return res.status(404).json({ message: "Form 16 file not found" });
      }
      return res.status(200).json({ data: [form16] });
    } catch (error) {
      console.error("Error retrieving Form 16 file:", error);
      return res
        .status(500)
        .json({ message: "Failed to retrieve Form 16 file" });
    }
  }
);
