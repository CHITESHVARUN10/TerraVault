import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DOCS = [
  { name: 'Ownership.pdf (Deed)', tag: 'Primary', meta: '2.4 MB', primary: true },
  { name: 'Survey.pdf', tag: '', meta: '2.4 MB', primary: false },
  { name: 'TaxReceipt.pdf', tag: '', meta: '2023-24', primary: false },
  { name: 'Will.pdf', tag: '', meta: 'Notarized', primary: false },
  { name: 'ChainOfTitle.pdf', tag: '', meta: 'Historical', primary: false },
]

/**
 * Vault — the archive ledger, matching 01_landing.html:
 * "One folder. Everything that matters." header, a paper-styled
 * ledger card with document rows, and a sticky notes column.
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
        <h2 className="serif font-[380] text-[clamp(2rem,3.3vw,3rem)] leading-[1.15] mb-16 text-on-surface" data-text-reveal>
          One folder. <em className="italic text-[#d4a845]">Everything</em> that matters.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Ledger card */}
          <div className="lg:col-span-7">
            <div className="relative bg-paper p-6 border border-line-soft rounded-[2px]" data-ledger>
              <span className="hero__plate-corner hero__plate-corner--tl" />
              <span className="hero__plate-corner hero__plate-corner--tr" />
              <span className="hero__plate-corner hero__plate-corner--bl" />
              <span className="hero__plate-corner hero__plate-corner--br" />
              <div className="flex justify-between items-center border-b border-line-soft pb-4 mb-6">
                <span className="text-[0.9rem] text-on-surface uppercase tracking-wider">Property Vault</span>
                <span className="text-[0.68rem] uppercase tracking-[0.16em] text-gold-dim">Village Property · 05 documents</span>
              </div>
              <div className="flex flex-col gap-4">
                {DOCS.map((d) => (
                  <div
                    className={`flex justify-between items-center p-3 ${d.primary ? 'bg-line-soft bg-opacity-30 rounded-[2px]' : 'border-b border-line-soft'}`}
                    data-ledger-row
                    key={d.name}
                  >
                    <span className="text-[0.95rem] text-on-surface">{d.name}</span>
                    {d.primary ? (
                      <span className="px-2 py-1 bg-amber text-ink text-[10px] font-bold rounded-[2px] uppercase">Primary</span>
                    ) : (
                      <span className="text-[0.68rem] uppercase tracking-[0.14em] text-gold-dim">{d.meta}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-4 border-t border-line-soft flex gap-4 text-[0.68rem] uppercase tracking-[0.16em] text-gold-dim opacity-70">
                <span>Visits /</span>
                <span>2026</span>
                <span>·</span>
                <span>2027</span>
                <span>·</span>
                <span>2028</span>
              </div>
            </div>
          </div>

          {/* Sticky notes */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-4" data-vault-notes>
            <h3 className="serif text-[1.8rem] mb-2">Structured, not scattered</h3>
            <p className="text-gold-dim leading-[1.7] max-w-[30rem] mb-6">
              Your land's entire history is organized into a single, indestructible physical ledger.
              No more searching through dusty boxes or expired digital links.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {['Deed', 'Survey', 'Will', 'Receipt', 'Photos', 'GPS'].map((chip) => (
                <span
                  key={chip}
                  className="px-3 py-1.5 border border-line-soft text-[0.8rem] text-on-surface-variant rounded-full"
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
