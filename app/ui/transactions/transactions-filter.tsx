'use client';

import styles from '@/app/ui/css/transactions.module.css';

import dayjs from 'dayjs';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Button } from '@mui/material';

export default function TransactionsFilter({
  initialFromDate,
  initialToDate,
}: {
  initialFromDate: Date;
  initialToDate: Date;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  let fromDate = dayjs(initialFromDate);
  let toDate = dayjs(initialToDate);

  function handleFiltered() {
    const params = new URLSearchParams(searchParams);
    params.set('from', fromDate.format('YYYY-MM-DD'));
    params.set('to', toDate.format('YYYY-MM-DD'));
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={styles.filterContainer}>
        <span>From:</span>
        <div className={styles.fieldContainer}>
          <DatePicker
            key="fromDate"
            format="YYYY-MM-DD"
            value={fromDate}
            onChange={(newDate: Date | null) => (fromDate = dayjs(newDate))}
            slotProps={{
              textField: {
                inputProps: { 'data-testid': 'fromDate' },
              },
            }}
          />
        </div>
        <span>To:</span>
        <div className={styles.fieldContainer}>
          <DatePicker
            key="toDate"
            format="YYYY-MM-DD"
            value={toDate}
            onChange={(newDate: Date | null) => (toDate = dayjs(newDate))}
            slotProps={{
              textField: {
                inputProps: { 'data-testid': 'toDate' },
              },
            }}
          />
        </div>
        <Button
          data-testid="filterButton"
          variant="outlined"
          onClick={handleFiltered}
        >
          Filter
        </Button>
      </div>
    </LocalizationProvider>
  );
}
