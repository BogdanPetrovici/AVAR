'use client';

import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@mui/material';
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/app/lib/actions';
import styles from '@/app/ui/css/login.module.css';

export default function LoginForm() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  return (
    <form action={dispatch} className={styles.loginForm}>
      <div className={styles.loginContainer}>
        <h1 className={`${lusitana.className} ${styles.loginHeading}`}>
          Please log in to continue.
        </h1>
        <div className={styles.loginContent}>
          <div>
            <label className={styles.loginLabel} htmlFor="email">
              Email
            </label>
            <div className={styles.loginFieldContainer}>
              <input
                className={styles.loginField}
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <AtSymbolIcon className={styles.loginFieldIcon} />
            </div>
          </div>
          <div className="mt-4">
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
        </div>
        <LoginButton />
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
