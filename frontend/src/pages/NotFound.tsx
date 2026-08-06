import { Link } from 'react-router-dom'
import CornerTicks from '../components/ui/CornerTicks'

/**
 * 404 — matches stitch_screens/15_page_not_found.html:
 * top nav, centered ticked plate, "This parcel doesn't exist.",
 * back-to-vault CTA.
 */
export default function NotFound() {
  return (
    <div className="text-on-background min-h-screen flex flex-col" style={{ backgroundColor: '#0c0b09' }}>
      {/* Top nav */}
      <header className="w-full border-b border-outline-variant/30">
        <div className="px-4 md:px-10 lg:px-40 flex justify-center py-5">
          <div className="flex items-center justify-between w-full max-w-[960px]">
            <Link to="/" className="flex items-center gap-4 no-underline text-gold">
              <svg width="20" height="20" viewBox="0 0 48 48" fill="none" className="text-gold">
                <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor" />
              </svg>
              <h2 className="text-lg font-bold tracking-[-0.015em] font-serif text-on-surface">TerraVault</h2>
            </Link>
            <div className="flex-1 justify-end gap-8 hidden md:flex">
              <nav className="flex items-center gap-9">
                {['Archive', 'Coordinates', 'Vaults', 'Ledger'].map((label) => (
                  <a key={label} href="#" className="text-[0.8rem] text-on-surface-variant hover:text-gold transition-colors font-medium no-underline">
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center max-w-2xl w-full text-center relative p-12 lg:p-24 border border-outline-variant/20 bg-surface/40 backdrop-blur-sm rounded-[2px]">
          <CornerTicks />
          <span className="text-gold text-[0.7rem] uppercase tracking-widest mb-6 block font-semibold">Lost ground</span>
          <h1 className="font-serif text-[2.5rem] md:text-5xl lg:text-6xl text-on-surface mb-6 leading-[1.1]">
            This parcel <br className="hidden md:block" />
            <span className="italic text-gold">doesn't exist.</span>
          </h1>
          <p className="text-on-surface-variant text-lg mb-10 max-w-md mx-auto">
            The page you're looking for has moved or was never mapped.
          </p>
          <Link
            to="/"
            className="btn-lift inline-flex items-center justify-center px-8 py-3 bg-gold text-ink font-semibold text-[0.8rem] uppercase tracking-[0.12em] rounded-[2px] hover:bg-primary transition-colors duration-300 no-underline"
          >
            Back to your vault
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-6 px-5 py-10 text-center border-t border-outline-variant/30 mt-auto">
        <p className="text-on-surface-variant/60 text-[0.8rem] uppercase tracking-widest">© TerraVault</p>
      </footer>
    </div>
  )
}
