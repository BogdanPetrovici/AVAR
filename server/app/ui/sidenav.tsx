import styles from '@/app/ui/css/nav.module.scss';

import Link from 'next/link';
import NavLinks from '@/app/ui/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';

export default function SideNav() {
  return (
    <div className={styles.nav}>
      <Link className={styles.logoLink} href="/">
        <AcmeLogo />
      </Link>
      <div className={styles.menuItemContainer}>
        <NavLinks />
        <div className={styles.menuFiller}></div>
        <form
          action={async () => {
            'use server';
            await signOut({ redirect: true, redirectTo: '/login' });
          }}
        >
          <button
            className={`${styles.menuItem} ${styles.menuItemLogOff}`}
            data-test="logout-button"
          >
            <PowerIcon className={styles.menuItemIcon} />
            <div className={styles.menuItemText}>Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
