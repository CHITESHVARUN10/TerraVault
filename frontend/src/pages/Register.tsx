import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts'
import Plate from '../components/ui/Plate'

/**
 * Register — matches stitch_screens/03_register.html: brand wordmark,
 * archive plate with underline inputs, "Create account" gold button,
 * noise-texture background.
 */
export default function Register() {
  const { user, register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/dashboard" replace />

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await register(name, email, password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setSubmitting(false)
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 font-body-md antialiased"
      style={{
        backgroundColor: '#0c0b09',
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.05' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
        color: '#e9e1d8',
      }}
    >
      <div className="w-full max-w-md">
        {/* Brand wordmark */}
        <div className="text-center mb-8">
          <span className="font-serif text-[1.2rem] tracking-[0.2em] uppercase text-secondary">TerraVault</span>
        </div>

        <Plate className="p-8 sm:p-12" hover={false}>
          <div className="text-center mb-8">
            <span className="block text-[0.7rem] uppercase tracking-[0.3em] text-amber mb-2 font-semibold">
              Open your vault
            </span>
            <h1 className="font-serif text-[2rem] text-gold">Create your vault</h1>
          </div>

          <form onSubmit={submit} className="space-y-5 flex flex-col">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.7rem] uppercase tracking-[0.3em] text-on-surface-variant font-semibold" htmlFor="fullName">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={name}
                onChange={(e) => { setName(e.target.value); setError('') }}
                placeholder="Enter your full name"
                className="input-underline"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.7rem] uppercase tracking-[0.3em] text-on-surface-variant font-semibold mt-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                placeholder="name@domain.com"
                className="input-underline"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.7rem] uppercase tracking-[0.3em] text-on-surface-variant font-semibold mt-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                placeholder="••••••••"
                className="input-underline"
              />
              <span className="text-[10px] uppercase tracking-wider text-outline mt-1">Min. 6 characters</span>
            </div>

            {error && <p className="text-error text-[0.85rem] border-l-2 border-error pl-2">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="btn-lift w-full py-3.5 mt-2 bg-gold text-ink font-semibold text-[0.8rem] uppercase tracking-[0.2em] hover:bg-primary transition-colors disabled:opacity-60"
            >
              {submitting ? 'Creating vault…' : 'Create account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[0.85rem] text-on-surface-variant">
              Already have a vault?{' '}
              <Link
                to="/login"
                className="text-amber hover:text-gold transition-colors no-underline relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-px after:bg-amber hover:after:w-full after:transition-all after:duration-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Plate>
      </div>
    </main>
  )
}
