import '@/styles/fonts.css';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Sup' Domain",
  description: 'Check domain availability and get AI-powered suggestions with a modern twist',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link id="dynamic-favicon" rel="icon" href="/favicon-default.svg" type="image/svg+xml" />
      </head>
      <body className={`${inter.className} flex min-h-full flex-col`}>
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
