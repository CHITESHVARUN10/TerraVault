import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function CTA() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-cta-actions] > *',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, scrollTrigger: { trigger: '[data-cta-actions]', start: 'top 90%', once: true } },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="cta" className="bg-ink py-[var(--section-pad)] border-t border-line-soft text-center">
      <div className="mx-auto w-[min(var(--maxw),100%-(var(--gutter)*2))]">
        <p className="eyebrow" data-reveal>
          Your land, kept
        </p>
        <h2 className="serif font-[380] text-[clamp(2.25rem,4.4vw,4rem)] leading-[1.1] mt-5 mb-9 text-on-surface" data-cta-title>
          Start with one property.
          <br />
          <em className="italic text-[#d4a845]">Keep it forever.</em>
        </h2>
        <div className="flex flex-col items-center gap-5" data-cta-actions>
          <Link to="/register" className="btn btn--solid btn--large">
            Open your vault
          </Link>
          <span className="text-[10px] text-gold-dim opacity-60 uppercase tracking-widest">
            Connect Google Drive · No property data on our servers
          </span>
        </div>
      </div>
    </section>
  )
}
