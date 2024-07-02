import '@testing-library/jest-dom';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { dynamoDBClient } from '../app/lib/aws';
import { expect, jest } from '@jest/globals';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import { transactionRepository } from '../app/lib/repository/transaction.repository';

import { createTransaction } from '../app/lib/actions';

describe('Create transaction action', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retries creation if id is unavailable', async () => {
    const transactionRepositorySpy = jest
      .spyOn(transactionRepository, 'count')
      .mockImplementation(async (dateString: String) => {
        return 1;
      });
    const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
    const emptySuccessfulResult = {};
    const spy = jest
      .spyOn(docClient, 'send')
      .mockImplementationOnce(() => {
        throw new ConditionalCheckFailedException({
          $metadata: {},
          message: '',
        });
      })
      .mockImplementationOnce(() => {
        return emptySuccessfulResult;
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
    ).resolves.toBe(emptySuccessfulResult);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('retries sending command only 5 times', async () => {
    const transactionRepositorySpy = jest
      .spyOn(transactionRepository, 'count')
      .mockImplementation(async (dateString: String) => {
        return 1;
      });
    const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
    const spy = jest.spyOn(docClient, 'send').mockImplementation(() => {
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
