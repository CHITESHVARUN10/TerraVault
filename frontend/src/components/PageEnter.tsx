import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import gsap from 'gsap'

/**
 * Page-level entrance animation: children tagged `data-page-reveal`
 * fade/rise in a stagger when the page mounts. Respects
 * prefers-reduced-motion by rendering everything visible.
 */
export default function PageEnter({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const els = gsap.utils.toArray<HTMLElement>('[data-page-reveal]', root.current)
    if (!els.length) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        els,
        { autoAlpha: 0, y: 26 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.09,
          clearProps: 'transform',
        },
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return <div ref={root}>{children}</div>
}
