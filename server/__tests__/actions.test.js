import '@testing-library/jest-dom';
import { createTransaction } from '../app/lib/actions';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { dynamoDBClient } from '../app/lib/aws';

describe('Create transaction action', () => {
  it('retries creation if id is unavailable', async () => {
    jest.spyOn(dynamoDBClient, 'send').mockImplementation(() => {
      throw new ConditionalCheckFailedException({});
    });

    const formData = new FormData();
    formData.append('transaction-date', '2024-05-30');
    formData.append('transaction-amount', '78.89');
    formData.append('transaction-description', 'test');
    formData.append('transaction-tags', 'Kaufland');

    await expect(
      createTransaction(dynamoDBClient, {
        Date: '2024-05-30',
        Amount: 78.89,
        Description: 'test',
        Tags: ['Kaufland'],
      }),
    ).rejects.toThrow('Could not create transaction');
    expect(dynamoDBClient.send.mock.calls.length).toBe(5);
  });
});
