import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'

export default function Footer() {
  const { user } = useStore()

  return (
    <footer className="bg-ink pt-16 pb-8 border-t border-line-soft">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-12 pb-12 w-[min(var(--maxw),100%-(var(--gutter)*2))]">
        <div className="flex flex-col gap-4">
          <span className="font-serif text-2xl text-gold">TerraVault</span>
          <p className="max-w-[26rem] text-[0.9rem] text-gold-dim leading-[1.6]">
            A private vault for your land. Your property data stays yours — stored
            in your own Google Drive.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="flex flex-col gap-2.5">
            <span className="text-[0.7rem] uppercase tracking-[0.22em] text-gold-faint mb-2">Product</span>
            {user ? (
              <>
                <Link to="/dashboard" className="text-[0.92rem] text-gold-dim hover:text-amber-bright transition-colors no-underline">Dashboard</Link>
                <Link to="/properties" className="text-[0.92rem] text-gold-dim hover:text-amber-bright transition-colors no-underline">Properties</Link>
                <Link to="/profile" className="text-[0.92rem] text-gold-dim hover:text-amber-bright transition-colors no-underline">Profile</Link>
              </>
            ) : (
              <>
                <Link to="/" className="text-[0.92rem] text-gold-dim hover:text-amber-bright transition-colors no-underline">Home</Link>
                <Link to="/register" className="text-[0.92rem] text-gold-dim hover:text-amber-bright transition-colors no-underline">Get access</Link>
              </>
            )}
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="text-[0.7rem] uppercase tracking-[0.22em] text-gold-faint mb-2">Company</span>
            <Link to="/contact" className="text-[0.92rem] text-gold-dim hover:text-amber-bright transition-colors no-underline">Contact</Link>
            <Link to="/" className="text-[0.92rem] text-gold-dim hover:text-amber-bright transition-colors no-underline">Home</Link>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="text-[0.7rem] uppercase tracking-[0.22em] text-gold-faint mb-2">Connect</span>
            <Link to="/contact" className="text-[0.92rem] text-gold-dim hover:text-amber-bright transition-colors no-underline">Get support</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto flex items-center gap-3 border-t border-line-soft pt-7 text-[0.78rem] text-gold-faint w-[min(var(--maxw),100%-(var(--gutter)*2))]">
        <span>© {new Date().getFullYear()} TerraVault</span>
        <span className="text-amber">·</span>
        <span>Your data, yours.</span>
      </div>
    </footer>
  )
}
