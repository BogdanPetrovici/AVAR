import SideNav from '@/app/ui/sidenav';
import { Toaster } from 'react-hot-toast';
import styles from '@/app/ui/css/layout.module.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.appContainer}>
      <div className={styles.navContainer}>
        <SideNav />
      </div>
      <div className={styles.tabContainer}>{children}</div>
      <Toaster position="bottom-center" />
    </div>
  );
}
