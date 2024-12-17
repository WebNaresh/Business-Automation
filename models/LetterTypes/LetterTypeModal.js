const mongoose = require("mongoose");

const letterTypeSetup = new mongoose.Schema({
  organizationId: {
    type: mongoose.Types.ObjectId,
    ref: "Organization",
  },
  EmploymentOfferLetter: {
    workflow: {
      type: Boolean,
    },
  },
  AppointmentLetter: {
    workflow: {
      type: Boolean,
    },
  },

  PromotionLetter: {
    workflow: {
      type: Boolean,
    },
  },
  TransferLetter: {
    workflow: {
      type: Boolean,
    },
  },
  TerminationLetter: {
    workflow: {
      type: Boolean,
    },
  },
  ResignationAcceptanceLetter: {
    workflow: {
      type: Boolean,
    },
  },
  ConfirmationLetter: {
    workflow: {
      type: Boolean,
    },
  },
  PerformanceAppraisalLetter: {
    workflow: {
      type: Boolean,
    },
  },
  WarningLetter: {
    workflow: {
      type: Boolean,
    },
  },
  SalaryIncrementLetter: {
    workflow: {
      type: Boolean,
    },
  },
  TrainingInvitationLetter: {
    workflow: {
      type: Boolean,
    },
  },
  EmployeeRecognitionLetter: {
    workflow: {
      type: Boolean,
    },
  },
});

const LetterTypes = mongoose.model("lettertypes", letterTypeSetup);
module.exports = { LetterTypes };
