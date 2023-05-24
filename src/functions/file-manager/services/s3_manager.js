const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const client = new S3Client({region: "us-east-1"});

const RAW_FILES_BUCKET = process.env.RAW_FILES_BUCKET;
const CLASSIFICATION_FILES_BUCKET = process.env.CLASSIFICATION_FILES_BUCKET;

const retrieveBucketSignedUrl =  async (fileName, isClassification = false) => {
  const targetBucket = isClassification ? CLASSIFICATION_FILES_BUCKET : RAW_FILES_BUCKET;
  const putObjectParams = {
    Bucket: targetBucket,
    Key: fileName
  };
  console.info(putObjectParams);
  const command = new PutObjectCommand(putObjectParams);
  const presignedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
  console.info('the presigned url is: ', presignedUrl);
  return presignedUrl
};

let uploadCsvReportToS3 = async (fileName) => {
  let filePath = "/tmp/" + fileName;
  // Read content from the file
  const fileContent = fs.readFileSync(filePath);
  // TODO change bucket
  const putObjectParams = {
    Bucket: process.env.TRAINING_FILES_BUCKET,
    Key: fileName,
    Body: fileContent
  };
  console.info(putObjectParams);
  const command = new PutObjectCommand(putObjectParams);
  await client.send(command);
};

module.exports = {
  retrieveBucketSignedUrl,
  uploadCsvReportToS3
}