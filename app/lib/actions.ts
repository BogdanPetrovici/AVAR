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
    Description?: string[];
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
    .gt(0, { message: 'Please enter an amount greater than 0.' })
    .lt(100000, { message: 'Amount must be lower than 100000' }),
  Description: z
    .string()
    .max(500, { message: 'Description should be 500 characters at most' }),
  Tags: z
    .array(
      z
        .string()
        .max(50, { message: 'Tags should have 50 characters, at most' }),
    )
    .min(1, { message: 'You must select at least one tag' })
    .max(4, { message: 'You can select 4 tags, at most' }),
});

const CreateTransaction = FormSchema.omit({ PK: true, SK: true });

export async function createTransactionAction(
  prevState: State,
  formData: FormData,
) {
  const validatedFields = CreateTransaction.safeParse({
    Date: formData.get('transaction-date'),
    Amount: formData.get('transaction-amount'),
    Description: formData.get('transaction-description'),
    Tags: formData.getAll('transaction-tags'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to create transaction.',
    };
  }

  try {
    const client = new DynamoDBClient({
      endpoint: 'http://localhost:8000',
      region: 'eu-central-1',
      credentials: { accessKeyId: 'xxxx', secretAccessKey: 'xxxx' },
    });
    const docClient = DynamoDBDocumentClient.from(client);
    await createTransaction(docClient, validatedFields.data);
    const newTags = formData.getAll('new-transaction-tags');
    await createTags(docClient, newTags);
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

export async function updateTransaction(
  id: string,
  prevState: State,
  formData: FormData,
) {
  try {
    const validatedFields = UpdateTransaction.safeParse({
      Date: formData.get('transaction-date'),
      Amount: formData.get('transaction-amount'),
      Description: formData.get('transaction-description'),
      Tags: formData.getAll('transaction-tags'),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Update transaction.',
      };
    }

    const client = new DynamoDBClient({
      endpoint: 'http://localhost:8000',
      region: 'eu-central-1',
      credentials: { accessKeyId: 'xxxx', secretAccessKey: 'xxxx' },
    });
    const docClient = DynamoDBDocumentClient.from(client);

    const { Date, Amount, Description, Tags } = validatedFields.data;
    const formattedDate = dayjs(Date).format('YYYY-MM-DD');
    const dateChanged = formData.get('transaction-date-changed');
    // if the date hasn't changed, update the relevant fields
    if (dateChanged === 'false') {
      const command = new UpdateCommand({
        TableName: 'Transactions',
        Key: { PK: 'User#Account1', SK: id },
        UpdateExpression:
          'set #date=:date, #amount=:amount, #description=:description, #tags=:tags',
        ExpressionAttributeValues: {
          ':date': formattedDate,
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
    } else {
      // if the date changed, delete the item and recreate it accordingly - the date is part of the range key
      await deleteTransaction(docClient, id);
      await createTransaction(docClient, validatedFields.data);
    }

    const newTags = formData.getAll('new-transaction-tags');
    await createTags(docClient, newTags);
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to create transaction.',
    };
  }

  revalidatePath('/transactions');
  redirect('/transactions');
}

export async function deleteTransactionAction(id: string) {
  const client = new DynamoDBClient({
    endpoint: 'http://localhost:8000',
    region: 'eu-central-1',
    credentials: { accessKeyId: 'xxxx', secretAccessKey: 'xxxx' },
  });
  const docClient = DynamoDBDocumentClient.from(client);
  await deleteTransaction(docClient, id);
  revalidatePath('/transactions');
  redirect('/transactions');
}

async function createTransaction(
  docClient: DynamoDBDocumentClient,
  {
    Date,
    Amount,
    Description,
    Tags,
  }: {
    Date: Date;
    Amount: Number;
    Description: String;
    Tags: string[];
  },
) {
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
}

async function deleteTransaction(
  docClient: DynamoDBDocumentClient,
  id: string,
) {
  try {
    const command = new DeleteCommand({
      TableName: 'Transactions',
      Key: { PK: 'User#Account1', SK: id },
    });

    const response = await docClient.send(command);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to delete transaction ${id}`);
  }
}

async function createTags(
  docClient: DynamoDBDocumentClient,
  newTags: FormDataEntryValue[],
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
