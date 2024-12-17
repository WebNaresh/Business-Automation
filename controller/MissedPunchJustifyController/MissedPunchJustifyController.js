const catchAssyncError = require("../../middleware/catchAssyncError");
const { MissedJustifyModel } = require("../../models/MissJustifyModel/MissJustifyModel");
const { EmployeeManagementModel } = require("../../models/employeManager/employeeManagementSchema");
const { EmployeeModel } = require("../../models/employeeSchema");


exports.addMissJustifyData = catchAssyncError(async (req, res, next) => {
    try {
      const { organizationId } = req.params;
      const EmployeeId = req.user.user._id; 
      const { recordDate, punchInTime, punchOutTime, totalHours, status, justify } = req.body;
     
      const employeeManagement = await EmployeeManagementModel.findOne({ organizationId, reporteeIds: EmployeeId });
      if (!employeeManagement) {
        return res.status(404).json({ success: false, error: "Employee management not found for the given employee." });
      }
      const managerId = employeeManagement.managerId;

       let hr = await EmployeeModel.findOne({ organizationId, profile: "HR" });
       let hrId = hr._id
       
       let approvedId = managerId;
       if (!managerId && hrId) {
           approvedId = hrId; 
       }
       

      let missedJustifyData = await MissedJustifyModel.findOne({ EmployeeId, organizationId });
  
      if (!missedJustifyData) {
        missedJustifyData = new MissedJustifyModel({
            EmployeeId,
            organizationId,
            approvedId,
            punchingData: []
        });
    }
  
      missedJustifyData.punchingData.push({
        recordDate,
        punchInTime,
        punchOutTime,
        totalHours,
        status,
        justify
      });
  
      await missedJustifyData.save();

      res.status(201).json({ success: true, message: "Send Request to Manager.", managerId });
    } catch (error) {
      console.error("Error sending request to manager:", error);
      return res.status(500).json({ success: false, error: "Failed to send a request to manager.", details: error.message });
    }
});
