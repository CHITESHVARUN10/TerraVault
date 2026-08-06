import { Link } from 'react-router-dom'

/**
 * App footer. Two variants:
 * - default: matches the app-screen footers (04/05): Product/Company/Connect links
 * - landing: matches 01_landing.html: Privacy Protocol / Terms of Custody / Contact Registry
 */
export default function Footer({ variant = 'app' }: { variant?: 'app' | 'landing' }) {
  if (variant === 'landing') {
    return (
      <footer className="bg-ink border-t border-line-soft z-10 relative">
        <div className="mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-[var(--gutter)] py-8 max-w-[var(--maxw)]">
          <span className="font-serif text-[24px] leading-none tracking-widest text-gold uppercase">TerraVault</span>
          <span className="text-[0.75rem] uppercase tracking-[0.2em] text-on-surface-variant opacity-60">
            © 2024 TerraVault Archives. All rights reserved.
          </span>
          <nav className="flex gap-4 text-[0.75rem] uppercase tracking-[0.2em] text-on-surface-variant">
            <Link to="/contact" className="hover:text-gold underline decoration-transparent hover:decoration-gold transition-all duration-300 no-underline">
              Privacy Protocol
            </Link>
            <Link to="/contact" className="hover:text-gold underline decoration-transparent hover:decoration-gold transition-all duration-300 no-underline">
              Terms of Custody
            </Link>
            <Link to="/contact" className="hover:text-gold underline decoration-transparent hover:decoration-gold transition-all duration-300 no-underline">
              Contact Registry
            </Link>
          </nav>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-ink border-t border-line-soft mt-auto">
      <div className="mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-[var(--gutter)] py-8 max-w-[var(--maxw)]">
        <span className="font-serif text-[1.05rem] tracking-widest text-gold uppercase">TerraVault</span>
        <nav className="flex gap-6 text-[0.7rem] uppercase tracking-[0.12em] text-gold-faint">
          <Link to="/" className="hover:text-gold transition-colors no-underline">Privacy Protocol</Link>
          <Link to="/contact" className="hover:text-gold transition-colors no-underline">Terms of Custody</Link>
          <Link to="/contact" className="hover:text-gold transition-colors no-underline">Contact Registry</Link>
        </nav>
        <p className="text-[0.7rem] uppercase tracking-[0.1em] text-gold-faint">
          © 2024 TerraVault Archives. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
