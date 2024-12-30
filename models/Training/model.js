const mongoose = require("mongoose");
const { trainingEmployeeModel } = require("./training-employee");
const { String, Number, ObjectId } = mongoose.Schema.Types;

const TrainingSchema = new mongoose.Schema(
  {
    trainingName: {
      type: String,
      required: true,
    },
    trainingLogo: {
      type: String,
      required: false,
      default: "",
    },

    trainingDescription: {
      type: String,
      required: true,
    },
    trainingType: [
      {
        label: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],
    trainingLink: {
      type: String,
      required: true,
    },
    trainingCreator: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    trainingDuration: {
      type: String,
      required: true,
    },
    trainingPoints: {
      type: Number,
      required: true,
    },
    trainingAttendees: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    trainingAttended: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    trainingStartDate: {
      type: Date,
      required: true,
    },
    trainingDownCasted: {
      type: Boolean,
      required: true,
    },
    trainingEndDate: {
      type: Date,
      required: true,
    },

    trainingOrganizationId: {
      type: ObjectId,
      ref: "Organization",
      required: true,
    },
    trainingLocation: {
      position: {
        lat: {
          type: Number,
          required: true,
        },
        lng: {
          type: Number,
          required: true,
        },
      },
      address: {
        type: String,
        required: true,
      },
    },
    trainingDepartment: [{ type: ObjectId, ref: "Department" }],
    proofSubmissionRequired: {
      type: Boolean,
      required: true,
    },
  },

  { timestamps: true }
);
TrainingSchema.post("save", async function (doc) {
  await Promise.all(
    doc.trainingAttendees.map(async (attendee) => {
      await trainingEmployeeModel.create({
        employeeId: attendee,
        trainingId: doc._id,
        startDate: doc.trainingStartDate,
        endDate: doc.trainingEndDate,
      });
    })
  );
});
TrainingSchema.post("deleteOne", async function (doc) {
  await trainingEmployeeModel.deleteMany({ trainingId: doc._id });
});

const TrainingModel = mongoose.model("Training", TrainingSchema);
module.exports = { TrainingModel };
