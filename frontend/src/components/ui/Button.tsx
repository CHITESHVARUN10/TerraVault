import type { ButtonHTMLAttributes } from 'react'

/**
 * Editorial buttons — gold solid, ghost outline, or danger red,
 * matching the stitch_screens HTML (btn-lift hover -2px).
 */
export function Button({
  variant = 'solid',
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'ghost' | 'danger'
}) {
  const base =
    'inline-flex items-center justify-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.1em] px-5 py-3 rounded-[2px] no-underline transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed btn-lift'
  const styles = {
    solid: 'text-ink bg-gold hover:bg-amber-bright border border-gold',
    ghost:
      'text-amber bg-transparent border border-line hover:bg-ink-card hover:text-gold hover:border-line',
    danger: 'text-[#ffb4ab] border border-amber/40 hover:bg-amber/10',
    delete: 'text-[#ffb4ab] bg-delete hover:bg-delete-hover border border-delete',
  } as const
  const variantKey = variant === 'danger' ? 'danger' : variant
  return <button className={`${base} ${styles[variantKey]} ${className}`} {...rest} />
}
