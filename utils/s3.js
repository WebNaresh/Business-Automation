const aws = require("aws-sdk");
const { randomBytes } = require("crypto");

const s3 = new aws.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY,
  signatureVersion: "v4",
});

exports.uploadImage = async (file, user, folder = "default") => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${folder}/${user._id}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const uploadResult = await s3.upload(params).promise();
    return uploadResult.Location;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};
exports.generateSignedUrl = async () => {
  const bytes = await randomBytes(16);
  const imageName = bytes.toString("hex");

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 60,
  };

  const signedUrl = await s3.getSignedUrlPromise("putObject", params);
  return signedUrl;
};

exports.generateSignedUrlToFolder = async (employeeId, folder) => {
  console.log(`🚀 ~ file: s3.js:43 ~ employeeId, folder:`, employeeId, folder);
  const bytes = randomBytes(16);
  const imageName = bytes.toString("hex");

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${folder}/${employeeId}/${imageName}`,
    Expires: 120,
  };

  const signedUrl = await s3.getSignedUrlPromise("putObject", params);
  return signedUrl;
};

exports.updateUploadedImageUrl = async (file, url) => {
  const parts = url?.split("/");
  let smallParts = parts[4].split("-");

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${parts[3]}/${smallParts[0]}-${smallParts[1]}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const uploadResult = await s3.upload(params).promise();
    console.log(`🚀 ~ file: s3.js:28 ~ uploadResult:`, uploadResult);
    console.log("File uploaded successfully to S3:", uploadResult.Location);
    return uploadResult.Location;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};
exports.getUploadedImageUrlToUpdate = async (file, url) => {
  const parts = url?.split("/");
  let smallParts = parts[4].split("-");

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${parts[3]}/${smallParts[0]}-${smallParts[1]}`,
    Expires: 120,
  };

  try {
    const signedUrl = await s3.getSignedUrlPromise("putObject", params);

    return signedUrl;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};
exports.deleteImage = async (imageUrl) => {
  const parts = imageUrl.split("/");
  const bucketName = process.env.AWS_BUCKET_NAME;
  const key = parts.slice(3).join("/");

  const params = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    const deleteResult = await s3.deleteObject(params).promise();
    console.log("File deleted successfully from S3:", deleteResult);
    return deleteResult;
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw error;
  }
};
