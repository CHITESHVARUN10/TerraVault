import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Initialises Lenis smooth scrolling and drives it with rAF.
 * Exposes the Lenis instance via a callback so other components
 * (e.g. Three.js scroll handlers) can read the current scroll.
 */
export function useLenis(onScroll?: (y: number) => void) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    })

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // Mirror scroll progress to Three.js / GSAP via the callback.
    if (onScroll) {
      const onNative = () => onScroll(window.scrollY)
      window.addEventListener('scroll', onNative, { passive: true })
      return () => {
        window.removeEventListener('scroll', onNative)
        cancelAnimationFrame(rafId)
        lenis.destroy()
      }
    }
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [onScroll])
}

export type { Lenis }
