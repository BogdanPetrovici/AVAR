import { dynamoDBClient } from '@/app/lib/aws';
import {
  QueryCommand,
  DynamoDBDocumentClient,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';
import { Dayjs } from 'dayjs';
import { unstable_noStore as noStore } from 'next/cache';

import { Transaction } from '../model/transaction';

import { getTransactionKey } from '../utils';

const _tableName: string = process.env.DYNAMO_DB_TABLE ?? '';
const _dateKeyFormat: string = 'YYYYMMDD';

export class TransactionRepository {
  async getLatest(
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
      const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
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

  async getById(id: string): Promise<Transaction | undefined> {
    noStore();

    try {
      const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
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

  async count(dateString: String): Promise<number> {
    noStore();
    const sortKeyPrefix = `Transaction#${dateString}`;
    const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
    const command = new QueryCommand({
      TableName: _tableName,
      KeyConditionExpression: 'PK = :pk AND begins_with (SK, :skPrefix)',
      ExpressionAttributeValues: {
        ':pk': 'User#Account1',
        ':skPrefix': sortKeyPrefix,
      },
      ProjectionExpression: 'PK,SK',
      ConsistentRead: false,
      ScanIndexForward: false,
    });
    const response = await docClient.send(command);
    return response.Count ?? 0;
  }
}

export const transactionRepository: TransactionRepository =
  new TransactionRepository();
