import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LanguageProvider } from '@/contexts/language-context';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'ALIF BLOG',
  description: 'A modern, responsive bilingual blog exploring tech, education, and lifestyle.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const pathname = headersList.get('next-url') || '';
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Montserrat&family=Poppins:wght@400;500;600;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased")}>
        <LanguageProvider>
          <div className="flex min-h-screen flex-col bg-background">
            {!isAdminPage && <Header />}
            <main className="flex-grow">{children}</main>
            {!isAdminPage && <Footer />}
          </div>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
