const {fetchDocumentTextDetection, extractTextFromBlocks } = require("../../utils/textract_manager")
// require("../file-manager/services/textract_manager");
const { updateAnalysisRecord, putAnalysisRecord } = require("../../utils/dynamodb_manager");

let checkExtractionResult = async (event, context) => {
    try {
        console.log("calling sqs function", event);
        const textExtractionResult = event.Records;
        const textractData = JSON.parse(textExtractionResult[0].body);
        const textractMessage = JSON.parse(textractData.Message);
        console.info(textractMessage)
        const jobId = textractMessage.JobId;
        console.info(jobId)
        const jobStatus = textractMessage.Status;
        console.info(jobStatus)
        const s3ObjectName = textractMessage.DocumentLocation.S3ObjectName;
        console.info(s3ObjectName)
        // fetch job info
        const documentContent  = await fetchDocumentTextDetection(jobId)
        const documentText = extractTextFromBlocks(documentContent);
        // TODO: generate a trigger from s3 to write the dynamodb record
        const createdAt = new Date().toISOString();
        await updateAnalysisRecord(s3ObjectName, documentText)
    } catch (error) {
        console.error(error);
    }
};

exports.handler = checkExtractionResult;
