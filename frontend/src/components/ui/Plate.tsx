import type { ReactNode } from 'react'
import CornerTicks from './CornerTicks'

/**
 * Archive plate — the bordered panel with amber corner ticks used for
 * auth cards, dialogs, and info plates across the stitch screens.
 */
export default function Plate({
  children,
  className = '',
  ticks = 'all',
  hover = true,
  panel = false,
}: {
  children: ReactNode
  className?: string
  ticks?: 'all' | 'tr-bl' | 'none'
  hover?: boolean
  panel?: boolean
}) {
  return (
    <div
      className={`${panel ? 'plate-panel' : 'plate'} ${hover ? 'plate-hover' : ''} ${className}`}
    >
      {ticks !== 'none' && <CornerTicks variant={ticks} />}
      {children}
    </div>
  )
}
