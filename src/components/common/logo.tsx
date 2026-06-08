import Image from 'next/image';
import React from 'react';

export function AlifLogo({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: 'relative' }}>
      <Image
        src="https://i.postimg.cc/GpRyZdPy/qlif-blog.png"
        alt="ALIF BLOG Logo"
        fill
        style={{ objectFit: 'contain' }}
        sizes="200px"
        priority
      />
    </div>
  );
}
