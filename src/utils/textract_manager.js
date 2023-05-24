const {
    TextractClient,
    StartDocumentAnalysisCommand,
    StartDocumentTextDetectionCommand,
    GetDocumentAnalysisCommand,
    GetDocumentTextDetectionCommand
}  = require('@aws-sdk/client-textract');
const client = new TextractClient({ region: 'us-east-1' });

const requestDocumentTextDetection = async (fileKey) => {
    const command = new StartDocumentTextDetectionCommand({
        DocumentLocation: {
            S3Object: {
                Bucket: process.env.RAW_FILES_BUCKET,
                Name: fileKey,
            },
        },
        NotificationChannel: { // NotificationChannel
            SNSTopicArn: process.env.SNS_TOPIC_ARN,
            RoleArn: process.env.EXECUTION_ROLE_FOR_TEXTRACT
        }
    });
    console.info(JSON.stringify(command));
    const startDetectionResponse = await client.send(command);
    console.info("startAnalysisResponse", startDetectionResponse);
    return startDetectionResponse;
};

const requestDocumentAnalysis = async (fileKey) => {
    const command = new StartDocumentAnalysisCommand({
        DocumentLocation: {
            S3Object: {
                Bucket: process.env.RAW_FILES_BUCKET,
                Name: fileKey,
            },
        },
        NotificationChannel: { // NotificationChannel
            SNSTopicArn: process.env.SNS_TOPIC_ARN,
            RoleArn: process.env.EXECUTION_ROLE_FOR_TEXTRACT
        },
        FeatureTypes: ['TABLES', 'FORMS'],
    });
    const startAnalysisResponse = await client.send(command);
    console.info("startAnalysisResponse", startAnalysisResponse);
    return startAnalysisResponse;
};

const fetchDocumentAnalysis = async (jobId) => {
    const command = new GetDocumentAnalysisCommand({
        JobId: jobId,
    });
    const getAnalysisResponse = await client.send(command);
    console.info("getAnalysisResponse", getAnalysisResponse);
    return getAnalysisResponse;
};

const fetchDocumentTextDetection = async (jobId) => {
    const command = new GetDocumentTextDetectionCommand({
        JobId: jobId,
    });
    const getTextDetectionResponse = await client.send(command);
    console.info("getDetectionResponse", getTextDetectionResponse);
    return getTextDetectionResponse;
};

const extractTextFromBlocks = (textractTextDetectionContent) => {
    let textBody = textractTextDetectionContent.Blocks.map((wordData) => {
      if (wordData.Text) return wordData.Text;
      return null;
    });
    textBody = textBody.filter((text) => {return text !== null;});
    // join just with space no additional characters
    return textBody.join(' ');
}

module.exports = {
    requestDocumentAnalysis,
    fetchDocumentAnalysis,
    fetchDocumentTextDetection,
    requestDocumentTextDetection,
    extractTextFromBlocks
};