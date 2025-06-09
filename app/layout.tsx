import '@/styles/fonts.css';
import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563EB',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://supdomain.com'),
  title: "Sup' Domain - Smart Domain Name Checker & Suggestions",
  description:
    'Check domain availability instantly and get AI-powered domain suggestions. Find the perfect domain name with advanced scoring and alternatives.',
  keywords: [
    'domain checker',
    'domain search',
    'domain name suggestions',
    'AI domain names',
    'domain availability',
    'domain scoring',
    'domain alternatives',
    'domain name generator',
    'domain lookup',
    'domain name search',
    'domain name availability checker',
    'domain name finder',
    'domain name ideas',
    'domain registration',
    'domain name tool',
    'domain name brainstorming',
    'domain name validation',
    'domain name search tool',
    'business domain names',
    'brand domain names',
    'website domain checker',
    'domain name availability search',
    'domain name suggestion tool',
    'domain name availability lookup',
    'find domain names',
    'find domain name',
    'find domain',
  ],
  robots: 'index, follow',
  authors: [{ name: "Sup' Domain" }],
  openGraph: {
    title: "Sup' Domain - Smart Domain Name Checker",
    description:
      'Find your perfect domain name with AI-powered suggestions and instant availability checks',
    type: 'website',
    locale: 'en_US',
    siteName: "Sup' Domain",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link id="dynamic-favicon" rel="icon" href="/favicon-default.svg" type="image/svg+xml" />
        <Script id="structured-data" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Sup' Domain",
              "description": "Check domain availability instantly and get AI-powered domain suggestions",
              "applicationCategory": "Domain Search Tool",
              "operatingSystem": "Any",
              "featureList": [
                "Instant domain availability checking",
                "AI-powered domain name suggestions",
                "Domain name scoring (length, hyphens, numbers)",
                "Alternative domain extensions (.com, .net, .org, .io, etc.)",
                "Domain usage detection (parked/active)",
                "Domain name filters and sorting"
              ]
            }
          `}
        </Script>
      </head>
      <body className={`${inter.className} flex h-full flex-col bg-white`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex flex-1 flex-col justify-center">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
