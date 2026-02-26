'use client';
import Link from 'next/link';
import { Github, Globe } from 'lucide-react';
import { AlifLogo } from '../common/logo';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) {
    return null;
  }
  
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AlifLogo className="h-14 w-28 mb-2" />
            <p className="text-muted-foreground mb-4 max-w-sm">A modern, responsive bilingual blog exploring tech, education, and lifestyle. Your daily dose of insights in Bangla and English.</p>
            <div className="flex space-x-4">
              <Link href="https://github.com/With-ALIF" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="https://alif.mnr.bd/" target="_blank" rel="noopener noreferrer" aria-label="Website">
                <Globe className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 font-headline">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ALIF BLOG. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
