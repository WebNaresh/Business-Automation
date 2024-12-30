// updateEmployeeTraining a User
const catchAsyncError = require("../../middleware/catchAssyncError");
const {
  trainingEmployeeModel,
} = require("../../models/Training/training-employee");

exports.updateEmployeeTraining = catchAsyncError(async (req, res, next) => {
  const { trainingEmployeeId } = req.params;
  const trainingEmployee = await trainingEmployeeModel.findById(
    trainingEmployeeId
  );
  if (!trainingEmployee) {
    return res.status(404).json({ message: "Training Employee not found" });
  }
  const { status } = req.body;
  trainingEmployee.status = status;
  await trainingEmployee.save();
  return res.status(200).json({ message: "Training updated successfully" });
});
