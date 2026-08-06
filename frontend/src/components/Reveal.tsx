import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react'

interface RevealProps {
  children: ReactNode
  delay?: number
  className?: string
}

/**
 * Scroll-triggered reveal. Elements start hidden and fade/rise in
 * when they enter the viewport. Respects prefers-reduced-motion.
 */
export default function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in')
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('is-in')
            io.disconnect()
          }
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const style = { '--reveal-delay': `${delay}ms` } as CSSProperties

  return (
    <div ref={ref} style={style} className={`reveal ${className}`.trim()}>
      {children}
    </div>
  )
}
