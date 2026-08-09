import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { UserProfile } from '../lib/types'
import * as authService from '../services/auth.service'
import { errorMessage } from '../lib/api'

/**
 * Auth context — the single place pages reach for the current user and
 * auth actions. All HTTP goes through services/auth.service (axios).
 */
interface AuthContextShape {
  /** Current session user, or null when logged out. */
  user: UserProfile | null
  /** True while restoring the session from the cookie on first load. */
  initializing: boolean
  register: (name: string, email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  /** Re-fetch the profile (e.g. after plan change). */
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextShape | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [initializing, setInitializing] = useState(true)

  // Restore the session: if a connect.sid cookie exists, /me returns the user.
  useEffect(() => {
    let cancelled = false
    authService
      .me()
      .then((u) => {
        if (!cancelled) setUser(u)
      })
      .catch(() => {
        if (!cancelled) setUser(null)
      })
      .finally(() => {
        if (!cancelled) setInitializing(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const u = await authService.register({ name, email, password })
    setUser(u)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const u = await authService.login(email, password)
    setUser(u)
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    const u = await authService.me()
    setUser(u)
  }, [])

  return (
    <AuthContext.Provider value={{ user, initializing, register, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextShape {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

export { errorMessage }
