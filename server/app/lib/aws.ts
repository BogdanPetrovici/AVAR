import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export const dynamoDBClient = new DynamoDBClient({
  endpoint: `http://${process.env.DYNAMO_DB_HOST}:${process.env.DYNAMO_DB_PORT}`,
  region: `${process.env.DYNAMO_DB_REGION}`,
  credentials: { accessKeyId: 'xxxx', secretAccessKey: 'xxxx' },
});
