const path = require('path');

const { downloadFileAndStoreInTmp } = require('./services/s3_services');
const untargz = require('./services/untargz_classification');
const { putClassificationResult } = require('./services/dynamo_services');

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
      const fileContent = await untargz(fileStream);
      let classification = fileContent[0];
      classification = classification.filter(page => page.DocumentMetadata != undefined && page.DocumentMetadata.PageNumber == 1);
      // console.log(classification[0]);
      let selected_class = classification[0].Classes[0];
      for (let tem_class of classification[0].Classes) {
        if (tem_class.Score > selected_class.Score)
          selected_class = tem_class;
      }
      const created_at = new Date().valueOf();
      const Saving_Info = {
        s3ObjectKey: key,
        createdAt: created_at,
        fileName: classification[0].File,
        classification: selected_class.Name,
        score: selected_class.Score,
      };
      console.log(Saving_Info);
      const savingResult = await putClassificationResult(key, created_at, classification[0].File, selected_class.Name, selected_class.Score);
      return true;
    }
  } catch (error) {
    console.error(error);
  }
};


exports.handler = checkClassificationOutput;