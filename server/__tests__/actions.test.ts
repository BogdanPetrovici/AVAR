import '@testing-library/jest-dom';
import { createTransaction } from '../app/lib/actions';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { dynamoDBClient } from '../app/lib/aws';
import { expect, jest } from '@jest/globals';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

describe('Create transaction action', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retries creation if id is unavailable', async () => {
    const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
    const spy = jest
      .spyOn(DynamoDBDocumentClient.prototype, 'send')
      .mockImplementationOnce(() => {
        throw new ConditionalCheckFailedException({
          $metadata: {},
          message: '',
        });
      })
      .mockImplementationOnce(() => {
        return {};
      });

    const formData = new FormData();
    formData.append('transaction-date', '2024-05-30');
    formData.append('transaction-amount', '78.89');
    formData.append('transaction-description', 'test');
    formData.append('transaction-tags', 'Kaufland');

    await expect(
      createTransaction(docClient, {
        Date: '2024-05-30',
        Amount: 78.89,
        Description: 'test',
        Tags: ['Kaufland'],
      }),
    ).resolves;
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('retries sending command only 5 times', async () => {
    const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
    const spy = jest
      .spyOn(DynamoDBDocumentClient.prototype, 'send')
      .mockImplementation(() => {
        throw new ConditionalCheckFailedException({
          $metadata: {},
          message: '',
        });
      });

    const formData = new FormData();
    formData.append('transaction-date', '2024-05-30');
    formData.append('transaction-amount', '78.89');
    formData.append('transaction-description', 'test');
    formData.append('transaction-tags', 'Kaufland');

    await expect(
      createTransaction(docClient, {
        Date: '2024-05-30',
        Amount: 78.89,
        Description: 'test',
        Tags: ['Kaufland'],
      }),
    ).rejects.toThrow('Could not create transaction');
    expect(spy).toHaveBeenCalledTimes(5);
  });
});
