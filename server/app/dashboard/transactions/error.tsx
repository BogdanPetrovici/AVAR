'use client';

import styles from '@/app/ui/css/error.module.scss';
import { Button } from '@mui/material';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className={styles.errPage}>
      <h2 className={styles.errHeading}>Something went wrong!</h2>
      <Button
        data-test="retry-button"
        variant="contained"
        type="button"
        onClick={() => reset()}
        sx={{ marginTop: '1rem' }}
      >
        Try again
      </Button>
    </main>
  );
}
