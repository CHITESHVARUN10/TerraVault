import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ContourField } from './Contours'
import { IconLocation, IconLock } from './icons'

const VAULT_IMG = '/hero-vault.webp'

/**
 * Editorial hero — matches 01_landing.html: giant serif headline
 * with line-mask reveal, the glass vault as a masked archival plate
 * with floating COORDINATES / VAULT STATUS labels, animated contour
 * field behind, and a coordinate ticker at the base.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .fromTo('[data-hero-eyebrow]', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.1)
        .fromTo('[data-hero-sub]', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.65)
        .fromTo('[data-hero-actions] > *', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1 }, 0.8)
        .fromTo('[data-hero-plate]', { autoAlpha: 0, clipPath: 'inset(0 0 100% 0)' }, { autoAlpha: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'power4.out' }, 0.4)
        .fromTo('[data-hero-meta]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 1.1)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="top" className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-center overflow-hidden bg-ink contour-bg">
      <div className="absolute inset-0 z-0 opacity-80" aria-hidden="true">
        <ContourField variant="faint" />
      </div>

      <div className="relative z-[2] mx-auto grid w-[min(var(--maxw),100%-(var(--gutter)*2))] grid-cols-1 md:grid-cols-12 gap-16 items-center py-24 md:py-28">
        {/* Left: copy */}
        <div className="md:col-span-5 flex flex-col gap-4 z-10">
          <p className="eyebrow mb-2" data-hero-eyebrow>
            A private vault for your land
          </p>

          <h1 className="serif font-[380] text-[clamp(2.25rem,4.4vw,4rem)] leading-[1.1] tracking-[-0.02em] mb-2 text-on-surface" data-text-reveal>
            Your land,{' '}
            <br />
            <em className="italic font-[360] text-[#d4a845]">kept</em> for good
          </h1>

          <p className="max-w-md text-[1.05rem] leading-[1.6] text-gold-dim mb-2" data-hero-sub>
            Preserve your property records in a secure, archival physical vault for generations to come.
          </p>

          <div className="flex flex-wrap gap-4 mt-4" data-hero-actions>
            <a href="#cta" className="btn btn--solid btn--hero">
              Open your vault
            </a>
            <a href="#vault" className="btn btn--ghost btn--hero">
              See how it works
            </a>
          </div>
        </div>

        {/* Right: vault plate */}
        <div className="md:col-span-7 relative flex justify-center md:justify-end z-10">
          <figure className="relative bg-paper p-4 border border-line-soft max-w-[500px] w-full m-0" data-hero-plate>
            <span className="hero__plate-corner hero__plate-corner--tl" />
            <span className="hero__plate-corner hero__plate-corner--tr" />
            <span className="hero__plate-corner hero__plate-corner--bl" />
            <span className="hero__plate-corner hero__plate-corner--br" />
            <img
              src={VAULT_IMG}
              alt="TerraVault physical land record vault displaying topographical map"
              className="w-full h-auto object-cover opacity-90 mix-blend-screen contrast-125 saturate-50 rounded-[2px]"
            />

            {/* Floating labels */}
            <div className="absolute top-8 left-8 flex flex-col gap-2 pointer-events-none">
              <div className="bg-paper border border-line-soft px-2 py-1 rounded-[2px] text-[0.75rem] uppercase tracking-[0.2em] text-on-surface-variant flex items-center gap-1 backdrop-blur-sm bg-opacity-80">
                <IconLocation size={14} className="text-on-surface-variant" />
                COORDINATES
              </div>
              <div className="bg-paper border border-line-soft px-2 py-1 rounded-[2px] text-[0.75rem] uppercase tracking-[0.2em] text-on-surface-variant flex items-center gap-1 backdrop-blur-sm bg-opacity-80">
                <IconLock size={14} className="text-on-surface-variant" />
                VAULT STATUS: SECURE
              </div>
            </div>
          </figure>
        </div>
      </div>

      {/* Bottom ticker */}
      <div
        className="absolute bottom-8 left-0 w-full px-[var(--gutter)] max-w-[var(--maxw)] left-1/2 -translate-x-1/2 flex justify-between items-end z-10 pointer-events-none"
        data-hero-meta
      >
        <div className="text-[0.75rem] uppercase tracking-[0.25em] text-gold-dim flex items-center gap-2">
          <IconLocation size={16} className="text-gold-dim" />
          N 27°12′04″ · E 78°00′18″
        </div>
        <div className="text-[0.75rem] uppercase tracking-[0.2em] text-on-surface-variant flex flex-col items-center gap-1 opacity-70">
          <span>Scroll to descend</span>
          <span className="material-arrow text-amber animate-bounce-subtle text-sm">↓</span>
        </div>
      </div>
    </section>
  )
}
