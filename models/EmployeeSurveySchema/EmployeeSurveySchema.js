const mongoose = require("mongoose");

//Communication permission schema
const employeeSurveyPermission = new mongoose.Schema({
  surveyPermission: {
    type: Boolean,
    default: false
  },
  organisationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  }
})

// Employee survey schema
const employeeSurveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  questions: [
    {
      question: {
        type: String,
      },
      questionType: {
        type: String,
        required: true,
      },
      options: {
        type: [String],
        required: function () {
          return this.questionType === 'Checkboxes';
        }
      },
      required: {
        type: Boolean,
        default: false
      }
    }
  ],
  status: {
    type: Boolean,
    default: false
  },
  employeeSurveyStartingDate: {
    type: Date,
  },
  employeeSurveyEndDate: {
    type: Date,
  },
  to: {
    type: [
      {
        label: String,
        value: String,
      },
    ],
  },
  creatorId: {
    type: String,
  },
  organisationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization"
  },
  from: {
    type: String,
  },
  subject: {
    type: String,
  },
  body: {
    type: String,
  },
  employeeCredential: {
    type: Boolean,
    default: false
  }
});

// Employee Response schema
const employeeResponseSchema = new mongoose.Schema({
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EmployeeSurvey",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  questions: [
    {
      questionId: {
        type: String,
        required: true,
      },
      questionType: {
        type: String,
        required: true,
      },
      question: {
        type: String,
        required: true,
      },
      answer: {
        type: mongoose.Schema.Types.Mixed,
        required: false,
      }
    }
  ],
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true
  },
  responseStatus: {
    type: String,
    enum: ["Start", 'Complete Survey', 'End'],
    default: "Start"
  },
  employeeCredential: {
    type: Boolean,
  }
});

const EmployeeSurveyPermissionModel = mongoose.model("EmployeeSurveyPermission", employeeSurveyPermission);
const EmployeeSurveyModel = mongoose.model("EmployeeSurvey", employeeSurveySchema);
const EmployeeResponseModel = mongoose.model("EmployeeResponse", employeeResponseSchema);

module.exports = {
  EmployeeSurveyPermissionModel,
  EmployeeSurveyModel,
  EmployeeResponseModel,
};
