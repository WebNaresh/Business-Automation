const logger = require("../utils/logger/index");
const {
  OrganisationLocationModel,
} = require("../models/organizationLocationsSchema");
const catchAssyncError = require("../middleware/catchAssyncError");

exports.addOrganizationLocations = catchAssyncError(async (req, res, next) => {
  try {
    const {
      country,
      state,
      continent,
      shortName,
      city,
      pinCode,
      addressLine1,
      addressLine2,
      organizationId,
    } = req.body;

    // Validate input
    if (
      !country ||
      !continent ||
      !shortName ||
      !state ||
      !city ||
      !pinCode ||
      !addressLine1 ||
      !organizationId
    ) {
      return res
        .status(400)
        .json({ error: "Please fill all mandatory fields." });
    }

    logger.info({
      continent,
      shortName,
      country,
      state,
      city,
      pinCode,
      addressLine1,
      addressLine2,
      organizationId,
    });

    // check for unique short name for the organization id

    const locationExists = await OrganisationLocationModel.findOne({
      shortName,
      organizationId,
    });

    if (locationExists) {
      return res.status(400).json({
        message: "Location with this short name already exists.",
        success: false,
      });
    }

    // Set the creator field (replace with your logic)

    const newLocation = new OrganisationLocationModel({
      continent,
      shortName,
      country,
      state,
      city,
      pinCode,
      addressLine1,
      addressLine2,
      creater: req.user.user._id,
      organizationId,
    });

    await newLocation.save();

    res.status(201).json({
      message: "Location added successfully.",
      location: newLocation,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
});

exports.getOrganizationLocations = catchAssyncError(async (req, res, next) => {
  try {
    const locationsData = await OrganisationLocationModel.find({
      organizationId: req.params.organizationId,
    });
    const locationCount = await OrganisationLocationModel.find({
      organizationId: req.params.organizationId,
    }).countDocuments();
    res.status(200).json({ locationsData, locationCount });
    console.log(locationsData);
  } catch (error) {
    console.error("Error fetching data from OrganizationLocations", error);
    res.status(500).json({ error: "Internal Server Error", error });
  }
});

exports.updateOrganizationLocations = catchAssyncError(
  async (req, res, next) => {
    try {
      const locationId = req.params.id;
      const {
        continent,
        shortName,
        country,
        state,
        city,
        pinCode,
        addressLine1,
        addressLine2,
        organizationId,
      } = req.body;

      // Validate input
      if (!locationId) {
        return res.status(400).json({ error: "Location id is required." });
      }

      // Check if the location exists
      const location = await OrganisationLocationModel.findByIdAndUpdate(
        locationId,
        {
          country,
          state,
          city,
          pinCode,
          addressLine1,
          addressLine2,
          organizationId,
        }
      );
      if (!location) {
        return res.status(404).json({ error: "Location not found." });
      }

      // Check if the user has permission to update the location (replace with your logic)
      if (location.creater.toString() !== req.user.user._id.toString()) {
        return res.status(403).json({
          error: "You do not have permission to update this location.",
        });
      }

      // Update the location fields
      location.country = country || location.country;
      location.continent = continent || location.continent;
      location.shortName = shortName || location.shortName;
      location.state = state || location.state;
      location.city = city || location.city;
      location.pinCode = pinCode || location.pinCode;
      location.addressLine1 = addressLine1 || location.addressLine1;
      location.addressLine2 = addressLine2 || location.addressLine2;

      // Save the updated location
      await location.save();

      res.json({
        message: "Location updated successfully.",
        location: location,
      });
    } catch (error) {
      console.error("Error updating organization location", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

exports.deleteOrganizationLocations = catchAssyncError(
  async (req, res, next) => {
    try {
      const locationId = req.params.id;

      // Validate input
      if (!locationId) {
        return res.status(400).json({ error: "Location id is required." });
      }

      // Check if the location exists
      const location = await OrganisationLocationModel.findById(locationId);
      if (!location) {
        return res.status(404).json({ error: "Location not found." });
      }

      // Check if the user has permission to delete the location (replace with your logic)
      if (location.creater.toString() !== req.user.user._id.toString()) {
        return res.status(403).json({
          error: "You do not have permission to delete this location.",
        });
      }

      // Delete the location
      await location.remove();

      res.json({ message: "Location deleted successfully." });
    } catch (error) {
      console.error("Error deleting organization location", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
