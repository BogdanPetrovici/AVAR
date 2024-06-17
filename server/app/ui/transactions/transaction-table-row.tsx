'use client';

import styles from '@/app/ui/css/transactions-table.module.css';
import { Chip } from '@mui/material';

import {
  UpdateTransaction,
  ExpandTransaction,
} from '@/app/ui/components/buttons';

import {
  formatDateToLocal,
  formatCurrency,
  getTransactionId,
} from '@/app/lib/utils';
import { Transaction } from '@/app/lib/model/transaction';
import { useState } from 'react';

export default function TransactionTableRow({
  transaction,
}: {
  transaction: Transaction;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  function onSetExpanded() {
    setIsExpanded(!isExpanded);
  }

  const transactionId = getTransactionId(transaction.SK);
  const tagElements = transaction.Tags.map((tag) => {
    return (
      <Chip
        variant="outlined"
        sx={{ marginRight: '5px' }}
        key={tag}
        label={tag}
      />
    );
  });

  return (
    <>
      <tr>
        <td>{formatDateToLocal(transaction.Date)}</td>
        <td>{formatCurrency(transaction.Amount, 'RON')}</td>
        <td className={styles.optionalCell}>{tagElements}</td>
        <td>
          <div className={styles.buttonContainer}>
            <UpdateTransaction id={transactionId} />
            <ExpandTransaction
              isPressed={isExpanded}
              onClick={onSetExpanded}
              className={styles.expandButton}
            />
          </div>
        </td>
      </tr>
      {isExpanded && (
        <>
          <tr className={`${styles.fadeIn} ${styles.optionalRow}`}>
            <th>Tags</th>
          </tr>
          <tr className={`${styles.fadeIn} ${styles.optionalRow}`}>
            <td colSpan={4}>{tagElements}</td>
          </tr>
        </>
      )}
    </>
  );
}
