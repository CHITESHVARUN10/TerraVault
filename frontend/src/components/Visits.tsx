import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { IconTravelExplore } from './icons'

gsap.registerPlugin(ScrollTrigger)

const VISITS = [
  {
    year: '2026',
    ref: 'REF: 2026-A',
    note: 'Spring visit. The well was dry; the neem has grown.',
  },
  {
    year: '2027',
    ref: 'REF: 2027-B',
    note: 'Monsoon inspection. Boundary stones verified. Soil sample taken.',
  },
  {
    year: '2028',
    ref: 'REF: 2028-C',
    note: 'Winter solstice. The air is clear. Legacy transfer documents signed.',
  },
]

/**
 * Visits — matches 01_landing.html Section 02: an alternating
 * vertical timeline with amber center line + dots, archive plates
 * with explore icon + REF label, and ghost serif years.
 */
export default function Visits() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-visit-plate]',
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.2,
          scrollTrigger: { trigger: '[data-timeline]', start: 'top 75%', once: true },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="visits" className="bg-ink py-[var(--section-pad)] border-t border-line-soft relative overflow-hidden">
      <div className="mx-auto w-[min(var(--maxw),100%-(var(--gutter)*2))]">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <p className="eyebrow mb-4" data-reveal>
            Section — 02 Visits
          </p>
          <h2 className="serif font-[380] text-[clamp(2rem,3.3vw,3rem)] leading-[1.15] max-w-3xl text-on-surface" data-text-reveal>
            Every visit, <em className="italic text-[#d4a845]">kept</em>. For the <em className="italic text-[#d4a845]">years ahead</em>.
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative" data-timeline>
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-amber opacity-30 -translate-x-1/2 hidden md:block" aria-hidden="true" />

          <div className="flex flex-col gap-16">
            {VISITS.map((v, i) => {
              const reverse = i % 2 === 1
              return (
                <div key={v.year} className="relative flex flex-col md:flex-row items-center gap-8" data-visit-entry>
                  {/* Plate */}
                  <div className={`md:w-1/2 flex ${reverse ? 'md:justify-start md:pl-8' : 'md:justify-end md:pr-8'}`}>
                    <div className="relative bg-paper p-6 border border-line-soft w-full max-w-md" data-visit-plate>
                      <span className="hero__plate-corner hero__plate-corner--tl" />
                      <span className="hero__plate-corner hero__plate-corner--tr" />
                      <span className="hero__plate-corner hero__plate-corner--bl" />
                      <span className="hero__plate-corner hero__plate-corner--br" />
                      <div className="flex justify-between items-start mb-4">
                        <IconTravelExplore size={18} className="text-[#d4a845]" />
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4a845] opacity-50">{v.ref}</span>
                      </div>
                      <p className="text-[1rem] text-gold-dim italic">“{v.note}”</p>
                    </div>
                  </div>

                  {/* Dot */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-amber rounded-full z-10 hidden md:block" aria-hidden="true" />

                  {/* Year */}
                  <div className={`md:w-1/2 ${reverse ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}>
                    <span className="font-serif text-[clamp(3rem,6vw,4rem)] text-amber opacity-20">{v.year}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
