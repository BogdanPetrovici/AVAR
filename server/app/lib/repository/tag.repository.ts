import { dynamoDBClient } from '@/app/lib/aws';
import { QueryCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import { unstable_noStore as noStore } from 'next/cache';

import { TagList } from '@/app/lib/view-model/tag-list.viewmodel';
import { Tag } from '../model/tag.model';

const _tableName: string = process.env.DYNAMO_DB_TABLE ?? '';

export class TagRepository {
  async getTags(limit?: number, lastEvaluatedKey?: string): Promise<TagList> {
    noStore();

    try {
      const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
      const command = new QueryCommand({
        TableName: _tableName,
        KeyConditionExpression: 'PK = :pk AND begins_with (SK, :skPrefix)',
        ExpressionAttributeValues: {
          ':pk': 'User#Account1',
          ':skPrefix': 'Tag#',
        },
        ConsistentRead: false,
        ScanIndexForward: true,
      });

      if (limit !== undefined) {
        command.input.Limit = limit;
      }

      if (lastEvaluatedKey !== undefined) {
        command.input.ExclusiveStartKey = {
          PK: 'User#Account1',
          SK: lastEvaluatedKey,
        };
      }

      const response = await docClient.send(command);
      if (response.Items == null || response.Items.length == 0) {
        throw new Error('Could not find any tag');
      }

      const tags: Tag[] = response.Items?.map((tag) => {
        return {
          PK: tag.PK,
          SK: tag.SK,
          Name: tag.Name,
        };
      });

      return { Tags: tags, LastKey: response.LastEvaluatedKey?.SK };
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Could not fetch tags');
    }
  }
}

export const tagRepository = new TagRepository();
