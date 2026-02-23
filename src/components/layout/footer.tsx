import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Github, Linkedin } from 'lucide-react';
import { AlifLogo } from '../common/logo';

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <AlifLogo className="h-14 w-28 mb-2" />
            <p className="text-muted-foreground mb-4 max-w-sm">A modern, responsive bilingual blog exploring tech, education, and lifestyle. Your daily dose of insights in Bangla and English.</p>
            <div className="flex space-x-4">
              <Link href="https://github.com/With-ALIF" aria-label="GitHub"><Github className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" /></Link>
              <Link href="#" aria-label="LinkedIn"><Linkedin className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" /></Link>
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
          <div>
            <h4 className="font-semibold mb-4 font-headline">Subscribe</h4>
            <p className="text-muted-foreground mb-4 text-sm">Get the latest posts delivered right to your inbox.</p>
            <form className="flex space-x-2">
              <Input type="email" placeholder="Your Email" className="flex-1" aria-label="Email for newsletter"/>
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ALIF BLOG. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
