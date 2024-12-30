const {
  UserDocuments,
} = require("../../models/DocManagement/UserDocumentModal");
const catchAssyncError = require("../../middleware/catchAssyncError");
const { OrganisationModel } = require("../../models/organizationSchema");
const { EmployeeModel } = require("../../models/employeeSchema");

exports.AddDocuments = catchAssyncError(async (req, res, next) => {
  try {
    const { documents } = req.body; // Extract documents from request body
    const employeeId = req.user.user._id; // Get employeeId from user data
    const organizationId = req.user.user.organizationId; // Get organizationId from user data
    const profile = req.user.user.profile; // Get user profile

    // Get super admin ID (creator) and HR IDs
    const organization = await OrganisationModel.findById(
      organizationId
    ).select("creator");
    const hrIds = await EmployeeModel.find({
      organizationId,
      profile: "HR",
    }).select("_id");
    const hrIdList = hrIds.map((hr) => hr._id);
    let approvalId = [...hrIdList, organization.creator];

    // Exclude HR's own ID if they are submitting the document
    if (profile.includes("HR")) {
      approvalId = approvalId.filter(
        (id) => id.toString() !== employeeId.toString()
      );
    }

    // Prepare files array for the schema from the documents array
    // Prepare files array for the schema from the documents array
    const files = documents.map((doc) => {
      return {
        fileName: doc.fileName, // Map relevant fields
        selectedValue: doc.isCustom
          ? doc.customDocumentName
          : doc.selectedValue, // Conditionally set selectedValue
        isCustom: doc.isCustom || false, // Set isCustom (default to false if undefined)
        customDocumentName: doc.customDocumentName || "", // Set customDocumentName (default to empty string if undefined)
      };
    });

    console.log("files", files);

    // Check if a document already exists for the employee and organization
    let existingDocument = await UserDocuments.findOne({
      employeeId,
      organizationId,
    });

    if (existingDocument) {
      // Update (modify) the existing document
      existingDocument.files = files; // Replace files array with the new one
      existingDocument.approvalId = approvalId; // Update approvalId if necessary

      // Save the updated document
      await existingDocument.save();

      return res.status(200).json({
        success: true,
        message: "Document updated successfully",
        data: existingDocument,
      });
    } else {
      // Create a new document if none exists
      const newDocument = new UserDocuments({
        files,
        employeeId,
        approvalId,
        organizationId,
      });

      // Save the new document to the database
      await newDocument.save();

      return res.status(201).json({
        success: true,
        message: "Document added successfully",
        data: newDocument,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
exports.getDocuments = catchAssyncError(async (req, res, next) => {
  try {
    const { employeeId, organizationId } = req.params;
    console.log({ employeeId, organizationId });

    const documentData = await UserDocuments.findOne({
      employeeId: employeeId,
      organizationId: organizationId,
    })
      .populate("employeeId")
      .populate("approvalId");

    // Send the document data as a response
    return res.status(200).json({
      success: true,
      message: "Document data retrieved successfully",
      data: documentData,
    });
  } catch (error) {
    // Handle any errors and send a 500 response
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
exports.UpdateDocuments = catchAssyncError(async (req, res, next) => {
  try {
    const { file } = req.body; // Extract file from request body (assuming single file upload)
    const employeeId = req.user.user._id; // Get employeeId from user data
    const organizationId = req.user.user.organizationId; // Get organizationId from user data
    const profile = req.user.user.profile; // Get user profile
    const fileId = req.params.fileId;

    // Get super admin ID (creator) and HR IDs
    const organization = await OrganisationModel.findById(
      organizationId
    ).select("creator");
    const hrIds = await EmployeeModel.find({
      organizationId,
      profile: "HR",
    }).select("_id");
    const hrIdList = hrIds.map((hr) => hr._id);
    let approvalId = [...hrIdList, organization.creator];

    // Exclude HR's own ID if they are submitting the document
    if (profile.includes("HR")) {
      approvalId = approvalId.filter(
        (id) => id.toString() !== employeeId.toString()
      );
    }

    // Find the document by organizationId and remove the file with the given fileId
    const existingDocument = await UserDocuments.updateOne(
      { organizationId: organizationId },
      { files: { _id: fileId } } // Remove the file by fileId
    );

    if (existingDocument) {
      // Update the existing document
      existingDocument.files.push(file); // Append the new file to the files array
      existingDocument.approvalId = approvalId; // Update approvalId if necessary

      // Save the updated document
      await existingDocument.save();

      return res.status(200).json({
        success: true,
        message: "Document updated successfully",
        data: existingDocument,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

exports.getDocumentsToApprovalId = catchAssyncError(async (req, res, next) => {
  try {
    const approvalId = req.user.user._id;
    const organizationId = req.user.user.organizationId;

    // Check if approvalId and organizationId are present
    if (!approvalId) {
      return res.status(400).json({
        success: false,
        message: "Approval ID not found",
      });
    }

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "Organization ID not found",
      });
    }

    // Find documents based on approvalId and organizationId (return array of documents)
    const documentData = await UserDocuments.find({
      approvalId: approvalId,
      organizationId: organizationId,
    }).populate("employeeId");

    // Check if document data exists
    if (!documentData || documentData.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "No documents found for the given approval ID and organization",
      });
    }

    // Send the array of document data as a response
    return res.status(200).json({
      success: true,
      message: "Document data retrieved successfully for the approval ID",
      data: documentData,
    });
  } catch (error) {
    // Handle any errors and send a 500 response
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

exports.deleteDocument = catchAssyncError(async (req, res, next) => {
  try {
    const organizationId = req.user.user.organizationId; // Assuming the organizationId is stored in req.user
    const fileId = req.params.fileId; // Assuming fileId is passed in the URL params

    console.log({ organizationId, fileId });

    // Find the document by organizationId and remove the file with the given fileId
    const result = await UserDocuments.updateOne(
      { organizationId: organizationId },
      { $pull: { files: { _id: fileId } } } // Remove the file by fileId
    );

    console.log("result", result);

    // Check if a document was modified (file deleted)
    if (result) {
      return res.status(200).json({
        success: true,
        message: "File deleted successfully.",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "File not found or organization mismatch.",
      });
    }
  } catch (error) {
    // Handle any errors and send a 500 response
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// exports.uploadDocs = catchAssyncError(async (req, res, next) => {
//   try {
//     const { documentName } = req.body;

//     let url = await generateSignedUrlToUploadDocs(req.user.user, documentName);

//     res.status(200).json({ url });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
