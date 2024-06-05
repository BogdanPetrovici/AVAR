'use client';

import dayjs from 'dayjs';

import styles from '@/app/ui/css/transaction.module.css';

import { Autocomplete, Box, Button, Chip, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';

import Link from 'next/link';

import { Tag } from '@/app/lib/model/tag';
import { createTransactionAction, State } from '@/app/lib/actions';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import { toast } from 'react-hot-toast';

export default function CreateForm({ tags }: { tags: Tag[] }) {
  const filteredTags = tags.filter((tag) => Boolean(tag.Name));
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const initialState = { message: null, errors: {} };
  const [formState, formAction] = useFormState(
    handleCreateTransaction,
    initialState,
  );

  async function handleCreateTransaction(
    previousState: State,
    formData: FormData,
  ) {
    selectedTags.map((selectedTag) => {
      formData.append('transaction-tags', selectedTag);
      if (tags.find((tag) => tag.Name === selectedTag) === undefined) {
        formData.append('new-transaction-tags', selectedTag);
      }
    });

    return await createTransactionAction(previousState, formData);
  }

  if (formState?.message) {
    toast.error(formState.message);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box component="form" noValidate autoComplete="off" action={formAction}>
        <div className={styles.formContainer}>
          <div className={styles.fieldContainer}>
            <DatePicker
              name="transaction-date"
              key="transaction-date"
              format="YYYY-MM-DD"
              label="Date"
              slotProps={{
                textField: {
                  inputProps: {
                    'data-test': 'transaction-date',
                  },
                  InputLabelProps: {
                    shrink: true,
                  },
                  error: formState.errors?.Date !== undefined,
                  helperText: formState.errors?.Date,
                },
              }}
              sx={{ width: '100%' }}
            />
          </div>
          <div className={styles.fieldContainer}>
            <TextField
              name="transaction-amount"
              id="transaction-amount"
              label="Amount"
              variant="outlined"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ 'data-test': 'transaction-amount' }}
              sx={{ width: '100%' }}
              error={formState.errors?.Amount !== undefined}
              helperText={formState.errors?.Amount}
            />
          </div>
          <div className={styles.fieldContainer}>
            <TextField
              name="transaction-description"
              id="transaction-description"
              label="Description"
              variant="outlined"
              rows={4}
              multiline
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ 'data-test': 'transaction-description' }}
              sx={{ width: '100%' }}
              error={formState.errors?.Description !== undefined}
              helperText={formState.errors?.Description}
            />
          </div>
          <div className={styles.fieldContainer}>
            <Autocomplete
              multiple
              id="transaction-tags"
              options={filteredTags.map((option) => option.Name)}
              onChange={(e, value) => {
                setSelectedTags(value);
              }}
              freeSolo
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip
                    {...getTagProps({ index })}
                    variant="outlined"
                    label={option}
                    key={index}
                  />
                ))
              }
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option}>
                    {option}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Tags"
                  placeholder="Tags"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    ...params.inputProps,
                    'data-test': 'transaction-tags',
                  }}
                  error={formState.errors?.Tags !== undefined}
                  helperText={formState.errors?.Tags}
                />
              )}
            />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <Link href="/dashboard/transactions">
            <Button data-test="edit-cancel" variant="outlined">
              Cancel
            </Button>
          </Link>
          <Button data-test="edit-submit" variant="contained" type="submit">
            Create transaction
          </Button>
        </div>
      </Box>
    </LocalizationProvider>
  );
}
