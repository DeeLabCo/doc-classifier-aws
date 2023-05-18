const { startDocumentClassification } = require('../../utils/comprehend_manager');
let checkFileAndClassify = async (event, context) => {
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
      const inputS3Uri = `s3://${bucket}/${key}`;
      const outputS3Uri = `s3://document-analysis-tbbc-test/`;
      console.info(inputS3Uri);
      console.info(outputS3Uri);
      await startDocumentClassification(inputS3Uri, outputS3Uri);
    }
  } catch (error) {
    console.error(error);
  }
};

exports.handler = checkFileAndClassify;
