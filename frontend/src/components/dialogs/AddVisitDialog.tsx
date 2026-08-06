import { useState } from 'react'
import Dialog from '../ui/Dialog'
import { useStore } from '../../lib/store'
import { IconCalendarToday, IconInfo } from '../icons'

/**
 * Log visit — matches stitch_screens/11_log_visit.html:
 * PHYSICAL PROTOCOL eyebrow, date field with calendar icon,
 * lat/lng inputs, notes, info box about 5 directional photos,
 * Cancel + "Save log".
 */
export default function AddVisitDialog({
  open,
  onClose,
  propertyId,
  defaultLat,
  defaultLng,
}: {
  open: boolean
  onClose: () => void
  propertyId: string
  defaultLat: number
  defaultLng: number
}) {
  const { addVisit } = useStore()
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    latitude: String(defaultLat),
    longitude: String(defaultLng),
    note: '',
  })
  const [error, setError] = useState('')

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }))
      setError('')
    }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const lat = parseFloat(form.latitude)
    const lng = parseFloat(form.longitude)
    if (Number.isNaN(lat) || Number.isNaN(lng))
      return setError('Enter valid GPS coordinates for this visit.')
    addVisit(propertyId, {
      date: form.date,
      note: form.note.trim() || 'Site visit',
      latitude: lat,
      longitude: lng,
    })
    setForm({ date: new Date().toISOString().slice(0, 10), latitude: String(defaultLat), longitude: String(defaultLng), note: '' })
    onClose()
  }

  const fieldBox =
    'w-full bg-surface-container-low border border-line rounded-[2px] py-3 px-4 text-on-surface font-body-md text-[0.95rem] focus:border-amber focus:ring-1 focus:ring-amber outline-none transition-all placeholder:text-outline'

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Log Visit"
      eyebrow="Physical protocol"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-[0.8rem] font-semibold text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            className="btn-lift px-6 py-2.5 text-[0.8rem] font-semibold bg-gold text-ink hover:bg-primary transition-colors rounded-[2px] shadow-[0_0_15px_rgba(232,200,119,0.1)] cursor-pointer"
          >
            Save log
          </button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-6">
        {/* Date */}
        <div className="space-y-2">
          <label className="block text-[0.8rem] text-on-surface-variant" htmlFor="visit-date">Date</label>
          <div className="relative">
            <input
              id="visit-date"
              type="text"
              readOnly
              value={new Date(form.date + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              className={`${fieldBox} cursor-default`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-outline">
              <IconCalendarToday size={18} />
            </span>
          </div>
        </div>

        {/* Coordinates */}
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <label className="block text-[0.8rem] text-on-surface-variant" htmlFor="lat">Latitude</label>
            <input id="lat" type="text" value={form.latitude} onChange={set('latitude')} className={fieldBox} />
          </div>
          <div className="flex-1 space-y-2">
            <label className="block text-[0.8rem] text-on-surface-variant" htmlFor="lng">Longitude</label>
            <input id="lng" type="text" value={form.longitude} onChange={set('longitude')} className={fieldBox} />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="block text-[0.8rem] text-on-surface-variant" htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            rows={4}
            value={form.note}
            onChange={set('note')}
            placeholder="Enter observational notes..."
            className={`${fieldBox} resize-none`}
          />
        </div>

        {/* Helper */}
        <div className="flex items-start gap-3 bg-surface-container-low/50 border border-amber/20 p-4 rounded-[2px]">
          <IconInfo size={20} className="text-amber mt-0.5" />
          <p className="text-[0.85rem] text-amber/90 leading-relaxed">
            5 directional photos (standing, north, east, south, west) will be captured for this visit.
          </p>
        </div>

        {error && <p className="text-error text-[0.85rem]">{error}</p>}
      </form>
    </Dialog>
  )
}
