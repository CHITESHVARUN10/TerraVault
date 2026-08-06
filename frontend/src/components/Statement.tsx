import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ContourField } from './Contours'

gsap.registerPlugin(ScrollTrigger)

/**
 * Statement — matches 01_landing.html "OUR PURPOSE" section:
 * centered eyebrow + serif headline + body + 3-col footer row,
 * over an animated contour field.
 */
export default function Statement() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('[data-statement-contours] svg', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      id="statement"
      className="relative overflow-hidden bg-ink py-[var(--section-pad)] contour-bg"
    >
      <div className="absolute inset-0 z-0 opacity-50" aria-hidden="true" data-statement-contours>
        <ContourField variant="faint" />
      </div>

      <div className="relative z-[1] mx-auto flex flex-col items-center text-center gap-8 w-[min(var(--maxw),100%-(var(--gutter)*2))]">
        <p className="eyebrow" data-reveal>
          Our purpose
        </p>
        <h2 className="serif font-[380] text-[clamp(2rem,3.3vw,3rem)] leading-[1.15] max-w-4xl text-on-surface" data-text-reveal>
          Land <em className="italic text-[#d4a845]">outlives</em> memory. The records <em className="italic text-[#d4a845]">shouldn't</em>.
        </h2>
        <p className="text-[1.1rem] leading-[1.7] text-gold-dim max-w-2xl" data-reveal data-reveal-delay="120">
          We provide a permanent physical sanctuary for the documents that define your legacy,
          ensuring that ground truth remains accessible for centuries.
        </p>
        <div
          className="flex gap-16 mt-4 text-[0.7rem] uppercase tracking-widest text-amber opacity-60"
          data-reveal
        >
          <span>Documents</span>
          <span>Ground truth</span>
          <span>History</span>
        </div>
      </div>
    </section>
  )
}
