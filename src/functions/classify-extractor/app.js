const path = require('path');

const { downloadFileAndStoreInTmp } = require('./services/s3_services');
const untargz = require('./services/untargz_classification');

const CLASSIFICATION_BUCKET = process.env.CLASSIFICATION_BUCKET;

const checkClassificationOutput = async (event, context) => {
  // download the file from s3 and persist in tmp folder
  console.log('s3 trigger enabled');
  console.log("Received event: ", event);
  try {
    const s3TriggerRecordBody = event.Records[0].body;
    const recordBody = JSON.parse(s3TriggerRecordBody);
    const eventRecord = recordBody.Records[0];
    const eventName = eventRecord.eventName;
    if (eventName === 'ObjectCreated:Put') {
      const key = eventRecord.s3.object.key;
      const bucket = eventRecord.s3.bucket.name;
      console.log('Downloading object: ', { bucket, key });
      if (![".tar", ".gz", ".tar.gz"].includes(path.extname(key))) {
        console.log(`file extension ${path.extname(key)} is not being processed.`);
        return true;
      }
      // unzip the file and read the output
      const fileStream = await downloadFileAndStoreInTmp(bucket, key);
      // console.log('Object downloaded to: ', filePath);
      // const fileContent = await untargz(filePath);
      const fileContent = await untargz(fileStream);
      const classification = fileContent[0];
      console.log(classification);
      return true;
    }
  } catch (error) {
    console.error(error);
  }
};


exports.handler = checkClassificationOutput;