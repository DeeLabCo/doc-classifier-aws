
// download to tmp Lambda
const fs = require('fs');
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

const client = new S3Client({ region: "us-east-1" });

const persistStream = (filePath, stream) => {
  return new Promise ((resolve, reject) => {
    stream.pipe(fs.createWriteStream(filePath))
      .on('error', (err) => {
        console.info('Error while persisting stream');
        reject(err);
      }).on('close', () => {
        console.info('Stream persisted in tmp');
        resolve()
      })
  });
};

const downloadFileAndStoreInTmp = async (bucketName, objectKey) => {
  const filePath = "/tmp/" + objectKey;
  const command = {
    Bucket: bucketName,
    Key: objectKey
  };
  const getObjectCommand = new GetObjectCommand(command);
  const fileData = await  client.send(getObjectCommand);
  const bodyStream = fileData.Body;
  return bodyStream;
  // await persistStream(filePath, bodyStream);
  // return filePath;
};

module.exports = {
  downloadFileAndStoreInTmp
}