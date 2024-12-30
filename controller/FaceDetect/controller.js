// // getFace a User
// const catchAssyncError = require("../../middleware/catchAssyncError");
// const { FaceDetectModel } = require("../../models/FaceDetect/model");

// exports.getFace = catchAssyncError(async (req, res, next) => {
//   const label = req.params.id;

//   if (!label) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid label",
//     });
//   }

//   const face = await FaceDetectModel.findOne({ label });

//   if (!face) {
//     return res.status(404).json({
//       success: false,
//       message: "Please upload your profile photo to the system once more.",
//     });
//   }

//   return res.status(200).json({
//     success: true,
//     data: face,
//   });
// });

// // createFace a Face
// exports.createAndUpdate = catchAssyncError(async (req, res, next) => {
//   const { descriptor } = req.body;
//   const label = req.params.id;

//   if (!label || !descriptor) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid label or descriptor",
//     });
//   }
//   // find face by label
//   let face = await FaceDetectModel.findOne({
//     label,
//   });

//   if (face) {
//     face = await FaceDetectModel.findOneAndUpdate(
//       {
//         label,
//       },
//       {
//         descriptor,
//       },
//       {
//         new: true,
//         runValidators: true,
//         useFindAndModify: false,
//       }
//     );

//     return res.status(200).json({
//       success: true,
//       data: face,
//       message: "Face updated successfully",
//     });
//   } else {
//     face = await FaceDetectModel.create({
//       label,
//       descriptor,
//     });

//     return res.status(201).json({
//       success: true,
//       data: face,
//       message: "Face created successfully",
//     });
//   }
// });

const catchAssyncError = require("../../middleware/catchAssyncError");
const { FaceDetectModel } = require("../../models/FaceDetect/model");
const path = require("path");
const faceapi = require('face-api.js');
const canvas = require('canvas');
const fs = require('fs');

// Use dynamic import for `node-fetch`
let fetch;
(async () => {
  fetch = (await import('node-fetch')).default;
})();

// Set up the canvas environment for face-api.js
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Load face-api.js models
const MODEL_URL = path.join(__dirname, '../../facemodel');
Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL),
  faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL),
  faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL)
]).then(() => {
  console.log('Models successfully loaded');
});

// Get Face by Label
exports.getFace = catchAssyncError(async (req, res, next) => {
  const label = req.params.id;

  if (!label) {
    return res.status(400).json({
      success: false,
      message: "Invalid label",
    });
  }

  const face = await FaceDetectModel.findOne({ label });

  if (!face) {
    return res.status(404).json({
      success: false,
      message: "Please upload your profile photo to the system once more.",
    });
  }

  return res.status(200).json({
    success: true,
    data: face,
  });
});

// Create or Update Face Descriptor
exports.createAndUpdate = catchAssyncError(async (req, res, next) => {
  const { descriptor } = req.body;
  const label = req.params.id;

  if (!label || !descriptor) {
    return res.status(400).json({
      success: false,
      message: "Invalid label or descriptor",
    });
  }

  let face = await FaceDetectModel.findOne({ label });

  if (face) {
    face = await FaceDetectModel.findOneAndUpdate(
      { label },
      { descriptor },
      { new: true, runValidators: true, useFindAndModify: false }
    );

    return res.status(200).json({
      success: true,
      data: face,
      message: "Face updated successfully",
    });
  } else {
    face = await FaceDetectModel.create({ label, descriptor });

    return res.status(201).json({
      success: true,
      data: face,
      message: "Face created successfully",
    });
  }
});


exports.compareface = catchAssyncError(async (req, res, next) => {
  try {
    const uploadedImageFile = req.files.uploadedImage[0];
    const profileImageFile = req.files.profileImage[0];
 
    if (!uploadedImageFile || !profileImageFile) {
      console.log('Verification failed: One or both images are missing');
      return res.status(400).json({ match: false, message: 'One or both images are missing' });
    }
 
    const uploadedImagePath = uploadedImageFile.path;
    const profileImagePath = profileImageFile.path;
 
    console.log('Uploaded image path:', uploadedImagePath);
    console.log('Profile image path:', profileImagePath);
 
    // Load images using canvas
    const uploadedImage = await canvas.loadImage(uploadedImagePath);
    const profileImage = await canvas.loadImage(profileImagePath);
 
    // Compute face descriptors
    const uploadedImageDescriptor = await faceapi.detectSingleFace(uploadedImage).withFaceLandmarks().withFaceDescriptor();
    const profileImageDescriptor = await faceapi.detectSingleFace(profileImage).withFaceLandmarks().withFaceDescriptor();
 
    // Check if both descriptors are valid
    if (!uploadedImageDescriptor || !profileImageDescriptor) {
      console.log('Verification failed: Face not detected in one or both images');
      return res.status(400).json({ match: false, message: 'Face not detected in one or both images' });
    }
 
    // Check if descriptors have valid values
    if (!uploadedImageDescriptor.descriptor || !profileImageDescriptor.descriptor) {
      console.log('Verification failed: Invalid face descriptors');
      return res.status(400).json({ match: false, message: 'Face not detected in one or both images' });
    }
 
    // Calculate distance between descriptors
    const distance = faceapi.euclideanDistance(uploadedImageDescriptor.descriptor, profileImageDescriptor.descriptor);
 
    // Compare the distance
    const isMatch = distance < 0.6; // Adjust threshold as needed
 
    if (isMatch) {
      console.log('Verification successful: Faces match with distance', distance);
    } else {
      console.log('Verification failed: Faces do not match with distance', distance);
    }
 
    // Send response
    res.json({ match: isMatch, distance });
 
    // Clean up
    fs.unlinkSync(uploadedImagePath);
    fs.unlinkSync(profileImagePath);
  } catch (error) {
    console.error('Error comparing faces:', error);
    res.status(500).json({ error: error.message });
  }
});

