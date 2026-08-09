import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import { useAuth } from '../contexts'

/**
 * Route guard: signed-in users only. Redirects to /login with a
 * return path so users land back where they were after signing in.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, initializing } = useAuth()
  const location = useLocation()
  if (initializing) return null
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <>{children}</>
}

/**
 * App shell shared by every non-landing page: nav + routed content + footer.
 */
export function AppShell() {
  return (
    <div className="min-h-screen bg-ink text-gold">
      <Nav />
      <Outlet />
      <Footer />
    </div>
  )
}
