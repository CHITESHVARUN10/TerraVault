import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PILLARS = [
  {
    n: '01',
    title: 'Your Drive, not ours',
    body: 'Every document, photograph, and coordinate lives inside a folder you control in your own Google Drive.',
  },
  {
    n: '02',
    title: 'Nothing retained',
    body: 'TerraVault orchestrates reads and writes, then forgets. Property data is never stored in our database.',
  },
  {
    n: '03',
    title: 'Zero-trust by design',
    body: 'Even a full compromise of our backend exposes none of your property — there is nothing of yours to take.',
  },
]

export default function Privacy() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-privacy-card]')
      if (cards.length) {
        gsap.fromTo(
          cards,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.2,
            scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
          },
        )
      }
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="privacy" className="bg-ink py-[var(--section-pad)] border-t border-line-soft">
      <div className="mx-auto w-[min(var(--maxw),100%-(var(--gutter)*2))]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-[clamp(2rem,6vw,6rem)] items-start mb-[clamp(3rem,8vh,6rem)]">
          <p className="eyebrow" data-reveal>
            04 — Privacy
          </p>
          <h2 className="serif text-[clamp(2.2rem,5vw,4rem)] leading-[1.05]" data-text-reveal>
            We never hold your land.
            <br />
            <em className="italic text-amber-bright">We hold the key.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map((p) => (
            <div
              className="border border-line rounded-[4px] p-9 bg-ink-soft hover:border-amber hover:-translate-y-1 transition-all duration-500"
              data-privacy-card
              key={p.n}
            >
              <span className="block text-[0.7rem] uppercase tracking-[0.24em] text-amber mb-9">{p.n}</span>
              <h3 className="serif text-[1.5rem] mb-3.5">{p.title}</h3>
              <p className="text-gold-dim text-[0.95rem] leading-[1.65]">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
