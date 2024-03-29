'use client';

import { deleteTransaction } from '@/app/lib/actions';
import { Transaction } from '@/app/lib/model/transaction';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { useState } from 'react';

export default function DeleteForm({
  transaction,
}: {
  transaction: Transaction;
}) {
  const [showDialog, setShowDialog] = useState(false);
  let deleteTransactionWithId = deleteTransaction.bind(null, transaction.SK);

  return (
    <>
      <Button
        data-testid="delete-submit"
        variant="contained"
        type="button"
        color="error"
        onClick={() => {
          setShowDialog(true);
        }}
      >
        Delete transaction
      </Button>
      <Dialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
        }}
      >
        <DialogTitle>Confirm action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this transaction?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <form action={deleteTransactionWithId}>
            <Button color="primary" variant="contained" type="submit">
              Yes
            </Button>
          </form>
          <Button
            onClick={() => {
              setShowDialog(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
