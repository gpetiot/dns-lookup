import '@/styles/fonts.css';
import '@/styles/globals.css';

export const metadata = {
  title: 'Domain Checker',
  description: 'Check domain availability and get AI-powered suggestions',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
