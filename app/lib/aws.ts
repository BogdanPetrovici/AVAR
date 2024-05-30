import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export const dynamoDBClient = new DynamoDBClient({
  endpoint: 'http://localhost:8000',
  region: 'eu-central-1',
  credentials: { accessKeyId: 'xxxx', secretAccessKey: 'xxxx' },
});
