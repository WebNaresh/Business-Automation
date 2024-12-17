const mongoose = require("mongoose");
const Roles = require("../models/roles-schema");
require("dotenv").config();

async function seedRoles() {
  try {
    await mongoose.connect(process.env.LOCALHOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Update Super-Admin role or create if it doesn't exist
    await Roles.findOneAndUpdate(
      { roleName: "Super-Admin" },
      {
        $set: {
          rights: {
            isModifier: true,
            isExplorer: true,
            isDeleter: true,
            isCreator: true,
            isOrganisationAdmin: true,
            isDepartmenAdmin: true,
            isApprover: true,
            isDelegator: false,
          },
          organizationId: null,
          departmentId: null,
        },
      },
      { upsert: true, new: true }
    );

    // Update Delegate-Super-Admin role or create if it doesn't exist
    await Roles.findOneAndUpdate(
      { roleName: "Delegate-Super-Admin" },
      {
        $set: {
          rights: {
            isModifier: true,
            isExplorer: true,
            isDeleter: true,
            isCreator: true,
            isOrganisationAdmin: true,
            isDepartmenAdmin: true,
            isApprover: true,
            isDelegator: true,
          },
          organizationId: null,
          departmentId: null,
        },
      },
      { upsert: true, new: true }
    );
    await Roles.findOneAndUpdate(
      { roleName: "Organisation-Head" },
      {
        $set: {
          rights: {
            isModifier: true,
            isExplorer: true,
            isDeleter: true,
            isCreator: true,
            isOrganisationAdmin: true,
            isDepartmenAdmin: true,
            isApprover: true,
            isDelegator: false,
          },
          organizationId: null,
          departmentId: null,
        },
      },
      { upsert: true, new: true }
    );
    await Roles.findOneAndUpdate(
      { roleName: "Department-Head" },
      {
        $set: {
          rights: {
            isModifier: true,
            isExplorer: true,
            isDeleter: true,
            isCreator: true,
            isOrganisationAdmin: false,
            isDepartmenAdmin: true,
            isApprover: true,
            isDelegator: false,
          },
          organizationId: null,
          departmentId: null,
        },
      },
      { upsert: true, new: true }
    );

    // Update Employee role or create if it doesn't exist
    await Roles.findOneAndUpdate(
      { roleName: "Employee" },
      {
        $set: {
          rights: {
            isModifier: false,
            isExplorer: false,
            isDeleter: false,
            isCreator: false,
            isOrganisationAdmin: false,
            isDepartmenAdmin: false,
            isApprover: false,
            isDelegator: false,
          },
          organizationId: null,
          departmentId: null,
        },
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error("Error updating roles:", error);
  } finally {
    mongoose.disconnect(); // Close the database connection after updating roles
  }
}

seedRoles().then(() => console.log("exiting from the command"));
