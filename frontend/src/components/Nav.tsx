import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useStore } from '../lib/store'

/**
 * App shell header. Shows app links when signed in, marketing links when
 * signed out, and the auth actions on the right.
 */
export default function Nav() {
  const { user, logout } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location.pathname])

  const appLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/properties', label: 'Properties' },
    { to: '/contact', label: 'Contact' },
  ]

  const marketingLinks = [
    { to: '/', label: 'Home' },
    { to: '/contact', label: 'Contact' },
  ]

  const links = user ? appLinks : marketingLinks

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] transition-all duration-500 border-b ${
        scrolled
          ? 'py-3 bg-ink/85 backdrop-blur-md border-line-soft'
          : 'py-5 bg-transparent border-transparent'
      }`}
    >
      <div className="mx-auto flex items-center justify-between gap-4 w-[min(var(--maxw),100%-(var(--gutter)*2))]">
        <Link
          to="/"
          aria-label="TerraVault home"
          className="inline-flex items-center gap-2 text-gold no-underline"
        >
          <span className="text-amber">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 3 3 8l9 5 9-5-9-5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M3 12.5 12 17l9-4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="18.5" r="1.4" fill="currentColor" />
            </svg>
          </span>
          <span className="font-serif text-lg tracking-wide">TerraVault</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-[0.78rem] font-medium uppercase tracking-[0.12em] transition-colors no-underline relative nav-link ${
                  isActive ? 'text-gold' : 'text-gold-dim hover:text-gold'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2.5 no-underline group"
                title={user.name}
              >
                <span className="w-8 h-8 rounded-full border border-amber/50 bg-ink-card grid place-items-center text-[0.68rem] font-semibold text-gold group-hover:border-amber transition-colors">
                  {user.initials}
                </span>
                <span className="text-[0.72rem] uppercase tracking-[0.1em] text-gold-dim group-hover:text-gold transition-colors">
                  {user.name.split(' ')[0]}
                </span>
              </Link>
              <button
                onClick={logout}
                className="text-[0.72rem] uppercase tracking-[0.12em] text-gold-faint hover:text-amber-bright transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[0.78rem] font-medium uppercase tracking-[0.12em] text-gold-dim hover:text-gold transition-colors no-underline"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-ink bg-gold px-4 py-2.5 rounded-[2px] hover:bg-amber-bright transition-colors no-underline"
              >
                Open your vault
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-gold text-xl"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-ink/95 backdrop-blur-md border-t border-line-soft px-8 py-6 flex flex-col gap-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className="text-[0.9rem] uppercase tracking-[0.14em] text-gold-dim no-underline"
            >
              {l.label}
            </NavLink>
          ))}
          <div className="border-t border-line-soft pt-4 flex flex-col gap-3">
            {user ? (
              <>
                <Link to="/profile" className="text-[0.9rem] uppercase tracking-[0.14em] text-gold no-underline">
                  {user.name}
                </Link>
                <button onClick={logout} className="text-left text-[0.9rem] uppercase tracking-[0.14em] text-gold-faint cursor-pointer">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-[0.9rem] uppercase tracking-[0.14em] text-gold-dim no-underline">
                  Sign in
                </Link>
                <Link to="/register" className="text-[0.9rem] uppercase tracking-[0.14em] text-ink bg-gold px-4 py-2.5 rounded-[2px] text-center no-underline">
                  Open your vault
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
