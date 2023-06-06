const {
    DynamoDBClient,
    PutItemCommand,
    UpdateItemCommand,
    QueryCommand
} = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: "us-east-1" });

const putClassificationResult = async (s3ObjectKey, createdAt, fileName, classification, score) => {
    const command = new PutItemCommand({
        "Item": {
            "s3_object_key": {
                "S": s3ObjectKey
            },
            "created_at": {
                "N": `${createdAt}`
            },
            "file_name": {
                "S": fileName
            },
            "classification": {
                "S": classification
            },
            "score": {
                "N": `${score}`
            }
        },
        "ReturnConsumedCapacity": "TOTAL",
        "TableName": process.env.DYNAMODB_RESULTS_TABLE
    });
    console.log(createdAt)
    const newClassificationResult = await client.send(command);
    console.info(newClassificationResult);
    return newClassificationResult;
}

module.exports = {
    putClassificationResult
};