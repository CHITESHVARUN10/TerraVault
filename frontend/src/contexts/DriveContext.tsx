import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { DriveConnection } from '../lib/types'
import * as driveService from '../services/drive.service'

/**
 * Drive context — the user's Google Drive connection state and actions.
 * Pages never call axios; connect() starts the OAuth flow (full-page
 * redirect), disconnect() forgets the stored tokens.
 */
interface DriveContextShape {
  drive: DriveConnection
  loading: boolean
  refresh: () => Promise<void>
  /** Start Google OAuth. `state` is the frontend route to return to. */
  connect: (state?: string) => void
  disconnect: () => Promise<void>
  uploadDocument: (propertyId: string, file: File, type: string) => Promise<void>
}

const DriveContext = createContext<DriveContextShape | null>(null)

const DEFAULT_DRIVE: DriveConnection = {
  connected: false,
  folderName: 'Property Vault',
  usedBytes: 0,
  quotaBytes: 15 * 1024 ** 3,
}

export function DriveProvider({ children }: { children: ReactNode }) {
  const [drive, setDrive] = useState<DriveConnection>(DEFAULT_DRIVE)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const status = await driveService.getDriveStatus()
      setDrive(status)
    } catch {
      // Not connected or server unreachable — keep default state.
      setDrive(DEFAULT_DRIVE)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const connect = useCallback((state?: string) => {
    // Full-page redirect to the backend, which redirects to Google consent.
    // On success Google bounces back to the callback → frontend route.
    const target = state ? `?state=${encodeURIComponent(state)}` : ''
    window.location.href = `/api/drive/connect${target}`
  }, [])

  const disconnect = useCallback(async () => {
    await driveService.disconnectDrive()
    setDrive(DEFAULT_DRIVE)
  }, [])

  const uploadDocument = useCallback(async (propertyId: string, file: File, type: string) => {
    await driveService.uploadDocument(propertyId, file, type)
  }, [])

  return (
    <DriveContext.Provider value={{ drive, loading, refresh, connect, disconnect, uploadDocument }}>
      {children}
    </DriveContext.Provider>
  )
}

export function useDrive(): DriveContextShape {
  const ctx = useContext(DriveContext)
  if (!ctx) throw new Error('useDrive must be used inside <DriveProvider>')
  return ctx
}
