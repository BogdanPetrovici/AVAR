import { inter, lusitana } from '@/app/ui/fonts';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { KeyIcon } from '@heroicons/react/24/outline';
import { Button } from '@mui/material';
import styles from '@/app/ui/css/login.module.css';
import { providerMap, signIn } from '@/auth';

export default function LoginForm() {
  return (
    <>
      <div className={styles.loginContainer}>
        <h1 className={`${lusitana.className} ${styles.loginHeading}`}>
          Please log in to continue.
        </h1>
        {Object.values(providerMap).map((provider) => {
          if (provider.id === 'credentials') {
            return (
              <form
                key={provider.id}
                action={async (formData) => {
                  'use server';
                  await signIn(provider.id, formData);
                }}
                className={styles.loginForm}
              >
                <div>
                  <label className={styles.loginLabel} htmlFor="password">
                    Password
                  </label>
                  <div className={styles.loginFieldContainer}>
                    <input
                      className={styles.loginField}
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      required
                      minLength={6}
                    />
                    <KeyIcon className={styles.loginFieldIcon} />
                  </div>
                </div>
                <Button
                  variant="contained"
                  type="submit"
                  data-test="login-button-credentials"
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
          } else {
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
          }
        })}
      </div>
    </>
  );
}
