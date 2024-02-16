import '@/app/ui/css/global.css';
import { inter } from '@/app/ui/fonts';
import SideNav from '@/app/ui/sidenav';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AppRouterCacheProvider>
          <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
              <SideNav />
            </div>
            <div className="relative flex-grow p-6 md:overflow-y-auto md:p-12">
              {children}
            </div>
          </div>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
