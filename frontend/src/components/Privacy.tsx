import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PILLARS = [
  {
    n: '01',
    title: 'Your Drive, not ours',
    body: 'All records reside in your personal cloud storage, never on our servers.',
  },
  {
    n: '02',
    title: 'Nothing retained',
    body: 'We act as a lens, not a bucket. Your data passes through, never stays.',
  },
  {
    n: '03',
    title: 'Zero-trust by design',
    body: 'End-to-end encryption ensures only you can unlock your property\'s history.',
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
        <div className="flex flex-col items-center text-center mb-[clamp(3rem,8vh,6rem)]">
          <p className="eyebrow mb-4" data-reveal>
            Section — 04 Privacy
          </p>
          <h2 className="serif font-[380] text-[clamp(2rem,3.3vw,3rem)] leading-[1.15] max-w-3xl text-on-surface" data-text-reveal>
            We never hold your land. <em className="italic text-[#d4a845]">hold the key.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map((p) => (
            <div
              className="group p-8 border border-line-soft hover:border-amber transition-colors duration-300 flex flex-col gap-4"
              data-privacy-card
              key={p.n}
            >
              <span className="text-[0.75rem] uppercase tracking-[0.2em] text-[#d4a845] opacity-40">{p.n}</span>
              <h3 className="serif text-[1.5rem] text-on-surface">{p.title}</h3>
              <p className="text-gold-dim text-[0.95rem] leading-[1.65]">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
