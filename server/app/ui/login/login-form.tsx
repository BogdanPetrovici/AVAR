import { inter, lusitana } from '@/app/ui/fonts';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@mui/material';
import styles from '@/app/ui/css/login.module.scss';
import { providerMap, signIn } from '@/auth';

export default function LoginForm() {
  return (
    <>
      <div className={styles.loginContainer}>
        <h1 className={`${lusitana.className} ${styles.loginHeading}`}>
          Please log in to continue.
        </h1>
        {Object.values(providerMap).map((provider) => {
          return (
            <form
              key={provider.id}
              action={async () => {
                'use server';
                await signIn(provider.id);
              }}
              className={styles.loginForm}
            >
              <Button
                variant="contained"
                type="submit"
                data-test="login-button"
                sx={{
                  marginTop: '1rem',
                  width: '100%',
                  height: '2.5rem',
                  backgroundColor: 'rgb(0 112 243 / 1)',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  lineHeight: '1.25rem',
                  fontFamily: inter.style.fontFamily,
                  textTransform: 'none',
                }}
              >
                Sign in with {provider.name}{' '}
                <ArrowRightIcon className={styles.loginButtonIcon} />
              </Button>
            </form>
          );
        })}
      </div>
    </>
  );
}
