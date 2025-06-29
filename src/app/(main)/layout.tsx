import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/app/globals.css';
import AppLayout from '@/components/layout/AppLayout';
import NextAuthSessionProvider from '@/providers/NextProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Walk Into Void',
  description: 'We all are walking towards that, see you soon!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}>
        <NextAuthSessionProvider>
          <AppLayout>{children}</AppLayout>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
