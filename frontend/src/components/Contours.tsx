import { useId } from 'react'

/**
 * A hand-drawn-style topographic contour field as pure SVG.
 * Used as a subtle animated background across sections.
 * `variant` picks the stroke color density.
 */
export function ContourField({
  variant = 'dark',
  className = '',
}: {
  variant?: 'dark' | 'gold' | 'faint'
  className?: string
}) {
  const id = useId()
  const stroke = variant === 'gold' ? '#b39b5c' : variant === 'faint' ? '#3d3525' : '#2e2a20'

  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      fill="none"
      stroke={stroke}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={stroke} stopOpacity="0" />
          <stop offset="0.5" stopColor={stroke} stopOpacity="1" />
          <stop offset="1" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <g opacity="0.5" stroke={`url(#${id}-fade)`}>
        {/* Contour rings — gentle hills */}
        <path d="M-100 550 C 150 480, 300 520, 420 430 C 540 340, 620 380, 760 300 C 900 220, 1050 260, 1300 180" />
        <path d="M-100 590 C 150 520, 300 560, 420 470 C 540 380, 620 420, 760 340 C 900 260, 1050 300, 1300 220" />
        <path d="M-100 630 C 150 560, 300 600, 420 510 C 540 420, 620 460, 760 380 C 900 300, 1050 340, 1300 260" />
        <path d="M-100 670 C 150 600, 300 640, 420 550 C 540 460, 620 500, 760 420 C 900 340, 1050 380, 1300 300" />
        {/* A distinct hill cluster top-right */}
        <path d="M 850 140 C 900 90, 980 90, 1030 130 C 1080 170, 1060 230, 1000 250 C 940 270, 880 240, 860 200 C 840 160, 840 150, 850 140 Z" />
        <path d="M 860 175 C 890 140, 940 140, 975 170 C 1010 200, 1000 230, 970 240 C 930 255, 890 235, 875 205 C 862 180, 860 178, 860 175 Z" />
        {/* Surveyor's hatch marks */}
        <path d="M 420 430 l 8 6 M 760 300 l 8 6 M 760 340 l -8 6 M 1000 250 l 8 6" />
      </g>
    </svg>
  )
}

/** A small GPS pin with a pulsing ring, used on maps and coordinates. */
export function GpsPin({ className = '', size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1" opacity="0.7" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  )
}
