import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LanguageProvider } from '@/contexts/language-context';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { headers } from 'next/headers';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'ALIF BLOG',
  description: 'A modern, responsive bilingual blog exploring tech, education, and lifestyle.',
  icons: {
    icon: 'https://i.postimg.cc/GpRyZdPy/qlif-blog.png?v=3',
    shortcut: 'https://i.postimg.cc/GpRyZdPy/qlif-blog.png?v=3',
    apple: 'https://i.postimg.cc/GpRyZdPy/qlif-blog.png?v=3',
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get('next-url') || '';
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Montserrat&family=Poppins:wght@400;500;600;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        
        {/* Favicon configuration with direct links for browser compatibility */}
        <link rel="icon" href="https://i.postimg.cc/GpRyZdPy/qlif-blog.png?v=3" type="image/png" />
        <link rel="shortcut icon" href="https://i.postimg.cc/GpRyZdPy/qlif-blog.png?v=3" type="image/png" />
        <link rel="apple-touch-icon" href="https://i.postimg.cc/GpRyZdPy/qlif-blog.png?v=3" type="image/png" />
      </head>
      <body className={cn("font-body antialiased")}>
        <FirebaseClientProvider>
          <LanguageProvider>
            <div className="flex min-h-screen flex-col bg-background">
              {!isAdminPage && <Header />}
              <main className="flex-grow">{children}</main>
              {!isAdminPage && <Footer />}
            </div>
            <Toaster />
          </LanguageProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
