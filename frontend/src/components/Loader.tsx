import { useEffect, useRef, useState } from 'react'

/**
 * Premium loading curtain — matches 01_landing.html: TERRAVAULT
 * wordmark, amber progress bar, counter that resolves to 072, then
 * fades out. Uses a fixed timer chain (not rAF) so it always
 * completes, with a hard fallback that forces unmount.
 */
export default function Loader() {
  const [gone, setGone] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setGone(true)
      return
    }

    const bar = root.current?.querySelector<HTMLElement>('[data-loader-bar]')
    const num = root.current?.querySelector<HTMLElement>('[data-loader-num]')
    const veil = root.current

    // Hard fallback — never let the loader trap the page.
    const hardStop = window.setTimeout(() => setGone(true), 5000)

    // Bar animation
    let raf = 0
    if (bar) {
      const start = performance.now()
      const DURATION = 1400
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION)
        bar.style.transform = `scaleX(${t})`
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    // Counter 0 → 072
    let count = 0
    const target = 72
    const interval = window.setInterval(() => {
      count++
      if (num) num.textContent = String(count).padStart(3, '0')
      if (count >= target) {
        window.clearInterval(interval)
        // Fade out
        window.setTimeout(() => {
          if (veil) veil.classList.add('loader-exit')
          window.setTimeout(() => setGone(true), 1000)
        }, 400)
      }
    }, 1800 / target)

    return () => {
      window.clearTimeout(hardStop)
      window.clearInterval(interval)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (gone) return null

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#0c0b09]"
      data-loader-veil
      aria-hidden="true"
    >
      <span className="font-serif text-[48px] leading-none tracking-wide text-on-surface mb-8">TERRAVAULT</span>
      <div className="w-64 h-px bg-line-soft relative overflow-hidden">
        <span data-loader-bar className="absolute top-0 left-0 h-full w-full bg-amber origin-left scale-x-0" />
      </div>
      <div className="mt-4 text-[0.7rem] uppercase tracking-[0.25em] text-amber font-semibold">
        <span data-loader-num>000</span>
      </div>
    </div>
  )
}
