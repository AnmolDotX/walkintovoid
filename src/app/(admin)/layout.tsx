import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/app/globals.css';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Admin Panel | WalkIntoVoid',
  description: 'Admin panel for the author of the blog app',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} dark flex antialiased`}>
        <AdminSidebar />
        <main className="flex-1 p-8">{children}</main>
        <Toaster theme="dark" richColors />
      </body>
    </html>
  );
}
