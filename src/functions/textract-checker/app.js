const {fetchDocumentTextDetection, extractTextFromBlocks } = require("../../utils/textract_manager")
// require("../file-manager/services/textract_manager");
const { updateAnalysisRecord, putAnalysisRecord } = require("../../utils/dynamodb_manager");

let checkExtractionResult = async (event, context) => {
    try {
        console.log("calling sqs function", event);
        const textExtractionResult = event.Records;
        const textractData = JSON.parse(textExtractionResult[0].body);
        const textractMessage = JSON.parse(textractData.Message);
        const jobId = textractMessage.JobId;
        const jobStatus = textractMessage.Status;
        const s3ObjectName = textractMessage.DocumentLocation.S3ObjectName;
        const documentContent  = await fetchDocumentTextDetection(jobId)
        const documentText = extractTextFromBlocks(documentContent);
        await updateAnalysisRecord(s3ObjectName, documentText)
    } catch (error) {
        console.error(error);
    }
};

exports.handler = checkExtractionResult;
