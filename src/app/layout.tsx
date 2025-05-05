import '@/shared/styles/global.scss';
import { AuthGuard } from '@/features/auth';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { ClientLayout } from './ClientLayout';
export const metadata: Metadata = {
  title: 'SHOP | findyourkicks',
  description: 'find your kicks',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
