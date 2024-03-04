'use server';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const FormSchema = z.object({
  PK: z.string(),
  SK: z.string(),
  Date: z.coerce.string(),
  Amount: z.coerce.number(),
  Description: z.string(),
  Tags: z.array(z.string()),
});

const UpdateTransaction = FormSchema.omit({ PK: true, SK: true });

export async function updateTransaction(id: string, formData: FormData) {
  try {
    const { Date, Amount, Description, Tags } = UpdateTransaction.parse({
      Date: formData.get('transaction-date'),
      Amount: formData.get('transaction-amount'),
      Description: formData.get('transaction-description'),
      Tags: formData.getAll('transaction-tags'),
    });

    const client = new DynamoDBClient({
      endpoint: 'http://localhost:8000',
      region: 'eu-central-1',
      credentials: { accessKeyId: 'xxxx', secretAccessKey: 'xxxx' },
    });
    const docClient = DynamoDBDocumentClient.from(client);
    const command = new UpdateCommand({
      TableName: 'Transactions',
      Key: { PK: 'User#Account1', SK: id },
      UpdateExpression:
        'set #date=:date, #amount=:amount, #description=:description, #tags=:tags',
      ExpressionAttributeValues: {
        ':date': Date,
        ':amount': Amount,
        ':description': Description,
        ':tags': new Set(Tags),
      },
      ExpressionAttributeNames: {
        '#date': 'Date',
        '#amount': 'Amount',
        '#description': 'Description',
        '#tags': 'Tags',
      },
      ReturnValues: 'ALL_NEW',
    });

    const response = await docClient.send(command);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to update transaction ${id}`);
  }

  revalidatePath('/transactions');
  redirect('/transactions');
}
