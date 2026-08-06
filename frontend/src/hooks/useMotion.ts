import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * A small motion kit for editorial reveals.
 * - `useReveal` fades/rises elements tagged with [data-reveal] as they enter.
 * - `useTextReveal` splits headings tagged with [data-text-reveal] into lines
 *   and animates them in with a mask wipe, one line at a time.
 * All animations respect prefers-reduced-motion.
 */
export function useReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        el.classList.add('is-in')
      })
      return
    }

    const els = gsap.utils.toArray<HTMLElement>('[data-reveal]')
    const triggers = els.map((el) => {
      const delay = parseFloat(el.dataset.revealDelay || '0')
      return gsap.fromTo(
        el,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        },
      )
    })

    return () => {
      triggers.forEach((t) => t.scrollTrigger?.kill())
      triggers.forEach((t) => t.kill())
    }
  }, [])
}

export function useTextReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('[data-text-reveal]').forEach((el) => {
        el.classList.add('is-in')
      })
      return
    }

    const els = gsap.utils.toArray<HTMLElement>('[data-text-reveal]')

    els.forEach((el) => {
      // Split the element's text into individual lines by wrapping words
      // and measuring natural line breaks.
      const text = el.textContent || ''
      el.textContent = ''
      const words = text.split(/\s+/)
      const lines: HTMLElement[] = []

      // Build a hidden measuring clone to detect line breaks.
      const measure = document.createElement('span')
      measure.style.cssText =
        'position:absolute;visibility:hidden;white-space:nowrap;font:inherit;'
      el.appendChild(measure)

      let line: HTMLElement | null = null
      let lineText = ''
      for (const word of words) {
        const test = lineText ? lineText + ' ' + word : word
        measure.textContent = test
        const fits =
          line && measure.getBoundingClientRect().width <= el.clientWidth
        if (!line || !fits) {
          line = document.createElement('span')
          line.className = 'text-line'
          line.style.display = 'block'
          line.style.overflow = 'hidden'
          el.appendChild(line)
          lines.push(line)
          lineText = word
          const inner = document.createElement('span')
          inner.className = 'text-line-inner'
          inner.style.display = 'inline-block'
          inner.textContent = word
          line.appendChild(inner)
        } else {
          lineText += ' ' + word
          const inner = document.createElement('span')
          inner.className = 'text-line-inner'
          inner.style.display = 'inline-block'
          inner.textContent = ' ' + word
          line?.appendChild(inner)
        }
      }
      measure.remove()

      const inners = el.querySelectorAll<HTMLElement>('.text-line-inner')
      gsap.fromTo(
        inners,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power4.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        },
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [])
}
