import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import {AuthProvider} from '@/components/auth-provider';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'HealthAssist AI',
  description: 'Your personal AI-powered health assistant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={`${inter.className} h-full`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
