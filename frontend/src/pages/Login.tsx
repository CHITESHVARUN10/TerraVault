import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import Plate from '../components/ui/Plate'
import { IconMail, IconKey, IconArrowForward } from '../components/icons'

/**
 * Login — matches stitch_screens/02_login.html: archive plate card,
 * bordered inputs with right icons, amber "Forgot your security key?"
 * link, gold full-width submit, error line, footer CTA.
 */
export default function Login() {
  const { user, login } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  if (user) return <Navigate to={from} replace />

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    // Test mode: an empty form signs straight into the demo account.
    const result = login(email.trim(), password)
    if (!result.ok) {
      setSubmitting(false)
      return setError(result.error ?? 'Invalid credentials or unaligned coordinates.')
    }
    navigate(from, { replace: true })
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `
          radial-gradient(circle at 50% 50%, rgba(212, 168, 69, 0.03) 0%, transparent 60%),
          repeating-radial-gradient(circle at center, transparent 0, transparent 40px, rgba(212, 168, 69, 0.05) 41px, transparent 42px)
        `,
        backgroundColor: '#0c0b09',
      }}
    >
      <div className="relative w-full max-w-md z-10">
        <Plate className="p-8 sm:p-12" hover={false}>
          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-[0.7rem] uppercase tracking-[0.3em] text-amber mb-4 font-semibold">
              Vault access
            </p>
            <h1 className="font-serif text-[2rem] text-on-surface">Sign in</h1>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="block text-[0.7rem] uppercase tracking-[0.3em] text-on-surface-variant mb-2 font-semibold" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  placeholder="user@terravault.com"
                  className="form-input pr-10"
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-outline-variant">
                  <IconMail size={16} />
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[0.7rem] uppercase tracking-[0.3em] text-on-surface-variant mb-2 font-semibold" htmlFor="password">
                Security Key
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                  placeholder="••••••••••••"
                  className="form-input pr-10"
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-outline-variant">
                  <IconKey size={16} />
                </span>
              </div>
              <div className="mt-2 text-right">
                <Link
                  to="/reset-password"
                  className="nav-link text-[0.8rem] uppercase tracking-wider opacity-80 text-amber no-underline inline-block"
                >
                  Forgot your security key?
                </Link>
              </div>
            </div>

            {/* Error line */}
            {error && (
              <div className="text-error text-[0.9rem] border-l-2 border-error pl-2 animate-pulse">
                {error}
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="btn-lift w-full py-4 bg-gold text-ink font-semibold text-[0.8rem] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-primary transition-colors disabled:opacity-60"
              >
                {submitting ? 'Authenticating…' : 'Sign in'}
                {!submitting && <IconArrowForward size={16} />}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center border-t border-line-soft pt-6">
            <p className="text-[0.95rem] text-on-surface-variant">
              New to TerraVault?{' '}
              <Link
                to="/register"
                className="nav-link text-[0.8rem] uppercase tracking-wider ml-1 text-amber no-underline inline-block"
              >
                Open your vault
              </Link>
            </p>
          </div>
        </Plate>
      </div>
    </main>
  )
}
