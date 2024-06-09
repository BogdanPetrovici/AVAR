import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login/login-form';
import styles from '@/app/ui/css/login.module.css';

export default function LoginPage() {
  return (
    <main className={styles.pageCanvas}>
      <div className={styles.pageContainer}>
        <div className={styles.pageHeading}>
          <AcmeLogo />
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
