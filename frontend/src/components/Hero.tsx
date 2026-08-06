import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ContourField } from './Contours'

const VAULT_IMG = '/hero-vault.webp'

/**
 * Editorial hero: giant serif headline with line-mask reveal,
 * the glass vault as a masked archival plate, an animated contour
 * field behind, and a quiet coordinate ticker at the base.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .fromTo('[data-hero-eyebrow]', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.1)
        .fromTo('[data-hero-title] .text-line-inner', { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.14 }, 0.2)
        .fromTo('[data-hero-sub]', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.65)
        .fromTo('[data-hero-actions] > *', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1 }, 0.8)
        .fromTo('[data-hero-plate]', { autoAlpha: 0, clipPath: 'inset(0 0 100% 0)' }, { autoAlpha: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'power4.out' }, 0.4)
        .fromTo('[data-hero-meta]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 1.1)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="top" className="relative min-h-svh flex flex-col justify-center overflow-hidden bg-ink">
      <div className="absolute inset-0 z-0 opacity-80" aria-hidden="true">
        <ContourField variant="faint" />
      </div>

      <div className="relative z-[2] mx-auto grid w-[min(var(--maxw),100%-(var(--gutter)*2))] grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-[clamp(2rem,6vw,6rem)] items-center py-24 md:py-28">
        <div className="max-w-[40rem]">
          <p className="eyebrow mb-6" data-hero-eyebrow>
            A private vault for your land
          </p>

          <h1 className="serif text-[clamp(3rem,8vw,6.4rem)] leading-[0.98] tracking-[-0.03em] mb-7" data-text-reveal>
            Your land,
            <br />
            <em className="italic font-[360] text-amber-bright">kept</em> for good.
          </h1>

          <p className="max-w-[32rem] text-[1.05rem] leading-[1.65] text-gold-dim mb-9" data-hero-sub>
            TerraVault preserves your deeds, photographs, and every visit to your
            property — sealed in a vault that lives in your own Google Drive.
          </p>

          <div className="flex flex-wrap gap-4" data-hero-actions>
            <a href="#cta" className="btn btn--solid">
              Open your vault
            </a>
            <a href="#vault" className="btn btn--ghost">
              See how it works
            </a>
          </div>
        </div>

        <figure className="m-0 hidden md:block" data-hero-plate>
          <div className="relative p-3.5 bg-paper shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]">
            <img
              src={VAULT_IMG}
              alt="A glass vault containing a luminous topographic landscape"
              className="w-full aspect-[4/3] object-cover saturate-[0.9] contrast-[1.02]"
            />
            <span className="hero__plate-corner hero__plate-corner--tl" />
            <span className="hero__plate-corner hero__plate-corner--tr" />
            <span className="hero__plate-corner hero__plate-corner--bl" />
            <span className="hero__plate-corner hero__plate-corner--br" />
          </div>
          <figcaption className="mt-3 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.24em] text-gold-faint">
            <span>Plate I</span>
            <span>—</span>
            <span>The property vault</span>
          </figcaption>
        </figure>
      </div>

      <div className="absolute inset-x-0 bottom-8 z-[2] flex items-center justify-center gap-4 text-[0.66rem] uppercase tracking-[0.26em] text-gold-faint" data-hero-meta>
        <span className="w-[60px] h-px bg-line" />
        <span>N 27° 12′ 04″</span>
        <span className="w-1 h-1 rounded-full bg-amber" />
        <span>E 78° 00′ 18″</span>
        <span className="w-[60px] h-px bg-line" />
        <span className="text-amber">Scroll to descend</span>
      </div>
    </section>
  )
}
