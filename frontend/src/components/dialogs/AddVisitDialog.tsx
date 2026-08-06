import { useState } from 'react'
import Dialog from '../ui/Dialog'
import { Button } from '../ui/Button'
import { Field, TextInput, TextArea } from '../ui/Field'
import { useStore } from '../../lib/store'

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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Log a visit"
      eyebrow="Journal · New entry"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>Log visit</Button>
        </>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-5">
        <Field label="Date" required>
          <TextInput type="date" value={form.date} onChange={set('date')} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Latitude" required>
            <TextInput value={form.latitude} onChange={set('latitude')} inputMode="decimal" />
          </Field>
          <Field label="Longitude" required>
            <TextInput value={form.longitude} onChange={set('longitude')} inputMode="decimal" />
          </Field>
        </div>

        <Field label="Notes" hint="What did you see?">
          <TextArea
            value={form.note}
            onChange={set('note')}
            placeholder="Boundary intact, new fence along the east side…"
          />
        </Field>

        <p className="text-[0.7rem] text-gold-faint leading-relaxed">
          A visit creates a permanent, timestamped record. Photos are captured on
          mobile — standing, north, east, south, west.
        </p>

        {error && <p className="text-[0.82rem] text-amber-bright">{error}</p>}
      </form>
    </Dialog>
  )
}
