const catchAssyncError = require("../middleware/catchAssyncError");
const { PFModel } = require("../models/PFSetupSchema");

exports.createAndUpdatePFSetup = catchAssyncError(async (req, res, next) => {
  try {
    const { orgId } = req.params;
    const { data } = req.body;

    const pfSetup = await PFModel.findOneAndUpdate(
      { organizationId: orgId },
      {
        ...data,
        organizationId: orgId,
      },
      { new: true, upsert: true }
    );

    return res
      .status(200)
      .json({ message: "Data saved successfully", data: pfSetup });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

exports.getPFSetup = catchAssyncError(async (req, res, next) => {
  try {
    const { orgId } = req.params;
    if (!orgId) {
      return res.status(200).json({ message: "Invalid Organisation id " });
    }
    const pfSetup = await PFModel.findOne({ organizationId: orgId });

    if (!pfSetup) {
      return res.status(200).json({ message: "No data found" });
    }
    return res.status(200).json(pfSetup);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
