import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { LanguageToggle } from '../common/language-toggle';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { AlifLogo } from '../common/logo';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex-1">
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <AlifLogo className="h-10 w-20" />
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} className="transition-colors hover:text-primary text-foreground/80">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetTitle className="sr-only">Main Menu</SheetTitle>
                <Link href="/" className="mr-6 flex items-center space-x-2 mb-6">
                  <AlifLogo className="h-10 w-20" />
                </Link>
                <nav className="flex flex-col space-y-4">
                  {navLinks.map(link => (
                    <Link key={link.href} href={link.href} className="text-lg hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
