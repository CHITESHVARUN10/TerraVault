import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import { Field, TextInput } from '../components/ui/Field'
import { Button } from '../components/ui/Button'

export default function Login() {
  const { user, login } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  if (user) return <Navigate to={from} replace />

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = login(email, password)
    if (!result.ok) return setError(result.error ?? 'Something went wrong.')
    navigate(from, { replace: true })
  }

  return (
    <main className="relative min-h-screen bg-ink flex items-center justify-center px-4 py-28">
      <div className="absolute inset-0 opacity-40 pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1200 800" fill="none" className="w-full h-full opacity-60" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 12 }).map((_, i) => (
            <ellipse
              key={i}
              cx={600 + Math.sin(i * 1.7) * 420}
              cy={400 + Math.cos(i * 1.3) * 280}
              rx={180 + i * 40}
              ry={110 + i * 22}
              stroke="#2e2a20"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      <div className="relative w-full max-w-md">
        <div className="relative border border-line bg-ink-soft px-8 py-10 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]">
          <span className="absolute top-0 left-0 w-3.5 h-3.5 border-t border-l border-amber" aria-hidden="true" />
          <span className="absolute top-0 right-0 w-3.5 h-3.5 border-t border-r border-amber" aria-hidden="true" />
          <span className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b border-l border-amber" aria-hidden="true" />
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b border-r border-amber" aria-hidden="true" />

          <p className="text-[0.62rem] uppercase tracking-[0.28em] text-amber mb-2">Vault access</p>
          <h1 className="font-serif text-3xl text-gold mb-2">Sign in</h1>
          <p className="text-[0.85rem] text-gold-dim mb-8">
            Return to your property records.
          </p>

          <form onSubmit={submit} className="flex flex-col gap-5">
            <Field label="Email" required>
              <TextInput
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                placeholder="you@example.com"
                autoFocus
              />
            </Field>
            <Field label="Password" required>
              <TextInput
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                placeholder="••••••••"
              />
            </Field>

            {error && <p className="text-[0.82rem] text-amber-bright">{error}</p>}

            <Button onClick={submit} className="w-full mt-1">Sign in</Button>
          </form>

          <p className="mt-7 text-center text-[0.8rem] text-gold-faint">
            New to TerraVault?{' '}
            <Link to="/register" className="text-amber hover:text-amber-bright no-underline">
              Open your vault
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
