const catchAssyncError = require("../middleware/catchAssyncError");
const { LetterTypes } = require("../models/LetterTypes/LetterTypeModal");

exports.updateDocument = catchAssyncError(async (req, res, next) => {
  const { organizationId } = req.params;
  const formData = req.body;

  try {
    let letterType = await LetterTypes.findOne({ organizationId });

    // If letterType does not exist, create a new one
    if (!letterType) {
      letterType = new LetterTypes({
        organizationId,
      });
    }

    // Update or create each document type based on formData
    Object.entries(formData).forEach(([documentName, values]) => {
      letterType[documentName] = {
        workflow: values.workflow,
      };
    });

    letterType = await letterType.save();

    res.status(200).json({
      message: "Documents updated successfully.",
      doc: letterType,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

exports.getDocuments = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const letterType = await LetterTypes.findOne({ organizationId });

    if (!letterType) {
      return res.status(404).json({ message: "Documents not found." });
    }

    const documents = {};
    Object.entries(letterType.toObject()).forEach(([key, value]) => {
      if (!["_id", "organizationId", "__v"].includes(key)) {
        documents[key] = {
          workflow: value.workflow || false,
        };
      }
    });

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
