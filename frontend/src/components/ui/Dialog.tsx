import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import gsap from 'gsap'
import CornerTicks from './CornerTicks'
import { IconClose } from '../icons'

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  eyebrow?: string
  children: ReactNode
  footer?: ReactNode
  wide?: boolean
}

/**
 * Editorial modal dialog: dark gold panel, hairline border, corner ticks.
 * Closes on overlay click and Escape. Locks body scroll while open.
 * Animates in with a fade + rise on mount, and out when closed.
 */
export default function Dialog({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  wide,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Entrance animation when the dialog opens
  useEffect(() => {
    if (!open) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: 'power2.out' })
      gsap.fromTo(
        panelRef.current,
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out' },
      )
    })
    return () => ctx.revert()
  }, [open])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className={`relative w-full ${wide ? 'max-w-2xl' : 'max-w-md'} max-h-[86vh] overflow-y-auto bg-panel border border-line shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]`}
      >
        <CornerTicks />

        <div className="flex items-start justify-between gap-6 px-7 pt-7 pb-5 border-b border-line-soft">
          <div>
            {eyebrow && (
              <p className="text-[0.62rem] uppercase tracking-[0.26em] text-amber mb-1.5">{eyebrow}</p>
            )}
            <h2 className="font-serif text-2xl text-gold leading-tight">{title}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="text-gold-faint hover:text-amber-bright transition-colors mt-0.5"
          >
            <IconClose size={22} />
          </button>
        </div>

        <div className="px-7 py-6">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 px-7 pb-7 pt-1">{footer}</div>
        )}
      </div>
    </div>
  )
}
