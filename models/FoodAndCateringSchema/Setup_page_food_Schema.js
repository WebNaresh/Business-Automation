const mongoose = require("mongoose");

const setuppagefoodSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Types.ObjectId,
      ref: "Organization",
    },
    canVendorsUploadDocuments: { 
      type: Boolean, 
      required: true,
    },
    menuPricesApprovedByHR: { 
      type: Boolean, 
      required: true,
    },
    uploadableDocuments: {
      bankAccount: { 
        type: Boolean, 
        // required: true,
      },
      foodCateringLicense: { 
        type: Boolean, 
        // required: true,
      },
      aadhar: { 
        type: Boolean, 
        // required: true,
      },
      pan: { 
        type: Boolean, 
        // required: true,
      },
    },
    documentsNeedApproval: { 
      type: Boolean, 
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Setuppagevendor = mongoose.model("setuppagevendor", setuppagefoodSchema);

module.exports = {Setuppagevendor};
