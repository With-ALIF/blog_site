import React from 'react';

export function AlifLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 400"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#F5C542" />
          <stop offset="100%" stopColor="#C9A227" />
        </linearGradient>

        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <text
        x="50%"
        y="200"
        textAnchor="middle"
        fontFamily="Cinzel, serif"
        fontSize="120"
        fontWeight="bold"
        fill="url(#goldGradient)"
        filter="url(#glow)"
      >
        ALIF
      </text>

      <text
        x="50%"
        y="270"
        textAnchor="middle"
        fontFamily="Montserrat, sans-serif"
        fontSize="40"
        letterSpacing="8"
        fill="url(#goldGradient)"
      >
        BLOG
      </text>
    </svg>
  );
}
