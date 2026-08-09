import type { ReactNode } from 'react'
import { AuthProvider } from './AuthContext'
import { PropertiesProvider } from './PropertiesContext'
import { DriveProvider } from './DriveContext'

/**
 * Composes every entity context. App.tsx wraps the router in this single
 * provider — pages consume the individual hooks (useAuth, useProperties,
 * useDrive) and never touch axios or services directly.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <PropertiesProvider>
        <DriveProvider>{children}</DriveProvider>
      </PropertiesProvider>
    </AuthProvider>
  )
}

export { useAuth, errorMessage } from './AuthContext'
export { useProperties } from './PropertiesContext'
export { useDrive } from './DriveContext'
