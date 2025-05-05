import '@/shared/styles/global.scss';
import type { Metadata } from 'next';
import { Providers } from './_layouts/providers';
import { ClientLayout } from './_layouts/ClientLayout';

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
