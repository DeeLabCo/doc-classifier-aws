const { ComprehendClient, StartDocumentClassificationJobCommand } = require("@aws-sdk/client-comprehend");

const client = new ComprehendClient({ region: "us-east-1" });
const COMPREHEND_MODEL_ARN  = process.env.COMPREHEND_MODEL_ARN;
const DATA_ACCESS_ROLE_ARN = process.env.DATA_ACCESS_ROLE_ARN;

const startDocumentClassification = async (inputS3Uri, outputS3Uri) => {
  try {
    console.info('data access role: ', DATA_ACCESS_ROLE_ARN);
    const input = { // StartDocumentClassificationJobRequest
      JobName: "anyDocClassification",
      DocumentClassifierArn: COMPREHEND_MODEL_ARN,
      InputDataConfig: {
        S3Uri: inputS3Uri,
        InputFormat: "ONE_DOC_PER_FILE",
        DocumentReaderConfig: {
          DocumentReadAction: 'TEXTRACT_DETECT_DOCUMENT_TEXT',
          DocumentReadMode: 'SERVICE_DEFAULT',
        }
      },
      OutputDataConfig: { // OutputDataConfig
        S3Uri: outputS3Uri
      },
      DataAccessRoleArn: DATA_ACCESS_ROLE_ARN
    };
    const command = new StartDocumentClassificationJobCommand(input);
    const data = await client.send(command);
    console.log("data: ", data);
  } catch(error){
    console.error("could not start document classification job: ", error);
  }
};

module.exports  = { startDocumentClassification };