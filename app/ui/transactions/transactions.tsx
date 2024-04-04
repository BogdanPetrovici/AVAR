import { Suspense } from 'react';
import { Skeleton } from '@mui/material';
import TransactionsFilter from '@/app/ui/transactions/transactions-filter';
import TransactionsTable from '@/app/ui/transactions/transactions-table';
import { Dayjs } from 'dayjs';

export default function Transactions({
  from,
  to,
  currentPage,
}: {
  from: Dayjs;
  to: Dayjs;
  currentPage: number;
}) {
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
        <TransactionsTable
          fromDate={from}
          toDate={to}
          currentPage={currentPage}
        />
      </Suspense>
    </>
  );
}
