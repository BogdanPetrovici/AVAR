import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  QueryCommand,
  DynamoDBDocumentClient,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';
import { Dayjs } from 'dayjs';
import { unstable_noStore as noStore } from 'next/cache';

import { Transaction } from './model/transaction';

import { getTransactionKey } from './utils';

const _tableName: string = process.env.DYNAMO_DB_TABLE ?? '';
const _dateKeyFormat: string = 'YYYYMMDD';

export async function fetchLatestTransactions(
  fromDate: Dayjs,
  toDate: Dayjs,
  lastEvaluatedTransactionId?: string,
): Promise<{ transactions: Transaction[]; lastKey?: string }> {
  noStore();
  if (fromDate > toDate) {
    return { transactions: [] };
  }

  try {
    const sortKeyLowerBound = `Transaction#${fromDate.format(_dateKeyFormat)}`;
    const sortKeyUpperBound = `Transaction#${toDate.add(1, 'day').format(_dateKeyFormat)}`;
    const client = new DynamoDBClient({
      endpoint: 'http://localhost:8000',
      region: 'eu-central-1',
      credentials: { accessKeyId: 'xxxx', secretAccessKey: 'xxxx' },
    });
    const docClient = DynamoDBDocumentClient.from(client);
    const command = new QueryCommand({
      TableName: _tableName,
      KeyConditionExpression: 'PK = :pk AND SK BETWEEN :skBottom AND :skTop',
      ExpressionAttributeValues: {
        ':pk': 'User#Account1',
        ':skBottom': sortKeyLowerBound,
        ':skTop': sortKeyUpperBound,
      },
      ConsistentRead: false,
      ScanIndexForward: false,
      Limit: 10,
    });

    if (lastEvaluatedTransactionId !== undefined) {
      const lastEvaluatedKey = getTransactionKey(lastEvaluatedTransactionId);
      command.input.ExclusiveStartKey = {
        PK: 'User#Account1',
        SK: lastEvaluatedKey,
      };
    }

    const response = await docClient.send(command);
    if (response.Items == null) {
      throw new Error('Failed to fetch the latest transactions.');
    }

    return {
      transactions: response.Items.map((item) => {
        return {
          PK: item.PK,
          SK: item.SK,
          Date: item.Date,
          Amount: item.Amount,
          Tags: Array.from(item.Tags),
          Description: item.Description,
        };
      }),
      lastKey: response.LastEvaluatedKey?.SK,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest transactions.');
  }
}

export async function getTransactionById(
  id: string,
): Promise<Transaction | undefined> {
  noStore();

  try {
    const client = new DynamoDBClient({
      endpoint: 'http://localhost:8000',
      region: 'eu-central-1',
      credentials: { accessKeyId: 'xxxx', secretAccessKey: 'xxxx' },
    });
    const docClient = DynamoDBDocumentClient.from(client);
    const command = new GetCommand({
      TableName: _tableName,
      Key: {
        PK: 'User#Account1',
        SK: getTransactionKey(id),
      },
    });

    const response = await docClient.send(command);
    if (response.Item != null) {
      return {
        PK: response.Item.PK,
        SK: response.Item.SK,
        Date: response.Item.Date,
        Amount: response.Item.Amount,
        Tags: Array.from(response.Item.Tags),
        Description: response.Item.Description,
      };
    }
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch transaction ${id}`);
  }
}

export async function getTags() {
  noStore();

  try {
    const client = new DynamoDBClient({
      endpoint: 'http://localhost:8000',
      region: 'eu-central-1',
      credentials: { accessKeyId: 'xxxx', secretAccessKey: 'xxxx' },
    });

    const docClient = DynamoDBDocumentClient.from(client);
    const command = new QueryCommand({
      TableName: _tableName,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': 'User#Account1',
      },
      ConsistentRead: false,
      ScanIndexForward: false,
    });

    const response = await docClient.send(command);
    if (response.Items == null || response.Items.length == 0) {
      throw new Error('Could not find any tag');
    }

    return response.Items?.map((tag) => {
      return {
        PK: tag.PK,
        SK: tag.SK,
        Pinned: tag.Pinned,
        Name: tag.Name,
      };
    });
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Could not fetch tags');
  }
}
