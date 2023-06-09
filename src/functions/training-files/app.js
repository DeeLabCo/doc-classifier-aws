const {fetchNotSyncedDocuments, updateAnalysisRecordAsSynced} = require("../../utils/dynamodb_manager");
const {genCsvFromRecords} = require("../file-manager/services/csv_manager");
const {uploadCsvReportToS3} = require("../file-manager/services/s3_manager");
const {StatusCodes} = require("http-status-codes");
const scheduleSyncCsvFiles = async (event, context) => {
  try {
    const pendingSyncAnalysisRecords = await fetchNotSyncedDocuments();
    const csvAnalysisRecords = pendingSyncAnalysisRecords.map((pendingDocumentAnalysisRecord) => {
      return [pendingDocumentAnalysisRecord.label.S, pendingDocumentAnalysisRecord.text.S]
    });
    // const myRecords = [  [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ]];
    const fileName = await genCsvFromRecords(csvAnalysisRecords);
    await uploadCsvReportToS3(fileName);
    const analysisRecordsS3Key = pendingSyncAnalysisRecords.map((pendingDocumentAnalysisRecord) => {
      console.info(pendingDocumentAnalysisRecord);
      return pendingDocumentAnalysisRecord.s3_object_key.S;
    });
    console.info(analysisRecordsS3Key);
    await updateAnalysisRecordAsSynced(analysisRecordsS3Key);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.handler = scheduleSyncCsvFiles;