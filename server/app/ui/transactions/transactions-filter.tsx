'use client';

import styles from '@/app/ui/css/transactions.module.scss';

import dayjs, { Dayjs } from 'dayjs';

import { useState } from 'react';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Button, FormHelperText } from '@mui/material';

import { toast } from 'react-hot-toast';

export default function TransactionsFilter({
  initialFromDate,
  initialToDate,
}: {
  initialFromDate: Date;
  initialToDate: Date;
}) {
  let fromDate = dayjs(initialFromDate);
  let toDate = dayjs(initialToDate);

  const [filterError, setFilterError] = useState(fromDate > toDate);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleFiltered() {
    if (fromDate > toDate) {
      toast.error('End date should be more recent than start date');
      setFilterError(true);
    } else {
      setFilterError(false);
      const params = new URLSearchParams(searchParams);
      params.delete('page');
      params.set('from', fromDate.format('YYYY-MM-DD'));
      params.set('to', toDate.format('YYYY-MM-DD'));
      replace(`${pathname}?${params.toString()}`);
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={styles.filterContainer}>
        <div className={styles.filterInputContainer}>
          <span className={styles.filterInputLabel}>From:</span>
          <div className={styles.fieldContainer}>
            <DatePicker
              key="fromDate"
              format="YYYY-MM-DD"
              value={fromDate}
              onChange={(newDate: Dayjs | null) => (fromDate = dayjs(newDate))}
              slotProps={{
                textField: {
                  inputProps: {
                    'data-test': 'fromDate',
                    sx: {
                      borderColor: 'rgb(229 231 235 /1)',
                      fontSize: '0.875rem',
                      lineHeight: '1.25rem',
                      padding: '9px 0px 9px 14px',
                      outlineWidth: '2px',
                    },
                  },
                  error: filterError,
                },
              }}
            />
          </div>
          <span className={styles.filterInputLabel}>To:</span>
          <div className={styles.fieldContainer}>
            <DatePicker
              key="toDate"
              format="YYYY-MM-DD"
              value={toDate}
              onChange={(newDate: Dayjs | null) => (toDate = dayjs(newDate))}
              slotProps={{
                textField: {
                  inputProps: {
                    'data-test': 'toDate',
                    sx: {
                      borderColor: 'rgb(229 231 235 /1)',
                      fontSize: '0.875rem',
                      lineHeight: '1.25rem',
                      padding: '9px 0px 9px 14px',
                      outlineWidth: '2px',
                    },
                  },
                  error: filterError,
                },
              }}
            />
          </div>
        </div>
        <Button
          data-test="filterButton"
          variant="outlined"
          onClick={handleFiltered}
        >
          Filter
        </Button>
      </div>
      {filterError && (
        <FormHelperText error data-test="filter-error">
          End date should be more recent than start date
        </FormHelperText>
      )}
    </LocalizationProvider>
  );
}
