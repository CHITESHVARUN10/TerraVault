import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Plate from '../components/ui/Plate'
import { IconArrowBack, IconArrowForward } from '../components/icons'

/**
 * Reset password — matches stitch_screens/16_reset_password.html:
 * full nav, centered plate, underline email field, gold submit.
 * Submits by navigating to the check-email confirmation screen.
 */
export default function ResetPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid registered email address.')
      return
    }
    navigate('/check-email', { state: { email } })
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: '#100e09',
        backgroundImage: 'radial-gradient(circle at center, rgba(232, 200, 119, 0.03) 0%, transparent 70%)',
      }}
    >
      {/* Top nav */}
      <header className="bg-background border-b border-outline-variant w-full">
        <div className="flex justify-between items-center w-full px-[var(--gutter)] max-w-[76rem] mx-auto h-20">
          <Link to="/" className="font-serif text-[1.1rem] tracking-widest text-gold no-underline">
            TERRAVAULT
          </Link>
          <nav className="hidden md:flex gap-8 items-center">
            {['Archive', 'Coordinates', 'Vaults', 'Ledger'].map((label) => (
              <a key={label} href="#" className="text-[0.78rem] uppercase tracking-[0.1em] text-on-surface-variant hover:text-gold transition-all duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-gold hover:after:w-full after:transition-all after:duration-300 no-underline">
                {label}
              </a>
            ))}
          </nav>
          <Link to="/login" className="text-[0.78rem] uppercase tracking-[0.08em] text-gold border-b border-gold hover:text-primary transition-colors pb-0.5 no-underline">
            Access Vault
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-[var(--gutter)] py-[var(--section-pad)] relative">
        <div className="relative w-full max-w-md">
          <Plate className="p-8" hover>
            <div className="flex flex-col h-full relative z-10">
              <div className="mb-8 text-center md:text-left">
                <span className="text-[0.7rem] uppercase tracking-[0.3em] text-gold block mb-4 font-semibold">
                  Vault access
                </span>
                <h1 className="font-serif text-[1.8rem] text-on-surface mb-4">Reset your password</h1>
                <p className="text-[0.95rem] text-gold-faint">
                  A secure reset link will be dispatched to your registered email address.
                </p>
              </div>

              <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.7rem] uppercase tracking-[0.3em] text-on-surface-variant font-semibold" htmlFor="email">
                    Registered email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError('') }}
                    placeholder="operator@terravault.io"
                    className="input-underline"
                  />
                </div>

                {error && <p className="text-error text-[0.85rem] border-l-2 border-error pl-2">{error}</p>}

                <div className="mt-4">
                  <button
                    type="submit"
                    className="btn-lift w-full bg-gold text-ink font-semibold text-[0.8rem] uppercase tracking-[0.2em] py-4 px-6 flex justify-center items-center gap-2 hover:bg-primary transition-colors"
                  >
                    <span>Send reset link</span>
                    <IconArrowForward size={16} />
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center border-t border-outline-variant pt-6">
                <Link
                  to="/login"
                  className="text-[0.8rem] uppercase tracking-[0.1em] text-gold nav-link no-underline inline-flex items-center gap-2"
                >
                  <IconArrowBack size={16} />
                  Back to Login
                </Link>
              </div>
            </div>
          </Plate>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-outline-variant w-full mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-[var(--gutter)] py-8 max-w-[76rem] mx-auto gap-4">
          <span className="text-[0.7rem] uppercase tracking-[0.1em] text-on-surface-variant">
            © 2024 TerraVault Archives. All rights reserved.
          </span>
          <nav className="flex gap-6 items-center">
            {['Privacy Protocol', 'Terms of Custody', 'Contact Registry'].map((label) => (
              <a key={label} href="#" className="text-[0.7rem] uppercase tracking-[0.1em] text-on-surface-variant hover:text-gold transition-all no-underline">
                {label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  )
}
