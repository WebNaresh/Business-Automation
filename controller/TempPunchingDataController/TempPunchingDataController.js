const catchAsyncError = require("../../middleware/catchAssyncError");
const TempPunchingdata = require("../../models/TempPunchingdata/TempPunchingData");

// GET API to retrieve TempPunchingData by organizationId
exports.getTempPunchingData = catchAsyncError(async (req, res, next) => {
  const OrganizationID = req.params.organizationId;
  console.log("organizaitonId", req.params.organizationId);

  console.log("OrganizationID", OrganizationID);

  if (!OrganizationID) {
    return res.status(400).json({ error: "Organization ID is required" });
  }

  const data = await TempPunchingdata.find({ OrganizationID: OrganizationID });

  if (!data || data.length === 0) {
    return res
      .status(404)
      .json({ message: "No data found for the given organization ID" });
  }

  res.status(200).json(data);
});

// POST API to create new TempPunchingData
exports.createTempPunchingData = catchAsyncError(async (req, res, next) => {
  const {
    Org_Id,
    EmployeeID,
    FirstName,
    Department,
    Date,
    PunchTime,
    PunchState,
    Area,
    SerialNumber,
    DeviceName,
    UploadTime,
  } = req.body;

  const newPunchingData = new TempPunchingdata({
    Org_Id,
    EmployeeID,
    FirstName,
    Department,
    Date,
    PunchTime,
    PunchState,
    Area,
    SerialNumber,
    DeviceName,
    UploadTime,
  });

  await newPunchingData.save();

  res.status(201).json({
    success: true,
    message: "TempPunchingData created successfully",
    data: newPunchingData,
  });
});
