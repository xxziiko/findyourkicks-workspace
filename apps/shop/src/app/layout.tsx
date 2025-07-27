import '@findyourkicks/shared/styles/global.scss';

import type { Metadata } from 'next';
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
      <head>
        {/* 배너 이미지 사전 로딩 */}
        <link rel="preload" as="image" href="/images/banner1.webp" />
        <link rel="preload" as="image" href="/images/banner2.webp" />
        <link rel="preload" as="image" href="/images/banner3.webp" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
