import { DynamoDBClient, CreateTableCommand, PutItemCommand, GetItemCommand, UpdateItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

// 建立 DynamoDB Client
export const client = new DynamoDBClient({
    region: "us-east-1", // 必填，但本地 DynamoDB 不驗證
    endpoint: "http://localhost:8000",
    credentials: {
        accessKeyId: "fake",  // 本地測試可以隨便填
        secretAccessKey: "fake"
    }
});