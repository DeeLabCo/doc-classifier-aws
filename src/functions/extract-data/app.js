const { requestDocumentTextDetection } = require('../../utils/textract_manager');
const extractDataFromDocument = async (event, context) => {
  try {
    console.log('s3 trigger enabled');
    console.log("Received event: ", event);
    const s3TriggerRecordBody = event.Records[0].body;
    const recordBody = JSON.parse(s3TriggerRecordBody);
    const eventRecords = recordBody.Records;
    if (!eventRecords) {
      console.log('no records detected for event');
      return true
    }
    const eventRecord = eventRecords[0];
    const eventName = eventRecord.eventName;
    if (eventName && eventName === 'ObjectCreated:Put') {
      const key = eventRecord.s3.object.key;
      const bucket = eventRecord.s3.bucket.name;
      console.info(`File ${key} uploaded to bucket ${bucket}`);
      await requestDocumentTextDetection(key)
    } else {
      console.info(`event name not recognized: ${eventName}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.handler = extractDataFromDocument;