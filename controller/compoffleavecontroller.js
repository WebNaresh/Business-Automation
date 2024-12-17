const catchAssyncError = require("../middleware/catchAssyncError");
const { CompOffLeaveModal } = require("../models/compoffleaveschema");

// Function to add a new extra day shift
exports.addCompOffLeave = catchAssyncError(async (req, res, next) => {
  const { compOff } = req.body;
  const creatorId = req.user.user._id;
  const organizationId = req.user.user.organizationId;

  console.log("compOff", compOff);

  try {
    // Find and update if data exists, otherwise create new data
    const updatedCompOfLeave = await CompOffLeaveModal.findOneAndUpdate(
      { organizationId },
      {
        compOff: compOff || false,
        creatorId,
      },
      {
        new: true, // Return the updated document
        upsert: true, // Create a new document if none exist
      }
    );

    res.status(201).json({
      success: true,
      message: "Comp of leave added or updated successfully",
      updatedCompOfLeave,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Function to get extra days for a particular organization
exports.getCompOffLeave = catchAssyncError(async (req, res, next) => {
  const organizationId = req.user.user.organizationId;
  try {
    const compOffs = await CompOffLeaveModal.find({
      organizationId,
    }); 

    console.log("compOffs" , compOffs);
    

    // Return the first entry as an object
    const compOff = compOffs.length > 0 ? compOffs[0] : null;

    res.status(200).json({ success: true, compOff });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
