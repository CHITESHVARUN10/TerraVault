/**
 * Amber corner ticks — the signature archive-plate detail from the
 * stitch screens. `variant="all"` renders 4 corners, `"tr-bl"` renders
 * top-right + bottom-left (used on delete buttons and plates).
 */
export default function CornerTicks({
  variant = 'all',
  className = '',
}: {
  variant?: 'all' | 'tr-bl'
  className?: string
}) {
  if (variant === 'tr-bl') {
    return (
      <span aria-hidden="true" className={`pointer-events-none absolute inset-0 z-[1] corner-ticks corner-ticks-tr-bl ${className}`} />
    )
  }
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute inset-0 z-[1] corner-ticks ${className}`} />
  )
}
