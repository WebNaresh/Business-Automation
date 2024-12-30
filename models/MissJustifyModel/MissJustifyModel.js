const mongoose = require("mongoose");

const MissJustifySchema = new mongoose.Schema({
    EmployeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
     approvedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
    punchingData: [
      {
        recordDate: { 
            type: String ,   
          },
        punchInTime: {
          type: String,
        },
        punchOutTime: {
           type: String,
         },
        totalHours: { 
          type: String ,
         },
         status: {
           type: String ,
          },
         justify : {
            type: String ,
        }
      },
    ],
  });
  
  const MissedJustifyModel = mongoose.model("missedJustifyData", MissJustifySchema);
  module.exports = { MissedJustifyModel };