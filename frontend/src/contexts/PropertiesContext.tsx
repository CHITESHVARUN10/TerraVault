import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Property } from '../lib/types'
import * as propertyService from '../services/property.service'
import * as driveService from '../services/drive.service'
import type { PropertyInput } from '../services/property.service'

/**
 * Properties context — owns the current user's property list and every
 * mutation. Pages never call axios; they call these actions and the
 * context keeps local state in sync from API responses.
 */
interface PropertiesContextShape {
  properties: Property[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  create: (input: PropertyInput) => Promise<Property>
  update: (id: string, patch: Partial<PropertyInput>) => Promise<Property>
  remove: (id: string) => Promise<void>
  addDocument: (propertyId: string, doc: { name: string; type: string; size?: string }) => Promise<Property>
  removeDocument: (propertyId: string, docId: string) => Promise<Property>
  addVisit: (
    propertyId: string,
    visit: { date: string; note?: string; latitude: number; longitude: number },
  ) => Promise<Property>
  removeVisit: (propertyId: string, visitId: string) => Promise<Property>
  /** Upload a real file to Drive and attach it to the property. */
  uploadDocument: (propertyId: string, file: File, type: string) => Promise<Property>
}

const PropertiesContext = createContext<PropertiesContextShape | null>(null)

export function PropertiesProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await propertyService.listProperties()
      setProperties(list)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load properties.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const create = useCallback(async (input: PropertyInput) => {
    const p = await propertyService.createProperty(input)
    setProperties((prev) => [p, ...prev])
    return p
  }, [])

  const update = useCallback(async (id: string, patch: Partial<PropertyInput>) => {
    const p = await propertyService.updateProperty(id, patch)
    setProperties((prev) => prev.map((x) => (x.id === id ? p : x)))
    return p
  }, [])

  const remove = useCallback(async (id: string) => {
    await propertyService.deleteProperty(id)
    setProperties((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const addDocument = useCallback(
    async (propertyId: string, doc: { name: string; type: string; size?: string }) => {
      const p = await propertyService.addDocument(propertyId, doc)
      setProperties((prev) => prev.map((x) => (x.id === propertyId ? p : x)))
      return p
    },
    [],
  )

  const removeDocument = useCallback(async (propertyId: string, docId: string) => {
    const p = await propertyService.removeDocument(propertyId, docId)
    setProperties((prev) => prev.map((x) => (x.id === propertyId ? p : x)))
    return p
  }, [])

  const addVisit = useCallback(
    async (propertyId: string, visit: { date: string; note?: string; latitude: number; longitude: number }) => {
      const p = await propertyService.addVisit(propertyId, visit)
      setProperties((prev) => prev.map((x) => (x.id === propertyId ? p : x)))
      return p
    },
    [],
  )

  const removeVisit = useCallback(async (propertyId: string, visitId: string) => {
    const p = await propertyService.removeVisit(propertyId, visitId)
    setProperties((prev) => prev.map((x) => (x.id === propertyId ? p : x)))
    return p
  }, [])

  const uploadDocument = useCallback(async (propertyId: string, file: File, type: string) => {
    await driveService.uploadDocument(propertyId, file, type)
    // Re-fetch the property so the returned Drive file id shows up.
    const p = await propertyService.getProperty(propertyId)
    setProperties((prev) => prev.map((x) => (x.id === propertyId ? p : x)))
    return p
  }, [])

  return (
    <PropertiesContext.Provider
      value={{
        properties,
        loading,
        error,
        refresh,
        create,
        update,
        remove,
        addDocument,
        removeDocument,
        addVisit,
        removeVisit,
        uploadDocument,
      }}
    >
      {children}
    </PropertiesContext.Provider>
  )
}

export function useProperties(): PropertiesContextShape {
  const ctx = useContext(PropertiesContext)
  if (!ctx) throw new Error('useProperties must be used inside <PropertiesProvider>')
  return ctx
}
