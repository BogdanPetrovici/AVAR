import styles from '@/app/ui/css/notFound.module.css';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { Button } from '@mui/material';

export default function NotFound() {
  return (
    <main className={styles.errPage}>
      <FaceFrownIcon className={styles.errIcon} />
      <h2 className={styles.errHeading}>404 Not Found</h2>
      <p>Could not find the requested transaction.</p>
      <Button
        data-test="redirect-button"
        variant="contained"
        type="link"
        href="/transactions"
        sx={{ marginTop: '1rem' }}
      >
        Go Back
      </Button>
    </main>
  );
}
