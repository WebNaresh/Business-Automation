const mongoose = require("mongoose");

const punchSchema = new mongoose.Schema({
  start: {
    type: Date,
  },
  end: {
    type: Date,
  },
  locations: {
    type: [
      {
        lng: {
          type: Number,
          required: true,
        },
        lat: {
          type: Number,
          required: true,
        },
        time: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
  },
});
punchSchema.statics.calculateTotalDistance = async function (employeeId) {
  const punchModel = this;

  const aggregationPipeline = [
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: ["$locations.lng", "$locations.lat"],
        },
        distanceField: "distance",
        spherical: true,
      },
    },
    {
      $match: {
        employeeId: mongoose.Types.ObjectId(employeeId),
      },
    },
    {
      $group: {
        _id: null,
        totalDistance: { $sum: "$distance" },
      },
    },
  ];

  const result = await punchModel.aggregate(aggregationPipeline);

  return result.length > 0 ? result[0].totalDistance : 0;
};

const PunchModel = mongoose.model("Punch", punchSchema);
module.exports = { PunchModel };
