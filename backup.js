require("dotenv").config();

const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const exec = require("./exec.js");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uri = process.env.LOCALHOST;
const backupName = "ok1";
const bucket = process.env.AWS_BUCKET_NAME;

const s3upload = ({ bucketName, keyName, filePath }) => {
  const s3 = new AWS.S3();

  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: bucketName,
    Key: keyName,
    Body: fileContent,
  };

  return s3.upload(params).promise();
};
// www.youtube.com/watch?v=Phg2ezNp-v0
https: (async () => {
  const __dirname = path.resolve();
  const dumpPath = path.resolve(__dirname, backupName);
  console.log("__dirname:", __dirname);
  console.log("backupName:", backupName);
  console.log("dumpPath:", dumpPath);

  const command = `mongodump --uri='${uri}' --gzip --archive=${dumpPath}`;

  try {
    await exec(command);

    // Upload the backup file to S3
    await s3upload({
      bucketName: bucket,
      keyName: `backup/${backupName}`,
      filePath: dumpPath,
    });

    console.log("Upload successful!");
  } catch (err) {
    console.log(`Upload failed: ${err}`);
  }
})();
