import { Link, useLocation } from 'react-router-dom'
import Plate from '../components/ui/Plate'
import { IconCheckCircle } from '../components/icons'

/**
 * Check email — matches stitch_screens/17_check_email.html:
 * standalone centered plate, check_circle icon in a bordered circle,
 * amber body copy, ghost "Back to sign in".
 */
export default function CheckEmail() {
  const location = useLocation()
  const email = (location.state as { email?: string } | null)?.email

  return (
    <main
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-[var(--gutter)]"
      style={{ backgroundColor: '#0c0b09', color: '#e9e1d8' }}
    >
      {/* Subtle contour backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at center, rgba(56, 54, 46, 0.3) 0%, rgba(22, 19, 14, 1) 60%, rgba(22, 19, 14, 1) 100%)',
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        <Plate className="p-8 md:p-12 text-center" hover>
          {/* Icon */}
          <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-full border border-line-soft bg-ink">
            <IconCheckCircle size={24} className="text-amber" filled />
          </div>

          <h1 className="font-serif text-[1.8rem] text-on-surface mb-4">Check your email</h1>
          <p className="text-[0.95rem] leading-relaxed mb-8 max-w-sm mx-auto" style={{ color: 'rgba(212,168,69,0.7)' }}>
            A reset protocol has been sent{email ? ` to ${email}` : ' to your address'}. Please verify
            your identity via the link provided.
          </p>

          <Link
            to="/login"
            className="btn-lift block w-full border border-line text-amber px-6 py-3 text-[0.8rem] uppercase tracking-[0.14em] font-semibold hover:bg-ink-card transition-colors no-underline"
          >
            Back to sign in
          </Link>
        </Plate>
      </div>
    </main>
  )
}
