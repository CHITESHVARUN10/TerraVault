import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/**
 * Premium loading curtain: a warm archival veil with a counting
 * coordinate readout that resolves into the page.
 */
export default function Loader() {
  const [gone, setGone] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setGone(true)
      return
    }

    const counter = { v: 0 }
    const numEl = root.current?.querySelector('[data-loader-num]')

    const tl = gsap.timeline({
      onComplete: () => setGone(true),
    })
    tl.to(counter, {
      v: 100,
      duration: 1.4,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (numEl) numEl.textContent = String(Math.round(counter.v)).padStart(3, '0')
      },
    })
      .to('[data-loader-bar]', { scaleX: 1, duration: 1.2, ease: 'power3.inOut' }, 0.1)
      .to('[data-loader-veil]', {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.9,
        ease: 'power4.inOut',
      })

    return () => {
      tl.kill()
    }
  }, [])

  if (gone) return null

  return (
    <div ref={root} className="fixed inset-0 z-[1000] flex items-center justify-center bg-ink" data-loader-veil aria-hidden="true">
      <div className="flex flex-col items-center gap-5">
        <span className="font-serif text-[1.4rem] tracking-[0.04em] text-gold">TerraVault</span>
        <div className="w-[180px] h-px bg-line overflow-hidden">
          <span data-loader-bar className="block h-full w-full bg-amber origin-left scale-x-0" />
        </div>
        <span className="text-[0.7rem] tracking-[0.3em] text-gold-faint" data-loader-num>
          000
        </span>
      </div>
    </div>
  )
}
