import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GpsPin } from './Contours'

gsap.registerPlugin(ScrollTrigger)

const VISITS = [
  {
    year: '2026',
    coords: '28.6129° N · 77.2295° E',
    note: 'First survey — boundaries walked, corners pinned.',
    img: '/visit/2026.webp',
    alt: 'Aged paper texture, survey records',
  },
  {
    year: '2027',
    coords: '28.6130° N · 77.2294° E',
    note: 'Spring visit. The well was dry; the neem has grown.',
    img: '/visit/2027.webp',
    alt: 'Aged paper texture, field notes',
  },
  {
    year: '2028',
    coords: '28.6131° N · 77.2296° E',
    note: 'Monsoon. New fencing along the east boundary.',
    img: '/visit/2028.webp',
    alt: 'Aged paper texture, sketch map',
  },
]

export default function Visits() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-visit-plate]').forEach((plate) => {
        gsap.fromTo(
          plate,
          { clipPath: 'inset(100% 0 0 0)' },
          {
            clipPath: 'inset(0% 0 0 0)',
            duration: 1.2,
            ease: 'power4.out',
            scrollTrigger: { trigger: plate, start: 'top 80%', once: true },
          },
        )
        const img = plate.querySelector('img')
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -12, scale: 1.15 },
            {
              yPercent: 12,
              scale: 1.15,
              ease: 'none',
              scrollTrigger: { trigger: plate, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        }
      })

      gsap.fromTo(
        '[data-gps-path]',
        { strokeDashoffset: 360 },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: { trigger: '[data-timeline]', start: 'top 70%', end: 'bottom 60%', scrub: true },
        },
      )

      gsap.fromTo(
        '[data-visit-entry]',
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: { trigger: '[data-timeline]', start: 'top 75%', once: true },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="visits" className="bg-ink py-[var(--section-pad)] border-t border-line-soft">
      <div className="mx-auto w-[min(var(--maxw),100%-(var(--gutter)*2))]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-[clamp(2rem,6vw,6rem)] items-start mb-[clamp(3rem,8vh,6rem)]">
          <p className="eyebrow" data-reveal>
            02 — Visits
          </p>
          <h2 className="serif text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] mb-5" data-text-reveal>
            Every visit, kept.
            <br />
            <em className="italic text-amber-bright">For the years ahead.</em>
          </h2>
          <p className="md:col-start-2 max-w-[32rem] text-gold-dim leading-[1.7]" data-reveal data-reveal-delay="120">
            Photographs facing north, east, south, and west. A position. A date.
            Scrolled together, they show how your land breathes from season to
            season — and across decades.
          </p>
        </div>

        <div className="grid grid-cols-[3rem_1fr] gap-4 relative" data-timeline>
          <div className="relative h-full" aria-hidden="true">
            <svg viewBox="0 0 200 420" fill="none" preserveAspectRatio="none" className="w-full h-full min-h-[520px]">
              <path d="M100 10 C 40 90, 160 150, 100 220 C 40 290, 150 340, 100 410" stroke="#2e2b22" strokeWidth="1" />
              <path
                d="M100 10 C 40 90, 160 150, 100 220 C 40 290, 150 340, 100 410"
                stroke="#b98a3e"
                strokeWidth="1.5"
                strokeDasharray="360"
                strokeDashoffset="360"
                data-gps-path
              />
            </svg>
            <GpsPin className="absolute top-0 left-1/2 -translate-x-1/2 text-amber" size={18} />
          </div>

          <div className="grid gap-12">
            {VISITS.map((v) => (
              <article className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-center" data-visit-entry key={v.year}>
                <div className="m-0">
                  <div className="relative p-2.5 bg-paper overflow-hidden [clip-path:inset(100%_0_0_0)]" data-visit-plate>
                    <img
                      src={v.img}
                      alt={v.alt}
                      loading="lazy"
                      className="w-full aspect-[16/10] object-cover saturate-[0.85] contrast-[1.02]"
                    />
                    <span className="visits__compass" aria-hidden="true">
                      <span>N</span>
                      <span>E</span>
                      <span>S</span>
                      <span>W</span>
                    </span>
                  </div>
                  <figcaption className="mt-2.5 flex items-center justify-between gap-4 text-[0.66rem] uppercase tracking-[0.22em] text-gold-faint">
                    <span>{v.year}</span>
                    <span>{v.coords}</span>
                  </figcaption>
                </div>
                <div className="flex flex-col gap-2.5">
                  <span className="serif text-[2.6rem] text-gold">{v.year}</span>
                  <p className="text-gold-dim leading-[1.6] max-w-[26rem]">{v.note}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
