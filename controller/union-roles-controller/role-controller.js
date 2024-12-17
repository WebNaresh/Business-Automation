// employeeController a User
const catchAssyncError = require("../../middleware/catchAssyncError");
const logger = require("../../utils/logger");
const { EmployeeModel } = require("../../models/employeeSchema");
const { RolesModel } = require("../../models/roles/union-roles-models");

exports.updateRoles = catchAssyncError(async (req, res, next) => {
  try {
    const validCreator = await EmployeeModel.findOne({
      _id: req.user.user._id,
    });

    if (!validCreator) {
      return res.status(400).json({ error: "Creator is not in the database" });
    }

    // Find the roles document by organizationId (assuming it's part of the request)
    const { organisationId } = req.params;
    let roles = await RolesModel.findOne({ organisationId });

    if (!roles) {
      return res
        .status(404)
        .json({ message: "Roles not found for the given organizationId" });
    }

    // Update roles using the new RolesModel schema
    roles.set(req.body);

    console.log(roles);
    await roles.save();

    // Log success message
    logger.info("Roles updated successfully.");

    console.log(roles);
    // Send success response
    res.status(200).json({ message: "Roles updated successfully." });
  } catch (error) {
    console.log(error);
    // Handle errors
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
});

exports.createRolesFunction = async (organisationId) => {
  try {
    const findRoles = await RolesModel.findOne({
      organisationId: organisationId,
    });
    console.log(`🚀 ~ file: role-controller.js:73 ~ findRoles:`, findRoles);
    await RolesModel.create({
      organisationId,
    });

    logger.info("Roles created successfully.");

    return { success: true, message: "Roles created successfully." };
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
exports.removeRolesFunction = async (organisationId) => {
  console.log(
    `🚀 ~ file: role-controller.js:62 ~ organisationId:`,
    organisationId
  );
  try {
    const roles = await RolesModel.deleteOne({
      organisationId: organisationId,
    });
    const findRoles = await RolesModel.findOne({
      organisationId: organisationId,
    });
    console.log(`🚀 ~ file: role-controller.js:73 ~ findRoles:`, findRoles);
    console.log(`🚀 ~ file: role-controller.js:64 ~ roles:`, roles);

    logger.info("Roles removed successfully.");

    return { success: true, message: "Roles removed successfully." };
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
exports.getRoles = catchAssyncError(async (req, res, next) => {
  try {
    const { organisationId } = req.params;

    const roles = await RolesModel.findOne({ organisationId }).select(
      "-_id -organisationId -__v"
    );

    if (!roles) {
      return res
        .status(404)
        .json({ message: "Roles not found for the given organisationId." });
    }

    // Log success message
    logger.info("Roles retrieved successfully.");

    // Send success response with roles
    res.status(200).json({
      message: "Roles retrieved successfully.",
      roles: roles.toObject(),
    });
  } catch (error) {
    // Handle errors
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
});
