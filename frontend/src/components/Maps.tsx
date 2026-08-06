import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ContourField } from './Contours'
import { IconLocation } from './icons'

gsap.registerPlugin(ScrollTrigger)

/**
 * Maps — matches 01_landing.html Section 03: full-screen centered
 * layout, contour + dot-grid + dashed route background, gold pin
 * circle, and a bottom coordinates readout. Scroll-scrubbed
 * route draw, pin travel, and lat/lng counters.
 */
export default function Maps() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-map-route]',
        { strokeDashoffset: 1200 },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top 60%', end: 'bottom 40%', scrub: true },
        },
      )
      gsap.fromTo(
        '[data-map-pin]',
        { offsetDistance: '0%' },
        {
          offsetDistance: '100%',
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top 60%', end: 'bottom 40%', scrub: true },
        },
      )
      const lat = { v: 28.6129 }
      const lng = { v: 77.2295 }
      gsap.to(lat, {
        v: 28.6131,
        duration: 1.5,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top 50%',
          end: 'bottom 30%',
          scrub: true,
          onUpdate: () => {
            const el = root.current?.querySelector('[data-map-lat]')
            if (el) el.textContent = lat.v.toFixed(4) + '° N'
          },
        },
      })
      gsap.to(lng, {
        v: 77.2296,
        duration: 1.5,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top 50%',
          end: 'bottom 30%',
          scrub: true,
          onUpdate: () => {
            const el = root.current?.querySelector('[data-map-lng]')
            if (el) el.textContent = lng.v.toFixed(4) + '° E'
          },
        },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      id="maps"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-ink text-gold border-t border-line-soft"
    >
      {/* Background layers */}
      <div className="absolute inset-0 z-0 opacity-55" aria-hidden="true">
        <ContourField variant="gold" />
      </div>
      <div
        className="absolute inset-0 z-[1] opacity-10"
        aria-hidden="true"
        style={{ backgroundImage: 'radial-gradient(#d4a845 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }}
      />
      {/* Winding route */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
        preserveAspectRatio="none"
        viewBox="0 0 1000 1000"
        aria-hidden="true"
      >
        <path
          d="M 100,800 Q 300,700 500,850 T 900,600"
          fill="none"
          opacity="0.4"
          stroke="#d4a845"
          strokeDasharray="8,8"
          strokeWidth="1.5"
          data-map-route
        />
      </svg>

      {/* Center content */}
      <div className="relative z-10 text-center px-[var(--gutter)]">
        <p className="eyebrow mb-4" data-reveal>
          Section — 03 Maps
        </p>
        <h2 className="serif font-[380] text-[clamp(2.25rem,4.4vw,4rem)] leading-[1.1] text-on-surface" data-text-reveal>
          Your property, from <em className="italic text-[#d4a845]">above</em>.
        </h2>
        <div className="mt-8 flex justify-center" data-reveal>
          <div className="bg-gold p-1 rounded-full">
            <IconLocation size={24} className="text-ink" filled />
          </div>
        </div>
      </div>

      {/* Footer coordinates */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[0.8rem] tracking-widest text-amber opacity-80">
        <span data-map-lat>28.6129° N</span> / <span data-map-lng>77.2295° E</span>
      </div>
    </section>
  )
}
