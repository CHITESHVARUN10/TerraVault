import type { ButtonHTMLAttributes } from 'react'

/**
 * Editorial buttons — gold solid, ghost outline, or plain text.
 */
export function Button({
  variant = 'solid',
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'ghost' | 'danger'
}) {
  const base =
    'inline-flex items-center justify-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.1em] px-5 py-2.5 rounded-[2px] no-underline transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'
  const styles = {
    solid: 'text-ink bg-gold hover:bg-amber-bright',
    ghost: 'text-gold border border-line hover:border-amber hover:text-amber-bright',
    danger: 'text-amber-bright border border-amber/40 hover:bg-amber/10',
  }
  return <button className={`${base} ${styles[variant]} ${className}`} {...rest} />
}
