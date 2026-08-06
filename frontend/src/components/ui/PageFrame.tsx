import type { ReactNode } from 'react'
import { ContourField } from '../Contours'

/**
 * Shared app page frame: subtle contour background + constrained container.
 */
export function PageFrame({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen bg-ink">
      <div className="absolute inset-0 opacity-40 pointer-events-none" aria-hidden="true">
        <ContourField variant="faint" />
      </div>
      <div className="relative mx-auto w-[min(var(--maxw),100%-(var(--gutter)*2))] pt-28 pb-24">
        {children}
      </div>
    </main>
  )
}

/** Small empty-state block used across pages. */
export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon?: ReactNode
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center border border-dashed border-line rounded-[2px] px-8 py-16">
      {icon && <div className="text-amber mb-4">{icon}</div>}
      <h3 className="font-serif text-xl text-gold mb-2">{title}</h3>
      <p className="max-w-[26rem] text-[0.9rem] text-gold-dim leading-[1.7] mb-6">{body}</p>
      {action}
    </div>
  )
}
