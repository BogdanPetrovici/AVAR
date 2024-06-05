import styles from '@/app/ui/css/transactions.module.css';

import { Suspense } from 'react';
import { Skeleton } from '@mui/material';
import Pagination from '@/app/ui/components/pagination';
import TransactionsFilter from '@/app/ui/transactions/transactions-filter';
import TransactionsTable from '@/app/ui/transactions/transactions-table';
import { Dayjs } from 'dayjs';

import { fetchLatestTransactions } from '@/app/lib/data';
import { getTransactionId } from '@/app/lib/utils';

export default async function Transactions({
  from,
  to,
  page,
}: {
  from: Dayjs;
  to: Dayjs;
  page?: string;
}) {
  let transactionData = await fetchLatestTransactions(from, to, page);
  const nextPage =
    transactionData.lastKey !== undefined
      ? getTransactionId(transactionData.lastKey)
      : undefined;

  return (
    <>
      <TransactionsFilter
        initialFromDate={from.toDate()}
        initialToDate={to.toDate()}
      />
      <Suspense
        key={'transactionsTablePlaceholder' + from + to}
        fallback={
          <Skeleton
            variant="rounded"
            height={600}
            data-test="transactionsTablePlaceholder"
          />
        }
      >
        <TransactionsTable transactions={transactionData.transactions} />
      </Suspense>
      <div className={styles.paginationContainer}>
        <Pagination nextPage={nextPage} />
      </div>
    </>
  );
}
