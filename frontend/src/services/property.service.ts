import api from '../lib/api'
import type { Property } from '../lib/types'

/** Backend Property doc: _id + timestamps, no nested docs by default. */
export interface BackendProperty extends Omit<Property, 'id' | 'documents' | 'visits'> {
  _id: string
  owner: string
  createdAt: string
  updatedAt?: string
  documents: PropertyDocument[]
  visits: PropertyVisit[]
}

export interface PropertyDocument {
  _id: string
  name: string
  type: string
  uploadedAt: string
  size: string
  driveFileId?: string
}

export interface PropertyVisit {
  _id: string
  date: string
  note: string
  latitude: number
  longitude: number
}

export interface PropertyInput {
  name: string
  category: Property['category']
  ownership: Property['ownership']
  purchaseDate?: string
  purchasePrice?: number
  area: number
  areaUnit: Property['areaUnit']
  marketValue?: number
  previousOwner?: string
  notes?: string
  latitude: number
  longitude: number
}

/** Map a backend property doc into the frontend shape (id from _id). */
export function toProperty(p: BackendProperty): Property {
  return {
    id: p._id,
    name: p.name,
    category: p.category,
    ownership: p.ownership,
    purchaseDate: p.purchaseDate,
    purchasePrice: p.purchasePrice,
    area: p.area,
    areaUnit: p.areaUnit,
    marketValue: p.marketValue,
    previousOwner: p.previousOwner,
    notes: p.notes,
    latitude: p.latitude,
    longitude: p.longitude,
    createdAt: p.createdAt,
    documents: (p.documents ?? []).map((d) => ({
      id: d._id,
      name: d.name,
      type: d.type as Property['documents'][number]['type'],
      uploadedAt: d.uploadedAt,
      size: d.size,
    })),
    visits: (p.visits ?? []).map((v) => ({
      id: v._id,
      date: v.date,
      note: v.note,
      latitude: v.latitude,
      longitude: v.longitude,
    })),
  }
}

/** GET /api/properties — list the current user's properties. */
export async function listProperties(): Promise<Property[]> {
  const { data } = await api.get<{ properties: BackendProperty[] }>('/properties')
  return data.properties.map(toProperty)
}

/** POST /api/properties — create a property. */
export async function createProperty(input: PropertyInput): Promise<Property> {
  const { data } = await api.post<{ property: BackendProperty }>('/properties', input)
  return toProperty(data.property)
}

/** GET /api/properties/:id — fetch one property. */
export async function getProperty(id: string): Promise<Property> {
  const { data } = await api.get<{ property: BackendProperty }>(`/properties/${id}`)
  return toProperty(data.property)
}

/** PATCH /api/properties/:id — partial update. */
export async function updateProperty(
  id: string,
  patch: Partial<PropertyInput>,
): Promise<Property> {
  const { data } = await api.patch<{ property: BackendProperty }>(`/properties/${id}`, patch)
  return toProperty(data.property)
}

/** DELETE /api/properties/:id — remove a property. */
export async function deleteProperty(id: string): Promise<void> {
  await api.delete(`/properties/${id}`)
}

/** POST /api/properties/:id/documents — add a document record. */
export async function addDocument(
  propertyId: string,
  doc: { name: string; type: string; size?: string },
): Promise<Property> {
  const { data } = await api.post<{ property: BackendProperty }>(
    `/properties/${propertyId}/documents`,
    doc,
  )
  return toProperty(data.property)
}

/** DELETE /api/properties/:id/documents/:docId — remove a document. */
export async function removeDocument(propertyId: string, docId: string): Promise<Property> {
  const { data } = await api.delete<{ property: BackendProperty }>(
    `/properties/${propertyId}/documents/${docId}`,
  )
  return toProperty(data.property)
}

/** POST /api/properties/:id/visits — log a visit. */
export async function addVisit(
  propertyId: string,
  visit: { date: string; note?: string; latitude: number; longitude: number },
): Promise<Property> {
  const { data } = await api.post<{ property: BackendProperty }>(
    `/properties/${propertyId}/visits`,
    visit,
  )
  return toProperty(data.property)
}

/** DELETE /api/properties/:id/visits/:visitId — remove a visit. */
export async function removeVisit(propertyId: string, visitId: string): Promise<Property> {
  const { data } = await api.delete<{ property: BackendProperty }>(
    `/properties/${propertyId}/visits/${visitId}`,
  )
  return toProperty(data.property)
}
