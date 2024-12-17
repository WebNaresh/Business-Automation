const catchAssyncError = require("../middleware/catchAssyncError");
const { ExtraDayModal } = require("../models/extraDaySchema");

// Function to add a new extra day shift
exports.addExtraDay = catchAssyncError(async (req, res, next) => {
    const { extraDay } = req.body;
    const creatorId = req.user.user._id;
    const organizationId = req.user.user.organizationId;
  
    console.log("extraDay", extraDay);
  
    try {
      // Find and update if data exists, otherwise create new data
      const updatedExtraDay = await ExtraDayModal.findOneAndUpdate(
        { organizationId }, 
        {
          extraDay: extraDay || false,
          creatorId,
        },
        {
          new: true, // Return the updated document
          upsert: true, // Create a new document if none exsists
        }
      );
  
      res.status(201).json({
        success: true,
        message: "Extra day added or updated successfully",
        updatedExtraDay,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });
  
// Function to get extra days for a particular organization
exports.getExtraDay = catchAssyncError(async (req, res, next) => {
  const organizationId = req.user.user.organizationId;
  try {
    const extraDays = await ExtraDayModal.find({
      organizationId,
    });

    // Return the first entry as an object
    const extraDay = extraDays.length > 0 ? extraDays[0] : null;

    res.status(200).json({ success: true, extraDay });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
