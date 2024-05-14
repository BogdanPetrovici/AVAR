import { lusitana } from '@/app/ui/fonts';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@mui/material';
import styles from '@/app/ui/css/login.module.css';
import { signIn } from '@/auth';

export default function LoginForm() {
  return (
    <>
      <form
        action={async () => {
          'use server';
          await signIn('cognito');
        }}
        className={styles.loginForm}
      >
        <div className={styles.loginContainer}>
          <h1 className={`${lusitana.className} ${styles.loginHeading}`}>
            Please log in to continue.
          </h1>
          <Button
            variant="contained"
            type="submit"
            sx={{
              marginTop: '1rem',
              width: '100%',
              backgroundColor: 'rgb(37 137 254 / 1)',
              borderRadius: '0.5rem',
            }}
          >
            Sign in with Cognito{' '}
            <ArrowRightIcon className={styles.loginButtonIcon} />
          </Button>
        </div>
      </form>
    </>
  );
}