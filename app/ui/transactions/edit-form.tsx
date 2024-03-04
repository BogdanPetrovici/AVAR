'use client';

import dayjs from 'dayjs';

import { Autocomplete, Box, Button, Chip, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';

import Link from 'next/link';

import { Transaction } from '@/app/lib/model/transaction';
import { Tag } from '@/app/lib/model/tag';
import { updateTransaction } from '@/app/lib/actions';
import { useState } from 'react';

export default function EditForm({
  transaction,
  tags,
}: {
  transaction: Transaction;
  tags: Tag[];
}) {
  const filteredTags = tags.filter((tag) => Boolean(tag.Name));
  const [selectedTags, setSelectedTags] = useState(transaction.Tags);

  function handleUpdateTransaction(formData: FormData) {
    selectedTags.map((selectedTag) =>
      formData.append(`transaction-tags`, selectedTag),
    );
    updateTransaction(transaction.SK, formData);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        action={handleUpdateTransaction}
      >
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          <div className="mb-4">
            <DatePicker
              name="transaction-date"
              key="transaction-date"
              format="YYYY-MM-DD"
              label="Date"
              defaultValue={dayjs(transaction.Date)}
              slotProps={{
                textField: {
                  inputProps: { 'data-testid': 'transaction-date' },
                  InputLabelProps: {
                    shrink: true,
                  },
                },
              }}
            />
          </div>
          <div className="mb-4">
            <TextField
              name="transaction-amount"
              id="transaction-amount"
              label="Amount"
              variant="outlined"
              type="number"
              defaultValue={transaction.Amount}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <div className="mb-4">
            <TextField
              name="transaction-description"
              id="transaction-description"
              label="Description"
              variant="outlined"
              rows={4}
              multiline
              defaultValue={transaction.Description}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <div className="mb-4">
            <Autocomplete
              multiple
              id="transaction-tags"
              options={filteredTags.map((option) => option.Name)}
              defaultValue={transaction.Tags}
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
                />
              )}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Link href="/transactions">
            <Button data-testid="edit-cancel" variant="outlined">
              Cancel
            </Button>
          </Link>
          <Button data-testid="edit-submit" variant="contained" type="submit">
            Edit transaction
          </Button>
        </div>
      </Box>
    </LocalizationProvider>
  );
}
