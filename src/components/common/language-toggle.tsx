'use client';

import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="language-switch" className={cn("font-semibold text-sm transition-colors", language === 'en' ? 'text-primary' : 'text-muted-foreground')}>EN</Label>
      <Switch
        id="language-switch"
        checked={language === 'bn'}
        onCheckedChange={toggleLanguage}
        aria-label="Toggle language between English and Bangla"
      />
      <Label htmlFor="language-switch" className={cn("font-semibold text-sm transition-colors", language === 'bn' ? 'text-primary' : 'text-muted-foreground')}>BN</Label>
    </div>
  );
}
