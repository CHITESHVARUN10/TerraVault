import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * A small motion kit for editorial reveals.
 * - `useReveal` fades/rises elements tagged with [data-reveal] as they enter.
 * - `useTextReveal` splits headings tagged with [data-text-reveal] into lines
 *   and animates them in with a mask wipe, one line at a time.
 *   Inline elements (`<em>`, `<span>`) are preserved so colored/italic
 *   words keep their styling.
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

/**
 * Split a heading into masked lines WITHOUT destroying inline elements.
 * Words from text nodes are wrapped in `.text-line-inner`; inline element
 * children (`<em>`, `<span>`) are cloned into the line structure so their
 * color/typography survives.
 */
function splitPreservingInlines(el: HTMLElement) {
  const isElement = (n: Node): n is Element => n.nodeType === Node.ELEMENT_NODE

  // Guard: already split (has .reveal-line children) — no-op.
  if (el.querySelector('.reveal-line')) return

  // Snapshot original markup, then clear so nothing accumulates.
  const source = el.cloneNode(true) as HTMLElement
  el.textContent = ''

  // Build a list of "segments": either {type:'text', text} or {type:'el', el}
  const segments: { type: 'text' | 'el'; text?: string; el?: Element }[] = []
  source.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      segments.push({ type: 'text', text: node.textContent || '' })
    } else if (isElement(node)) {
      segments.push({ type: 'el', el: node })
    }
  })

  // Flatten into words, keeping inline elements attached to the previous word.
  const tokens: { word?: string; el?: Element; br?: boolean }[] = []
  for (const seg of segments) {
    if (seg.type === 'text' && seg.text) {
      const words = seg.text.split(/(\s+)/).filter((w) => w.length > 0)
      for (const w of words) tokens.push({ word: w })
    } else if (seg.type === 'el' && seg.el) {
      // Inline element: keep it as its own token (with its text preserved).
      if (seg.el.tagName.toLowerCase() === 'br') {
        tokens.push({ br: true })
      } else {
        tokens.push({ el: seg.el })
      }
    }
  }

  // Whitespace inside inline-block spans collapses, so spaces must be
  // non-breaking to render between word spans.
  const spaceFor = (tok: { word?: string; el?: Element; br?: boolean }) =>
    tok.word && /^\s+$/.test(tok.word) ? '\u00A0' : tok.word || ''
  // Measure line breaks using a hidden clone.
  const measure = document.createElement('span')
  measure.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font:inherit;'
  el.appendChild(measure)

  const lines: HTMLElement[] = []
  let line: HTMLElement | null = null
  let lineWidth = 0

  const pushLine = (): HTMLElement => {
    const l = document.createElement('span')
    l.className = 'reveal-line'
    l.style.display = 'block'
    l.style.overflow = 'hidden'
    el.appendChild(l)
    lines.push(l)
    line = l
    lineWidth = 0
    return l
  }

  const appendToken = (tok: { word?: string; el?: Element; br?: boolean }, leadingSpace: string) => {
    if (!line) pushLine()
    if (tok.br) {
      // Hard line break: end the current line.
      if (lineWidth > 0) pushLine()
      return
    }
    if (tok.el) {
      // Clone the element into the line, preserving its classes/styles.
      const clone = tok.el.cloneNode(true) as HTMLElement
      clone.classList.add('reveal-line-inner')
      clone.style.display = 'inline-block'
      clone.style.whiteSpace = 'pre'
      line?.appendChild(clone)
      const w = measure.cloneNode() as HTMLElement
      w.textContent = ' ' + (tok.el.textContent || '')
      el.appendChild(w)
      lineWidth += w.getBoundingClientRect().width
      w.remove()
      return
    }
    const word = spaceFor(tok)
    const inner = document.createElement('span')
    inner.className = 'reveal-line-inner'
    inner.style.display = 'inline-block'
    inner.style.whiteSpace = 'pre'
    inner.textContent = leadingSpace + word
    // Estimate width for line detection.
    measure.textContent = leadingSpace + word
    const w = measure.getBoundingClientRect().width
    if (lineWidth + w > el.clientWidth && lineWidth > 0) {
      pushLine()
      inner.textContent = word.trimStart()
      line!.appendChild(inner)
      lineWidth = w
    } else {
      line!.appendChild(inner)
      lineWidth += w
    }
  }

  for (const tok of tokens) {
    const isSpace = tok.word ? /^\s+$/.test(tok.word) : false
    const leadingSpace = isSpace ? '' : tok.word && /^\s/.test(tok.word) ? '\u00A0' : ''
    appendToken(tok, leadingSpace)
  }

  measure.remove()
  return lines
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
      splitPreservingInlines(el)
      const inners = el.querySelectorAll<HTMLElement>('.reveal-line-inner')
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
