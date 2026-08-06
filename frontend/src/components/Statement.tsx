import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ContourField } from './Contours'

gsap.registerPlugin(ScrollTrigger)

/**
 * Statement — the editorial manifesto beat. A large serif pull-quote
 * over an animated contour field, with the copy revealing line by line.
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
    <section ref={root} id="statement" className="relative overflow-hidden bg-ink py-[var(--section-pad)] border-t border-line-soft">
      <div className="absolute inset-0 z-0 opacity-50" aria-hidden="true" data-statement-contours>
        <ContourField variant="faint" />
      </div>

      <div className="relative z-[1] mx-auto grid w-[min(var(--maxw),100%-(var(--gutter)*2))] grid-cols-1 md:grid-cols-[1fr_2fr] gap-[clamp(2rem,6vw,6rem)] items-start">
        <p className="eyebrow mt-1" data-reveal>
          Why TerraVault exists
        </p>

        <h2 className="serif text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] mb-7" data-text-reveal>
          Land outlives memory.
          <br />
          <span className="text-gold-dim font-[340]">The records shouldn't.</span>
        </h2>

        <p className="md:col-start-2 max-w-[34rem] text-[1.1rem] leading-[1.75] text-gold-dim" data-reveal data-reveal-delay="120">
          A boundary you walked once, a deed signed decades ago, a photograph of
          the house before the trees grew — the details of your property fade
          quietly. TerraVault keeps them close: every document, every coordinate,
          every visit, held in one private place that belongs to you.
        </p>
      </div>

      <div className="relative z-[1] mx-auto mt-16 grid w-[min(var(--maxw),100%-(var(--gutter)*2))] grid-cols-1 md:grid-cols-3 gap-8 border-t border-line-soft pt-9" data-reveal>
        <div className="flex flex-col gap-1.5">
          <span className="text-[0.68rem] uppercase tracking-[0.24em] text-gold-faint">Documents</span>
          <span className="font-serif text-xl text-gold">Deeds · surveys · receipts</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[0.68rem] uppercase tracking-[0.24em] text-gold-faint">Ground truth</span>
          <span className="font-serif text-xl text-gold">GPS · photographs · notes</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[0.68rem] uppercase tracking-[0.24em] text-gold-faint">History</span>
          <span className="font-serif text-xl text-gold">Every visit, dated forever</span>
        </div>
      </div>
    </section>
  )
}
