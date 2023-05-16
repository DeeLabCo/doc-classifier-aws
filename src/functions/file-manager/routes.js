const express = require("express");
const api = express.Router();
const { StatusCodes } = require("http-status-codes");
const { retrieveBucketSignedUrl, uploadCsvReportToS3 } = require('./services/s3_manager');
const { requestDocumentTextDetection } = require('../../utils/textract_manager');
const {
  putAnalysisRecord,
  updateAnalysisRecordWithLabel,
  fetchNotSyncedDocuments,
  updateAnalysisRecordAsSynced
} = require('../../utils/dynamodb_manager');
const { genCsvFromRecords } = require('./services/csv_manager');
// route handler
api.post("/put-document", async (request, response, next) => {
    try {
      const requestBody = request.body;
      const requestData = requestBody.data;
      const fileName = requestData.file_name;
      const signedUlr = await retrieveBucketSignedUrl(fileName);
      response.status(StatusCodes.OK).send({ signed_url: signedUlr });
    } catch (error) {
      console.log(error);
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: "echo endpoint" });
    }
});

api.post('/start-document-text-detection', async (request, response, next) =>  {
    try {
      const requestBody = request.body;
      const requestData = requestBody.data;
      const fileName = requestData.file_name;
      const createdAt = new Date().valueOf();
      const textDetectionData = await requestDocumentTextDetection(fileName);
      const jobId = textDetectionData.JobId;
      console.info(jobId);
      await putAnalysisRecord(fileName, createdAt, jobId)
      response.status(StatusCodes.OK).send({ signed_url: textDetectionData });
    } catch (error) {
      console.log(error);
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: "start doc text detection failed" });
    }
});

api.post('/label-document', async (request, response) => {
    try {
      const requestBody = request.body;
      const requestData = requestBody.data;
      const fileName = requestData.file_name;
      const label = requestData.label;
      await updateAnalysisRecordWithLabel(fileName, label);
      response.status(StatusCodes.OK).send({ data: {
        file_name: fileName,
        label: label
      }});
    } catch (error) {
      console.log(error);
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: "label document failed" });
    }
});

api.get('/sync-csv', async (request, response) => {
  const pendingSyncAnalysisRecords = await fetchNotSyncedDocuments(); //
  const csvAnalysisRecords = pendingSyncAnalysisRecords.map((pendingDocumentAnalysisRecord) => {
    return [pendingDocumentAnalysisRecord.label.S, pendingDocumentAnalysisRecord.text.S]
  });
  console.log(csvAnalysisRecords);
  // const myRecords = [  [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ]];
  const fileName = await genCsvFromRecords(csvAnalysisRecords);
  console.log('fileGenerated: ', fileName);
  await uploadCsvReportToS3(fileName);
  const analysisRecordsS3Key = pendingSyncAnalysisRecords.map((pendingDocumentAnalysisRecord) => {
    console.info(pendingDocumentAnalysisRecord);
    return pendingDocumentAnalysisRecord.s3_object_key.S;
  });
  console.info(analysisRecordsS3Key);
  await updateAnalysisRecordAsSynced(analysisRecordsS3Key);
  response.status(StatusCodes.OK).send({ data: {
    msg: 'TODO process csv'
  }});
});

module.exports = api;
