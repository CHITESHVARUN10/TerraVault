import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type {
  AppUser,
  DriveConnection,
  Property,
  UserProfile,
} from './types'

/**
 * Mock data layer for the frontend prototype.
 * Persists everything to localStorage so the app behaves like a real
 * backend: register/login, properties CRUD, documents, visits, drive.
 * Swap this module for real API calls when the backend lands.
 */

const KEYS = {
  users: 'terravault.users',
  session: 'terravault.session',
  drive: 'terravault.drive',
}

/** Per-account vault key, e.g. terravault.vault.owner@example.com */
const vaultKey = (email: string) => `terravault.vault.${email.toLowerCase()}`

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

const SAMPLE_DOCUMENTS = [
  { id: uid(), name: 'Ownership_Deed_2004.pdf', type: 'Ownership Deed', uploadedAt: '2024-03-12', size: '2.4 MB' },
  { id: uid(), name: 'Survey_Map_v2.pdf', type: 'Survey Map', uploadedAt: '2024-03-12', size: '8.1 MB' },
  { id: uid(), name: 'Tax_Receipt_2025.pdf', type: 'Property Tax Receipt', uploadedAt: '2025-01-20', size: '0.8 MB' },
] as const

/** Build a fresh demo vault (deep copy, new ids) for a new account. */
function seedVault(): Property[] {
  return SEED_PROPERTIES.map((p) => ({
    ...p,
    id: uid(),
    documents: p.documents.map((d) => ({ ...d, id: uid() })),
    visits: p.visits.map((v) => ({ ...v, id: uid() })),
  }))
}

const SEED_PROPERTIES: Property[] = [
  {
    id: 'p-village',
    name: 'Village Property',
    category: 'Agricultural Land',
    ownership: 'Inherited',
    purchaseDate: '1998-04-02',
    area: 2.5,
    areaUnit: 'acres',
    marketValue: 1450000,
    previousOwner: 'Mohan Lal (grandfather)',
    notes: 'Family land, mango trees along the eastern boundary. The old well still holds water in monsoon season.',
    latitude: 27.1767,
    longitude: 78.0081,
    createdAt: '2024-03-12',
    documents: [
      { ...SAMPLE_DOCUMENTS[0], id: uid() },
      { ...SAMPLE_DOCUMENTS[1], id: uid() },
    ],
    visits: [
      { id: uid(), date: '2024-03-15', note: 'First survey after the deed was digitised. Boundaries match the map.', latitude: 27.1767, longitude: 78.0081 },
      { id: uid(), date: '2025-01-25', note: 'Winter visit — cleared brush along the north fence. GPS logged at the well.', latitude: 27.1772, longitude: 78.0089 },
    ],
  },
  {
    id: 'p-riverside',
    name: 'Riverside Plot',
    category: 'Residential Plot',
    ownership: 'Purchased',
    purchaseDate: '2019-11-08',
    purchasePrice: 620000,
    area: 240,
    areaUnit: 'sqm',
    marketValue: 980000,
    previousOwner: 'Suresh Agarwal',
    notes: 'Corner plot by the old bridge. Foundation survey complete; considering a small house.',
    latitude: 27.4916,
    longitude: 77.6736,
    createdAt: '2024-06-01',
    documents: [
      { ...SAMPLE_DOCUMENTS[2], id: uid() },
    ],
    visits: [
      { id: uid(), date: '2024-11-30', note: 'Sunset visit. The river level is low; the plot boundary stones are visible.', latitude: 27.4916, longitude: 77.6736 },
    ],
  },
  {
    id: 'p-hilltop',
    name: 'Hilltop Farm',
    category: 'Farm',
    ownership: 'Purchased',
    purchaseDate: '2021-02-14',
    purchasePrice: 2500000,
    area: 12,
    areaUnit: 'acres',
    marketValue: 3100000,
    previousOwner: 'Devi Singh Estate',
    notes: 'Runs sheep in the dry months. Access road is rough — needs a 4x4 after rain.',
    latitude: 26.9124,
    longitude: 75.7873,
    createdAt: '2024-09-18',
    documents: [],
    visits: [],
  },
]

export interface StoreShape {
  user: UserProfile | null
  properties: Property[]
  drive: DriveConnection
  register: (name: string, email: string, password: string) => { ok: boolean; error?: string }
  login: (email: string, password: string) => { ok: boolean; error?: string }
  logout: () => void
  connectDrive: () => void
  disconnectDrive: () => void
  addProperty: (p: Omit<Property, 'id' | 'createdAt' | 'documents' | 'visits'>) => Property
  updateProperty: (id: string, patch: Partial<Property>) => void
  deleteProperty: (id: string) => void
  addDocument: (propertyId: string, doc: Omit<VaultDocInput, 'propertyId'>) => void
  deleteDocument: (propertyId: string, docId: string) => void
  addVisit: (propertyId: string, visit: Omit<VisitInput, 'propertyId'>) => void
  deleteVisit: (propertyId: string, visitId: string) => void
}

// Local type aliases to keep the interface readable.
type VaultDocInput = {
  propertyId: string
  name: string
  type: string
  size: string
}
type VisitInput = {
  propertyId: string
  date: string
  note: string
  latitude: number
  longitude: number
}

const StoreContext = createContext<StoreShape | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AppUser[]>(() => read(KEYS.users, []))
  const [session, setSession] = useState<string | null>(() => read(KEYS.session, null))
  const [drive, setDrive] = useState<DriveConnection>(() =>
    read(KEYS.drive, {
      connected: false,
      folderName: 'TerraVault',
      usedBytes: 0,
      quotaBytes: 15 * 1024 ** 3,
    }),
  )

  useEffect(() => write(KEYS.users, users), [users])
  useEffect(() => write(KEYS.session, session), [session])
  useEffect(() => write(KEYS.drive, drive), [drive])

  const user = useMemo(
    () => users.find((u) => u.email === session) ?? null,
    [users, session],
  )

  /**
   * Per-account property vault, loaded from localStorage on login and
   * written back on every change. A fresh account starts with a seeded
   * demo vault so the dashboard isn't empty.
   */
  const [properties, setProperties] = useState<Property[]>(() => {
    const email = read<string | null>(KEYS.session, null)
    if (!email) return []
    const existing = read<Property[] | null>(vaultKey(email), null)
    return existing ?? seedVault()
  })

  const activeKey = user?.email ? vaultKey(user.email) : null
  useEffect(() => {
    if (!activeKey) {
      setProperties([])
      return
    }
    setProperties(read<Property[] | null>(activeKey, null) ?? seedVault())
  }, [activeKey])

  useEffect(() => {
    if (activeKey) write(activeKey, properties)
  }, [properties, activeKey])

  const register = useCallback(
    (name: string, email: string, password: string) => {
      const normalized = email.trim().toLowerCase()
      if (!name.trim()) return { ok: false, error: 'Please enter your full name.' }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized))
        return { ok: false, error: 'Please enter a valid email address.' }
      if (password.length < 6)
        return { ok: false, error: 'Password must be at least 6 characters.' }
      if (users.some((u) => u.email === normalized))
        return { ok: false, error: 'An account with this email already exists. Try signing in.' }

      const profile: AppUser = {
        name: name.trim(),
        email: normalized,
        password,
        initials: name
          .trim()
          .split(/\s+/)
          .map((w) => w[0])
          .slice(0, 2)
          .join('')
          .toUpperCase(),
        joinedAt: new Date().toISOString().slice(0, 10),
        plan: 'Free',
      }
      setUsers((prev) => [...prev, profile])
      setSession(normalized)
      return { ok: true }
    },
    [users],
  )

  const login = useCallback(
    (email: string, password: string) => {
      const normalized = email.trim().toLowerCase()
      const found = users.find((u) => u.email === normalized)
      if (!found) return { ok: false, error: 'No account found for this email.' }
      if (found.password !== password) return { ok: false, error: 'Incorrect password. Please try again.' }
      setSession(normalized)
      return { ok: true }
    },
    [users],
  )

  const logout = useCallback(() => setSession(null), [])

  const connectDrive = useCallback(() => {
    setDrive((d) => ({
      ...d,
      connected: true,
      email: user?.email ?? 'owner@gmail.com',
      folderName: 'TerraVault',
      connectedAt: new Date().toISOString(),
    }))
  }, [user])

  const disconnectDrive = useCallback(() => {
    setDrive((d) => ({ ...d, connected: false, email: undefined, connectedAt: undefined }))
  }, [])

  const addProperty: StoreShape['addProperty'] = useCallback((p) => {
    const property: Property = {
      ...p,
      id: uid(),
      createdAt: new Date().toISOString().slice(0, 10),
      documents: [],
      visits: [],
    }
    setProperties((prev) => [property, ...prev])
    return property
  }, [])

  const updateProperty: StoreShape['updateProperty'] = useCallback((id, patch) => {
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }, [])

  const deleteProperty: StoreShape['deleteProperty'] = useCallback((id) => {
    setProperties((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const addDocument: StoreShape['addDocument'] = useCallback((propertyId, doc) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? {
              ...p,
              documents: [
                { id: uid(), name: doc.name, type: doc.type as Property['documents'][number]['type'], uploadedAt: new Date().toISOString().slice(0, 10), size: doc.size },
                ...p.documents,
              ],
            }
          : p,
      ),
    )
  }, [])

  const deleteDocument: StoreShape['deleteDocument'] = useCallback((propertyId, docId) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId ? { ...p, documents: p.documents.filter((d) => d.id !== docId) } : p,
      ),
    )
  }, [])

  const addVisit: StoreShape['addVisit'] = useCallback((propertyId, visit) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, visits: [{ id: uid(), ...visit }, ...p.visits] }
          : p,
      ),
    )
  }, [])

  const deleteVisit: StoreShape['deleteVisit'] = useCallback((propertyId, visitId) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId ? { ...p, visits: p.visits.filter((v) => v.id !== visitId) } : p,
      ),
    )
  }, [])

  const value: StoreShape = {
    user,
    properties,
    drive,
    register,
    login,
    logout,
    connectDrive,
    disconnectDrive,
    addProperty,
    updateProperty,
    deleteProperty,
    addDocument,
    deleteDocument,
    addVisit,
    deleteVisit,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}
