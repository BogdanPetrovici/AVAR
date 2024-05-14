import styles from '@/app/ui/css/page.module.css';
import { lusitana } from '@/app/ui/fonts';

import Transactions from '@/app/ui/transactions/transactions';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Link from 'next/link';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    from?: string;
    to?: string;
    page?: string;
  };
}) {
  const today = dayjs();
  dayjs.extend(customParseFormat);
  let fromDate = today.subtract(100, 'day');
  if (searchParams?.from) {
    fromDate = dayjs(searchParams?.from, 'YYYY-MM-DD');
  }

  let toDate = today;
  if (searchParams?.to) {
    toDate = dayjs(searchParams?.to, 'YYYY-MM-DD');
  }

  return (
    <main className={styles.pageContainer}>
      <header className={styles.pageHeading}>
        <h1 className={`${lusitana.className} ${styles.headingText}`}>
          Transactions
        </h1>
        <Link href="/transactions/create">
          <Button
            data-test="create-transaction-button"
            variant="contained"
            type="button"
          >
            Create transaction
          </Button>
        </Link>
      </header>
      <Transactions from={fromDate} to={toDate} page={searchParams?.page} />
    </main>
  );
}
