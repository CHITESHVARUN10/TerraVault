import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ContourField } from './Contours'

gsap.registerPlugin(ScrollTrigger)

const ROUTE =
  'M 100 640 C 220 560, 300 620, 420 520 C 540 420, 660 480, 780 400 C 900 320, 1020 380, 1100 300'

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
    <section ref={root} id="maps" className="relative min-h-screen flex items-center overflow-hidden bg-ink text-gold">
      <div className="absolute inset-0 z-0 opacity-55" aria-hidden="true">
        <ContourField variant="gold" />
      </div>

      <div className="absolute inset-0 z-[1]" aria-hidden="true">
        <svg viewBox="0 0 1200 800" fill="none" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
          <path d={ROUTE} stroke="#2e2a20" strokeWidth="1.5" strokeDasharray="6 8" data-map-route />
          <g data-map-pin style={{ offsetPath: `path('${ROUTE}')`, offsetRotate: '0deg' }}>
            <circle cx="0" cy="0" r="10" fill="#d4a845" opacity="0.25" />
            <circle cx="0" cy="0" r="4.5" fill="#eec76f" />
          </g>
        </svg>
        <div className="absolute inset-0 maps__grid" />
      </div>

      <div className="relative z-[2] mx-auto flex flex-col justify-between gap-16 min-h-[70vh] py-[clamp(4rem,10vh,7rem)] w-[min(var(--maxw),100%-(var(--gutter)*2))]">
        <div>
          <p className="eyebrow" data-reveal>
            03 — Maps
          </p>
          <h2 className="serif text-[clamp(2.6rem,6vw,5rem)] leading-[1.02] mt-3 text-gold" data-text-reveal>
            Your property,
            <br />
            <em className="italic text-amber-bright">from above.</em>
          </h2>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-8">
          <p className="max-w-[28rem] text-gold-dim leading-[1.7]" data-reveal>
            Coordinates anchor every property. On the map, on the ground, and in
            the years of visits — one place, always findable.
          </p>
          <div className="flex gap-6 font-sans" data-reveal>
            <div className="flex flex-col gap-0.5 text-[0.9rem] tracking-[0.08em] text-gold">
              <span className="text-[0.62rem] uppercase tracking-[0.24em] text-amber">Lat</span>
              <span data-map-lat>28.6129° N</span>
            </div>
            <div className="flex flex-col gap-0.5 text-[0.9rem] tracking-[0.08em] text-gold">
              <span className="text-[0.62rem] uppercase tracking-[0.24em] text-amber">Lng</span>
              <span data-map-lng>77.2295° E</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
