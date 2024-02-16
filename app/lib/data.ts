import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { QueryCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Dayjs } from 'dayjs';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchLatestTransactions(fromDate: Dayjs, toDate: Dayjs) {
  noStore();

  try {
    const sortKeyLowerBound = `Transaction#${fromDate.format('YYYY-MM-DD')}`;
    const sortKeyUpperBound = `Transaction#${toDate.format('YYYY-MM-DD')}`;
    const client = new DynamoDBClient({
      endpoint: 'http://localhost:8000',
      region: 'eu-central-1',
      credentials: { accessKeyId: 'xxxx', secretAccessKey: 'xxxx' },
    });
    const docClient = DynamoDBDocumentClient.from(client);
    const command = new QueryCommand({
      TableName: 'Transactions',
      KeyConditionExpression: 'PK = :pk AND SK BETWEEN :skBottom AND :skTop',
      ExpressionAttributeValues: {
        ':pk': 'Account#Account1',
        ':skBottom': sortKeyLowerBound,
        ':skTop': sortKeyUpperBound,
      },
      ConsistentRead: false,
      ScanIndexForward: false,
    });

    const response = await docClient.send(command);
    return response;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest transactions.');
  }
}
