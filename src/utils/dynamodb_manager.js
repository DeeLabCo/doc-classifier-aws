const {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
  QueryCommand
} = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: "us-east-1" });

let updateAnalysisRecord = async (s3ObjectKey, text) => {
  const command =  new UpdateItemCommand({
    "ExpressionAttributeNames": {
      "#text": "text"
    },
    "ExpressionAttributeValues": {
      ":text": {
        "S": text
      },
    },
    "Key": {
      "s3_object_key": {
        "S": s3ObjectKey
      }
    },
    "ReturnValues": "ALL_NEW",
    "TableName": process.env.DYNAMODB_DOCUMENTS_TABLE,
    "UpdateExpression": "SET #text = :text"
  });
  const updatedAnalysisRecord  = await client.send(command);
  console.info(updatedAnalysisRecord);
  return updatedAnalysisRecord;
}

let updateAnalysisRecordWithLabel = async (s3ObjectKey, label) => {
  const command =  new UpdateItemCommand({
    "ExpressionAttributeNames": {
      "#label": "label"
    },
    "ExpressionAttributeValues": {
      ":label": {
        "S": label
      },
    },
    "Key": {
      "s3_object_key": {
        "S": s3ObjectKey
      }
    },
    "ReturnValues": "ALL_NEW",
    "TableName": process.env.DYNAMODB_DOCUMENTS_TABLE,
    "UpdateExpression": "SET #label = :label"
  });
  const updatedAnalysisRecord  = await client.send(command);
  console.info(updatedAnalysisRecord);
  return updatedAnalysisRecord;
};

let putAnalysisRecord = async (s3ObjectKey, createdAt, jobId, s3ObjectText) => {
  const command = new PutItemCommand({
    "Item": {
      "s3_object_key": {
        "S": s3ObjectKey
      },
      "sync": {
        "N": "0"
      },
      "created_at": {
        "N": `${createdAt}`
      },
      "job_id": {
        "S": jobId
      }
    },
    "ReturnConsumedCapacity": "TOTAL",
    "TableName": process.env.DYNAMODB_DOCUMENTS_TABLE
  });
  console.log(createdAt)
  const newAnalysisRecord = await client.send(command);
  console.info(newAnalysisRecord);
  return newAnalysisRecord;
}

let fetchNotSyncedDocuments = async () => {
  const input = {
    "ExpressionAttributeValues": {
      ":sync": {
        "N": "0"
      }
    },
    "KeyConditionExpression": "sync = :sync",
    "IndexName": "sync-status-index",
    "TableName": process.env.DYNAMODB_DOCUMENTS_TABLE
  };
  const command = new QueryCommand(input);
  const notSyncedDocuments = await client.send(command);
  const notSyncedDocumentsItems = notSyncedDocuments.Items;
  console.log(notSyncedDocumentsItems);
  return notSyncedDocumentsItems;
};

let updateAnalysisRecordAsSynced = async (analysisRecordsS3Keys) => {
  const analysisRecordsUpdateSyncPromises = analysisRecordsS3Keys.map(async (s3ObjectKey) => {
    const command =  new UpdateItemCommand({
      "ExpressionAttributeNames": {
        "#sync": "sync"
      },
      "ExpressionAttributeValues": {
        ":sync": {
          "N": "1"
        },
      },
      "Key": {
        "s3_object_key": {
          "S": s3ObjectKey
        }
      },
      "ReturnValues": "ALL_NEW",
      "TableName": process.env.DYNAMODB_DOCUMENTS_TABLE,
      "UpdateExpression": "SET #sync = :sync"
    });
    return client.send(command);
  });
  console.log(analysisRecordsUpdateSyncPromises)
  const updateResult = await Promise.allSettled(analysisRecordsUpdateSyncPromises);
  console.info(updateResult);
  return null;
};

module.exports = {
  updateAnalysisRecord,
  putAnalysisRecord,
  updateAnalysisRecordWithLabel,
  fetchNotSyncedDocuments,
  updateAnalysisRecordAsSynced
};
