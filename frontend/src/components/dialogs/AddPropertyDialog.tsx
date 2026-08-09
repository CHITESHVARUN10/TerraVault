import { useState } from 'react'
import Dialog from '../ui/Dialog'
import { UnderlineSelect } from '../ui/Field'
import { useProperties } from '../../contexts'
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

/**
 * Add property — matches stitch_screens/09_add_property_dialog.html:
 * Registry eyebrow, underline inputs, area + unit, ₹ values,
 * coordinates panel with topo texture, Save Record footer.
 */
export default function AddPropertyDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { create } = useProperties()
  const [form, setForm] = useState({
    name: '',
    category: '' as PropertyCategory | '',
    ownership: '' as OwnershipType | '',
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
  const [saving, setSaving] = useState(false)

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }))
      setError('')
    }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (saving) return
    const name = form.name.trim()
    if (!name) return setError('Give this property a name — e.g. "Village Property".')
    const area = parseFloat(form.area)
    if (!area || area <= 0) return setError('Enter a valid area.')
    const lat = parseFloat(form.latitude)
    const lng = parseFloat(form.longitude)
    if (Number.isNaN(lat) || Number.isNaN(lng))
      return setError('Enter GPS coordinates so your property stays findable.')

    setSaving(true)
    setError('')
    try {
      await create({
        name,
        category: (form.category || 'Other') as PropertyCategory,
        ownership: (form.ownership || 'Purchased') as OwnershipType,
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
        category: '',
        ownership: '',
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save the property.')
    } finally {
      setSaving(false)
    }
  }

  const underline =
    'w-full bg-transparent border-0 border-b border-line-soft text-on-surface font-body-md text-[1rem] py-2 px-0 focus:outline-none focus:border-amber transition-colors placeholder:text-outline-variant'

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Add Property"
      eyebrow="Registry"
      wide
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-line text-amber text-[0.78rem] font-semibold uppercase tracking-[0.1em] hover:bg-ink-card hover:text-gold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="btn-lift px-8 py-3 bg-gold text-ink text-[0.78rem] font-semibold uppercase tracking-[0.1em] hover:bg-primary transition-colors cursor-pointer disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Record'}
          </button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-8">
        {/* Row 1: Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2">
            <label className="block text-[0.68rem] uppercase tracking-[0.18em] text-on-surface-variant mb-3 font-semibold" htmlFor="propertyName">
              Name *
            </label>
            <input
              id="propertyName"
              value={form.name}
              onChange={set('name')}
              placeholder="e.g. Northern Sector Estate"
              className={underline}
              autoFocus
            />
          </div>
        </div>

        {/* Row 2: Category & Ownership */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-[0.68rem] uppercase tracking-[0.18em] text-on-surface-variant mb-3 font-semibold" htmlFor="propertyCategory">
              Category
            </label>
            <UnderlineSelect id="propertyCategory" value={form.category} onChange={set('category')}>
              <option value="" disabled className="bg-surface-container text-outline">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-surface-container text-on-surface">{c}</option>
              ))}
            </UnderlineSelect>
          </div>
          <div>
            <label className="block text-[0.68rem] uppercase tracking-[0.18em] text-on-surface-variant mb-3 font-semibold" htmlFor="propertyOwnership">
              Ownership
            </label>
            <UnderlineSelect id="propertyOwnership" value={form.ownership} onChange={set('ownership')}>
              <option value="" disabled className="bg-surface-container text-outline">Select ownership type</option>
              {OWNERSHIPS.map((o) => (
                <option key={o} value={o} className="bg-surface-container text-on-surface">{o}</option>
              ))}
            </UnderlineSelect>
          </div>
        </div>

        {/* Row 3: Area/Unit & Purchase Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex gap-4 items-end">
            <div className="flex-grow">
              <label className="block text-[0.68rem] uppercase tracking-[0.18em] text-on-surface-variant mb-3 font-semibold" htmlFor="propertyArea">
                Area *
              </label>
              <input
                id="propertyArea"
                type="number"
                min="0"
                step="any"
                value={form.area}
                onChange={set('area')}
                placeholder="0.00"
                className={underline}
              />
            </div>
            <div className="w-1/3">
              <label className="sr-only" htmlFor="areaUnit">Area Unit</label>
              <UnderlineSelect id="areaUnit" value={form.areaUnit} onChange={set('areaUnit')} className="text-amber">
                {AREA_UNITS.map((u) => (
                  <option key={u} value={u} className="bg-surface-container text-on-surface">{u}</option>
                ))}
              </UnderlineSelect>
            </div>
          </div>
          <div>
            <label className="block text-[0.68rem] uppercase tracking-[0.18em] text-on-surface-variant mb-3 font-semibold" htmlFor="purchaseDate">
              Purchase Date
            </label>
            <input
              id="purchaseDate"
              type="date"
              value={form.purchaseDate}
              onChange={set('purchaseDate')}
              className={`${underline} [color-scheme:dark]`}
            />
          </div>
        </div>

        {/* Row 4: Values & Previous Owner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <label className="block text-[0.68rem] uppercase tracking-[0.18em] text-on-surface-variant mb-3 font-semibold" htmlFor="purchasePrice">
              Purchase Price (₹)
            </label>
            <input
              id="purchasePrice"
              type="number"
              min="0"
              step="0.01"
              value={form.purchasePrice}
              onChange={set('purchasePrice')}
              placeholder="0.00"
              className={underline}
            />
          </div>
          <div>
            <label className="block text-[0.68rem] uppercase tracking-[0.18em] text-on-surface-variant mb-3 font-semibold" htmlFor="marketValue">
              Market Value (₹)
            </label>
            <input
              id="marketValue"
              type="number"
              min="0"
              step="0.01"
              value={form.marketValue}
              onChange={set('marketValue')}
              placeholder="0.00"
              className={underline}
            />
          </div>
          <div>
            <label className="block text-[0.68rem] uppercase tracking-[0.18em] text-on-surface-variant mb-3 font-semibold" htmlFor="previousOwner">
              Previous Owner
            </label>
            <input
              id="previousOwner"
              value={form.previousOwner}
              onChange={set('previousOwner')}
              placeholder="Entity Name"
              className={underline}
            />
          </div>
        </div>

        {/* Row 5: Coordinates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-paper p-4 border border-line-soft rounded-[2px] relative">
          <div className="absolute inset-0 pointer-events-none opacity-10 topo-bg" aria-hidden="true" />
          <div className="relative z-10">
            <label className="flex justify-between items-center mb-3" htmlFor="latitude">
              <span className="text-[0.68rem] uppercase tracking-[0.18em] text-on-surface-variant font-semibold">Latitude *</span>
              <span className="text-error text-xs">Coordinate precision required</span>
            </label>
            <input
              id="latitude"
              value={form.latitude}
              onChange={set('latitude')}
              placeholder="e.g. 40.7128"
              className="w-full bg-transparent border-0 border-b border-error text-on-surface font-body-md text-[1rem] py-2 px-0 focus:outline-none focus:border-amber placeholder:text-outline-variant"
            />
          </div>
          <div className="relative z-10">
            <label className="block text-[0.68rem] uppercase tracking-[0.18em] text-on-surface-variant mb-3 font-semibold" htmlFor="longitude">
              Longitude *
            </label>
            <input
              id="longitude"
              value={form.longitude}
              onChange={set('longitude')}
              placeholder="e.g. -74.0060"
              className="w-full bg-transparent border-0 border-b border-line-soft text-on-surface font-body-md text-[1rem] py-2 px-0 focus:outline-none focus:border-amber placeholder:text-outline-variant"
            />
          </div>
        </div>

        {/* Row 6: Notes */}
        <div>
          <label className="block text-[0.68rem] uppercase tracking-[0.18em] text-on-surface-variant mb-3 font-semibold" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            value={form.notes}
            onChange={set('notes')}
            placeholder="Append historical context or boundary observations here..."
            className="w-full bg-transparent border border-line-soft rounded-[2px] text-on-surface font-body-md text-[1rem] p-3 focus:outline-none focus:border-amber transition-colors resize-y placeholder:text-outline-variant"
          />
        </div>

        {error && <p className="text-error text-[0.85rem] border-l-2 border-error pl-2">{error}</p>}
      </form>
    </Dialog>
  )
}
