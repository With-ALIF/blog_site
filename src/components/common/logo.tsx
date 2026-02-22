import Image from 'next/image';
import React from 'react';

export function AlifLogo({ className }: { className?: string }) {
  // The parent element must have position: relative for fill to work.
  // The passed className will control the dimensions of the logo.
  return (
    <div className={className} style={{ position: 'relative' }}>
      <Image
        src="https://raw.githubusercontent.com/alif982/blog/main/bc.png"
        alt="ALIF BLOG Logo"
        fill
        style={{ objectFit: 'contain' }}
        sizes="200px" // A reasonable default size hint for the browser
      />
    </div>
  );
}
