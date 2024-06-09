import { dynamoDBClient } from '@/app/lib/aws';
import { QueryCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import { unstable_noStore as noStore } from 'next/cache';

const _tableName: string = process.env.DYNAMO_DB_TABLE ?? '';

export class TagRepository {
  async getTags() {
    noStore();

    try {
      const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
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
}

export const tagRepository = new TagRepository();
