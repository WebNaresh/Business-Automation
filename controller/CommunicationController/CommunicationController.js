const catchAssyncError = require("../../middleware/catchAssyncError");
const {
  CommunicationModal,
} = require("../../models/CommunicationSchema/CommunicationSchema");

exports.addCommunication = catchAssyncError(async (req, res, next) => {
  try {
    const { email, communication } = req.body;
    const creatorId = req.user.user._id;
    const { organizationId } = req.params;

    const addCommunication = new CommunicationModal({
      email,
      communication,
      organizationId,
      creatorId,
    });

    await addCommunication.save();

    return res.status(201).json({
      success: true,
      data: addCommunication,
      message: "Setup the email successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to add the email ",
      details: error.message,
    });
  }
});

exports.getCommunication = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const getCommunications = await CommunicationModal.find({ organizationId });
    if (!getCommunications) {
      return res.status(404).json({ message: "No data found" });
    }
    res.status(200).json({ success: true, data: getCommunications });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

exports.getCommunicationById = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId, communicationId } = req.params;
    const getCommunicationById = await CommunicationModal.findOne({
      _id: communicationId,
      organizationId,
    });
    res.status(200).json({ success: true, data: getCommunicationById });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

exports.updateCommunicationById = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId, communicationId } = req.params;
    const { email, communication } = req.body;

    const existingCommunciationData = await CommunicationModal.findOne({
      _id: communicationId,
      organizationId,
    });
    if (!existingCommunciationData) {
      return res.status(404).json({ message: "No data  found" });
    }

    existingCommunciationData.email = email;
    existingCommunciationData.communication = communication;

    await existingCommunciationData.save();

    return res.status(200).json({
      success: true,
      data: existingCommunciationData,
      message: "Communication updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update the communication",
      details: error.message,
    });
  }
});

exports.deleteCommunicationById = catchAssyncError(async (req, res, next) => {
  try {
    const { organizationId, communicationId } = req.params;

    const existingCommunciationData = await CommunicationModal.findOne({
      _id: communicationId,
      organizationId: organizationId,
    });

    if (!existingCommunciationData) {
      return res.status(404).json({ message: "No data  found" });
    }

    const deleteCommunication = await CommunicationModal.findByIdAndDelete(
      communicationId
    );
    res.status(200).json({
      success: true,
      data:deleteCommunication,
      message: "Loan type deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete the loan type",
      details: error.message,
    });
  }
});
