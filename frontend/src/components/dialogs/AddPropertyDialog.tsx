import { useState } from 'react'
import Dialog from '../ui/Dialog'
import { Button } from '../ui/Button'
import { Field, TextInput, Select, TextArea } from '../ui/Field'
import { useStore } from '../../lib/store'
import type { PropertyCategory, OwnershipType } from '../../lib/types'

const CATEGORIES: PropertyCategory[] = [
  'Agricultural Land',
  'Residential Plot',
  'Commercial Property',
  'Open Land',
  'Farm',
  'Industrial Land',
  'Other',
]

const OWNERSHIPS: OwnershipType[] = ['Purchased', 'Inherited', 'Gifted', 'Trust', 'Court Transfer']

const AREA_UNITS = ['acres', 'hectares', 'sqft', 'sqm', 'guntha', 'bigha'] as const

export default function AddPropertyDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { addProperty } = useStore()
  const [form, setForm] = useState({
    name: '',
    category: 'Agricultural Land' as PropertyCategory,
    ownership: 'Purchased' as OwnershipType,
    area: '',
    areaUnit: 'acres' as (typeof AREA_UNITS)[number],
    purchaseDate: '',
    purchasePrice: '',
    marketValue: '',
    previousOwner: '',
    latitude: '',
    longitude: '',
    notes: '',
  })
  const [error, setError] = useState('')

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setError('')
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const name = form.name.trim()
    if (!name) return setError('Give this property a name — e.g. "Village Property".')
    const area = parseFloat(form.area)
    if (!area || area <= 0) return setError('Enter a valid area.')
    const lat = parseFloat(form.latitude)
    const lng = parseFloat(form.longitude)
    if (Number.isNaN(lat) || Number.isNaN(lng)) return setError('Enter GPS coordinates so your property stays findable.')

    addProperty({
      name,
      category: form.category,
      ownership: form.ownership,
      area,
      areaUnit: form.areaUnit,
      purchaseDate: form.purchaseDate || undefined,
      purchasePrice: form.purchasePrice ? parseFloat(form.purchasePrice) : undefined,
      marketValue: form.marketValue ? parseFloat(form.marketValue) : undefined,
      previousOwner: form.previousOwner.trim() || undefined,
      notes: form.notes.trim() || undefined,
      latitude: lat,
      longitude: lng,
    })
    setForm({
      name: '',
      category: 'Agricultural Land',
      ownership: 'Purchased',
      area: '',
      areaUnit: 'acres',
      purchaseDate: '',
      purchasePrice: '',
      marketValue: '',
      previousOwner: '',
      latitude: '',
      longitude: '',
      notes: '',
    })
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Register a property"
      eyebrow="New record"
      wide
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>Register property</Button>
        </>
      }
    >
      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
        <div className="sm:col-span-2">
          <Field label="Property name" required>
            <TextInput
              value={form.name}
              onChange={set('name')}
              placeholder="e.g. Village Property"
              autoFocus
            />
          </Field>
        </div>

        <Field label="Category">
          <Select value={form.category} onChange={set('category')}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </Field>

        <Field label="Ownership type">
          <Select value={form.ownership} onChange={set('ownership')}>
            {OWNERSHIPS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </Select>
        </Field>

        <Field label="Total area" required>
          <TextInput
            value={form.area}
            onChange={set('area')}
            placeholder="2.5"
            inputMode="decimal"
          />
        </Field>

        <Field label="Area unit">
          <Select value={form.areaUnit} onChange={set('areaUnit')}>
            {AREA_UNITS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </Select>
        </Field>

        <Field label="Purchase date">
          <TextInput type="date" value={form.purchaseDate} onChange={set('purchaseDate')} />
        </Field>

        <Field label="Purchase price (₹)">
          <TextInput
            value={form.purchasePrice}
            onChange={set('purchasePrice')}
            placeholder="620000"
            inputMode="numeric"
          />
        </Field>

        <Field label="Est. current market value (₹)">
          <TextInput
            value={form.marketValue}
            onChange={set('marketValue')}
            placeholder="980000"
            inputMode="numeric"
          />
        </Field>

        <Field label="Previous owner">
          <TextInput
            value={form.previousOwner}
            onChange={set('previousOwner')}
            placeholder="Optional"
          />
        </Field>

        <Field label="Latitude" required>
          <TextInput
            value={form.latitude}
            onChange={set('latitude')}
            placeholder="27.1767"
            inputMode="decimal"
          />
        </Field>

        <Field label="Longitude" required>
          <TextInput
            value={form.longitude}
            onChange={set('longitude')}
            placeholder="78.0081"
            inputMode="decimal"
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Personal notes" hint="Private — stays in your vault">
            <TextArea value={form.notes} onChange={set('notes')} placeholder="Boundary markers, wells, trees…" />
          </Field>
        </div>

        {error && (
          <p className="sm:col-span-2 text-[0.82rem] text-amber-bright">{error}</p>
        )}
      </form>
    </Dialog>
  )
}
