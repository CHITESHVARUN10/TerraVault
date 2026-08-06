import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DOCS = [
  { name: 'Ownership.pdf', tag: 'Deed', meta: 'Registered 1998' },
  { name: 'Survey.pdf', tag: 'Survey', meta: 'Khasra 214 · 2.4 ha' },
  { name: 'TaxReceipt.pdf', tag: 'Receipt', meta: 'FY 2025–26' },
  { name: 'Will.pdf', tag: 'Will', meta: 'Executed 2004' },
  { name: 'ChainOfTitle.pdf', tag: 'History', meta: '6 entries' },
]

/**
 * Vault — the archive. A paper-styled ledger that reveals its
 * document rows one by one as you scroll, then a metadata plate.
 */
export default function Vault() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-ledger-row]',
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: '[data-ledger]', start: 'top 78%', once: true },
        },
      )
      gsap.fromTo(
        '[data-vault-notes]',
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-vault-notes]', start: 'top 85%', once: true },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="vault" className="bg-ink py-[var(--section-pad)] border-t border-line-soft">
      <div className="mx-auto w-[min(var(--maxw),100%-(var(--gutter)*2))]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-[clamp(2rem,6vw,6rem)] items-start mb-[clamp(3rem,8vh,6rem)]">
          <p className="eyebrow" data-reveal>
            01 — The Vault
          </p>
          <h2 className="serif text-[clamp(2.2rem,5vw,4rem)] leading-[1.05]" data-text-reveal>
            One folder.
            <br />
            <em className="italic text-amber-bright">Everything</em> that matters.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-[clamp(2.5rem,6vw,6rem)] items-start">
          <div className="border border-line rounded-[4px] bg-gradient-to-b from-ink-soft to-ink overflow-hidden" data-ledger>
            <div className="flex items-center justify-between gap-4 px-6 py-4 text-[0.72rem] uppercase tracking-[0.16em] text-gold-faint border-b border-line-soft">
              <span>Property Vault / Village Property</span>
              <span className="text-amber">05 documents</span>
            </div>
            {DOCS.map((d) => (
              <div
                className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-6 py-4 border-b border-line-soft last:border-b-0 hover:bg-amber/8 transition-colors"
                data-ledger-row
                key={d.name}
              >
                <span className="font-serif text-[1.05rem] text-gold">{d.name}</span>
                <span className="text-[0.62rem] uppercase tracking-[0.14em] text-amber border border-line rounded-[2px] px-2 py-0.5">
                  {d.tag}
                </span>
                <span className="text-[0.72rem] text-gold-faint">{d.meta}</span>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 px-6 py-4 text-[0.72rem] uppercase tracking-[0.16em] text-gold-faint border-t border-line-soft">
              <span>Visits /</span>
              <span>2026 · 2027 · 2028</span>
            </div>
          </div>

          <div className="lg:sticky lg:top-28" data-vault-notes>
            <h3 className="serif text-[1.8rem] mb-4">Structured, not scattered</h3>
            <p className="text-gold-dim leading-[1.7] max-w-[30rem] mb-7">
              Every property is one folder in your Drive. Its documents carry
              meaning — a deed, a survey, a receipt — instead of living as
              unrecognisable filenames. Each visit becomes a dated record with
              photographs and a position.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Deed', 'Survey', 'Will', 'Receipt', 'Photos', 'GPS'].map((chip) => (
                <span
                  key={chip}
                  className="text-[0.68rem] uppercase tracking-[0.12em] text-gold-dim border border-line rounded-[2px] px-2.5 py-1.5"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
