const aws = require("aws-sdk");
const crypto = require("crypto");
const { promisify } = require("util");

const randomBytes = promisify(crypto.randomBytes);

const s3 = new aws.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY,
  signatureVersion: "v4",
});

exports.generateSignedUrl = async () => {
  const bytes = await randomBytes(16);
  const imageName = bytes.toString("hex");
  const folderName = "profile-images";

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${folderName}/${imageName}`,
    Expires: 60,
  };

  const signedUrl = await s3.getSignedUrlPromise("putObject", params);
  return signedUrl;
};

exports.generateSignedUrlToUploadDocs = async (user, docName) => {
  const folderName = `${user.email}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `user-documents/${folderName}/${docName}`,
    Expires: 60,
  };

  const signedUrl = await s3.getSignedUrlPromise("putObject", params);
  return signedUrl;
};

exports.generateSignedUrlToUploadDocs = async (user, docName) => {
  const folderName = `${user.email}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `user-documents/${folderName}/${docName}`,
    Expires: 60,
  };

  const signedUrl = await s3.getSignedUrlPromise("putObject", params);
  return signedUrl;
};
exports.generateSignedUrlToUploadOrgDocs = async (user, docName) => {
  // const folderName = `${user.email}`;
  console.log(docName);

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `org-documents/${docName}`,
    Expires: 60,
  };

  const signedUrl = await s3.getSignedUrlPromise("putObject", params);
  return signedUrl;
};
