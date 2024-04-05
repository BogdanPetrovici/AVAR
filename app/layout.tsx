import '@/app/ui/css/global.css';
import styles from '@/app/ui/css/layout.module.css';
import { inter } from '@/app/ui/fonts';
import SideNav from '@/app/ui/sidenav';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${styles.bodyText}`}>
        <AppRouterCacheProvider>
          <div className={styles.appContainer}>
            <div className={styles.navContainer}>
              <SideNav />
            </div>
            <div className={styles.tabContainer}>{children}</div>
          </div>
        </AppRouterCacheProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
