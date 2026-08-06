import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

/**
 * Shared page header: eyebrow + title + description + optional actions.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
}) {
  return (
    <header className="mb-12">
      {eyebrow && (
        <p className="text-[0.66rem] uppercase tracking-[0.28em] text-amber mb-3">{eyebrow}</p>
      )}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.05] text-gold">{title}</h1>
          {description && (
            <p className="mt-3 max-w-[34rem] text-gold-dim leading-[1.7]">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </header>
  )
}

export { Link }
