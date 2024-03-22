'use server';

import { Guid } from 'guid-typescript';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  BatchWriteCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import dayjs from 'dayjs';

export type State = {
  errors?: {
    Date?: string[];
    Amount?: string[];
    Tags?: string[];
  };
  message?: string | null;
};

const FormSchema = z.object({
  PK: z.string(),
  SK: z.string(),
  Date: z.coerce.date({
    required_error: 'Please select a Date.',
    invalid_type_error: 'The selected date is invalid.',
  }),
  Amount: z.coerce
    .number({ required_error: 'Please select an amount.' })
    .gt(0, { message: 'Please enter an amount greater than 0.' }),
  Description: z.string(),
  Tags: z
    .array(z.string())
    .min(1, { message: 'You must select at least one tag' })
    .max(4, { message: 'You can select 4 tags, at most' }),
});

export async function createTransaction(prevState: State, formData: FormData) {
  const validatedFields = UpdateTransaction.safeParse({
    Date: formData.get('transaction-date'),
    Amount: formData.get('transaction-amount'),
    Description: formData.get('transaction-description'),
    Tags: formData.getAll('transaction-tags'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create transaction.',
    };
  }

  try {
    const client = new DynamoDBClient({
      endpoint: 'http://localhost:8000',
      region: 'eu-central-1',
      credentials: { accessKeyId: 'xxxx', secretAccessKey: 'xxxx' },
    });
    const docClient = DynamoDBDocumentClient.from(client);

    const { Date, Amount, Description, Tags } = validatedFields.data;
    const formattedDate = dayjs(Date).format('YYYY-MM-DD');
    const transactionSortKey = `Transaction#${formattedDate}#${Guid.create().toString()}`;
    const createTransactionCommand = new PutCommand({
      TableName: 'Transactions',
      Item: {
        PK: 'User#Account1',
        SK: transactionSortKey,
        Date: formattedDate,
        Amount: Amount,
        Description: Description,
        Tags: new Set<string>(Tags),
      },
    });
    const transactionCreationResponse = await docClient.send(
      createTransactionCommand,
    );

    const newTags = formData.getAll('new-transaction-tags');
    await createTags(newTags, docClient);
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to create transaction.',
    };
  }

  revalidatePath('/transactions');
  redirect('/transactions');
}

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

    const newTags = formData.getAll('new-transaction-tags');
    await createTags(newTags, docClient);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to update transaction ${id}`);
  }

  revalidatePath('/transactions');
  redirect('/transactions');
}

export async function deleteTransaction(id: string) {
  try {
    const client = new DynamoDBClient({
      endpoint: 'http://localhost:8000',
      region: 'eu-central-1',
      credentials: { accessKeyId: 'xxxx', secretAccessKey: 'xxxx' },
    });
    const docClient = DynamoDBDocumentClient.from(client);
    const command = new DeleteCommand({
      TableName: 'Transactions',
      Key: { PK: 'User#Account1', SK: id },
    });

    const response = await docClient.send(command);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to delete transaction ${id}`);
  }

  revalidatePath('/transactions');
  redirect('/transactions');
}

async function createTags(
  newTags: FormDataEntryValue[],
  docClient: DynamoDBDocumentClient,
) {
  if (newTags === undefined || newTags === null || newTags.length == 0) {
    return null;
  }
  const tagSortKey = `Tag#Unpinned#${Guid.create().toString()}`;
  const tagPutRequests = newTags.map((tag) => ({
    PutRequest: {
      Item: {
        PK: 'User#Account1',
        SK: tagSortKey,
        Pinned: 0,
        Name: tag,
      },
    },
  }));

  const createTagsCommand = new BatchWriteCommand({
    RequestItems: {
      ['Transactions']: tagPutRequests,
    },
  });
  const tagsCreationResponse = await docClient.send(createTagsCommand);
  return tagsCreationResponse;
}
