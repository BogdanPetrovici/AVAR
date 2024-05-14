import styles from '@/app/ui/css/nav.module.css';

import Link from 'next/link';
import NavLinks from '@/app/ui/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signIn, signOut } from '@/auth';

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
            await signOut();
          }}
        >
          <button className={`${styles.menuItem} ${styles.menuItemLogOff}`}>
            <PowerIcon className={styles.menuItemIcon} />
            <div className={styles.menuItemText}>Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
