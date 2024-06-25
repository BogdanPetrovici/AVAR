import '@/app/ui/css/global.css';
import styles from '@/app/ui/css/layout.module.scss';
import { inter } from '@/app/ui/fonts';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${styles.bodyText}`}>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
    </html>
  );
}
