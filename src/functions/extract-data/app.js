const { requestDocumentTextDetection } = require('../../utils/textract_manager');
const extractDataFromDocument = async (event, context) => {
  try {
    console.log('s3 trigger enabled');
    console.log("Received event: ", event);
    const s3TriggerRecordBody = event.Records[0].body;
    const recordBody = JSON.parse(s3TriggerRecordBody);
    console.log(recordBody);
    const eventRecord = recordBody.Records[0];
    console.log(eventRecord);
    const eventName = eventRecord.eventName;
    if (eventName === 'ObjectCreated:Put') {
      const key = eventRecord.s3.object.key;
      const bucket = eventRecord.s3.bucket.name;
      console.info(`File ${key} uploaded to bucket ${bucket}`);
      await requestDocumentTextDetection(key)
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.handler = extractDataFromDocument;