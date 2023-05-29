const { downloadFileAndStoreInTmp } = require('./services/s3_services');

const CLASSIFICATION_BUCKET  = process.env.CLASSIFICATION_BUCKET;

const checkClassificationOutput = async  (event, context) => {
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
      // unzip the file and read the output
      await downloadFileAndStoreInTmp(bucket, key);
    }
  } catch (error) {
    console.error(error);
  }
};


exports.handler = checkClassificationOutput;