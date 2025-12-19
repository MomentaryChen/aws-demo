import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();
const awsConfig = new pulumi.Config("aws");

// 從配置中讀取參數
const region = awsConfig.get("region") || "us-east-1";
const accessKey = awsConfig.get("accessKey") || "test";
const secretKey = awsConfig.get("secretKey") || "test";
const skipCredentialsValidation = awsConfig.getBoolean("skipCredentialsCheck") ?? true;
const skipMetadataApiCheck = awsConfig.getBoolean("skipMetadataApiCheck") ?? true;
const skipRequestingAccountId = awsConfig.getBoolean("skipRequestingAccountId") ?? true;
const s3UsePathStyle = awsConfig.getBoolean("s3UsePathStyle") ?? true;

// 從配置中讀取 endpoint，預設為 localhost:4566
const endpointBase = awsConfig.get("endpoint") || "http://localhost:4566";

const localstackProvider = new aws.Provider("localstack", {
    region: region as aws.Region,
    accessKey: accessKey,
    secretKey: secretKey,
    skipCredentialsValidation: skipCredentialsValidation,
    skipMetadataApiCheck: skipMetadataApiCheck,
    skipRequestingAccountId: skipRequestingAccountId, // 關鍵：跳過檢查帳號 ID，LocalStack 有時會在此報錯
    s3UsePathStyle: s3UsePathStyle,         // 關鍵：使用路徑模式
    endpoints: [
        {
            s3: endpointBase,
            iam: endpointBase,
            sts: endpointBase,
        },
    ],
});

// 建立 Bucket 時，請確保傳入 provider
const bucket = new aws.s3.BucketV2("my-bucket", {}, { 
    provider: localstackProvider 
});

export const bucketName = bucket.bucket;