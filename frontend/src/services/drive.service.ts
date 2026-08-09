import api from '../lib/api'
import type { DriveConnection } from '../lib/types'

/** Backend drive status shape. */
export interface DriveStatus {
  connected: boolean
  email?: string
  folderName?: string
  connectedAt?: string
}

/** Map backend status into the frontend DriveConnection shape. */
export function toDriveConnection(status: DriveStatus): DriveConnection {
  return {
    connected: status.connected,
    email: status.email,
    folderName: status.folderName ?? 'Property Vault',
    usedBytes: 0,
    quotaBytes: 15 * 1024 ** 3, // 15 GB default until Drive quota API is wired
    connectedAt: status.connectedAt,
  }
}

/** GET /api/drive/status — current connection state. */
export async function getDriveStatus(): Promise<DriveConnection> {
  const { data } = await api.get<DriveStatus>('/drive/status')
  return toDriveConnection(data)
}

/** POST /api/drive/disconnect — forget the stored connection. */
export async function disconnectDrive(): Promise<void> {
  await api.post('/drive/disconnect')
}

/** POST /api/drive/properties/:id/documents/upload — multipart file → Drive. */
export async function uploadDocument(
  propertyId: string,
  file: File,
  type: string,
): Promise<{ document: { id: string; name: string; type: string; size: string; url?: string } }> {
  const form = new FormData()
  form.append('file', file)
  form.append('type', type)
  const { data } = await api.post<{
    document: { id: string; name: string; type: string; size: string; url?: string }
  }>(`/drive/properties/${propertyId}/documents/upload`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
