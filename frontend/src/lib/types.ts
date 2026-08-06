export type PropertyCategory =
  | 'Agricultural Land'
  | 'Residential Plot'
  | 'Commercial Property'
  | 'Open Land'
  | 'Farm'
  | 'Industrial Land'
  | 'Other'

export type OwnershipType =
  | 'Purchased'
  | 'Inherited'
  | 'Gifted'
  | 'Trust'
  | 'Court Transfer'

export type DocumentType =
  | 'Ownership Deed'
  | 'Inheritance Document'
  | 'Will'
  | 'Trust Document'
  | 'Survey Map'
  | 'Property Tax Receipt'
  | 'Chain of Ownership'
  | 'Court Order'
  | 'Other'

export interface VaultDocument {
  id: string
  name: string
  type: DocumentType
  uploadedAt: string // ISO date
  size: string // human-readable, e.g. "2.4 MB"
}

export interface Visit {
  id: string
  date: string // ISO date
  note: string
  latitude: number
  longitude: number
}

export interface Property {
  id: string
  name: string
  category: PropertyCategory
  ownership: OwnershipType
  purchaseDate?: string
  purchasePrice?: number
  area: number
  areaUnit: 'acres' | 'hectares' | 'sqft' | 'sqm' | 'guntha' | 'bigha'
  marketValue?: number
  previousOwner?: string
  notes?: string
  latitude: number
  longitude: number
  createdAt: string
  documents: VaultDocument[]
  visits: Visit[]
  cover?: string
}

export interface UserProfile {
  name: string
  email: string
  initials: string
  joinedAt: string
  plan: 'Free' | 'Pro'
}

export interface AppUser extends UserProfile {
  password: string
}

export interface DriveConnection {
  connected: boolean
  email?: string
  folderName: string
  usedBytes: number
  quotaBytes: number
  connectedAt?: string
}
