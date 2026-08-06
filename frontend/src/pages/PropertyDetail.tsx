import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../lib/store'
import { PageFrame, EmptyState } from '../components/ui/PageFrame'
import { Button } from '../components/ui/Button'
import AddDocumentDialog from '../components/dialogs/AddDocumentDialog'
import AddVisitDialog from '../components/dialogs/AddVisitDialog'
import ConfirmDialog from '../components/dialogs/ConfirmDialog'
import { formatArea, formatCoords, formatCurrency, formatDate } from '../lib/format'
import type { Property } from '../lib/types'

/**
 * Property detail — the full record: metadata plate, documents,
 * visit journal, and a simple map preview.
 */
export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { properties, deleteProperty, deleteDocument, deleteVisit } = useStore()
  const [docOpen, setDocOpen] = useState(false)
  const [visitOpen, setVisitOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const property = properties.find((p) => p.id === id)

  if (!property) {
    return (
      <PageFrame>
        <EmptyState
          title="Record not found"
          body="This property doesn't exist or was deleted from your vault."
          action={
            <Link to="/properties">
              <Button variant="ghost">Back to properties</Button>
            </Link>
          }
        />
      </PageFrame>
    )
  }

  return (
    <PageFrame>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.16em] text-gold-faint mb-8">
        <Link to="/properties" className="hover:text-amber no-underline">Properties</Link>
        <span className="text-amber">/</span>
        <span className="text-gold-dim">{property.name}</span>
      </div>

      {/* Title row */}
      <div className="flex flex-wrap items-start justify-between gap-6 mb-10">
        <div>
          <p className="text-[0.66rem] uppercase tracking-[0.28em] text-amber mb-3">{property.category}</p>
          <h1 className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.05] text-gold">{property.name}</h1>
          <p className="mt-3 text-[0.9rem] text-gold-dim">
            {property.ownership} · Registered {formatDate(property.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => setDocOpen(true)}>+ Document</Button>
          <Button variant="ghost" onClick={() => setVisitOpen(true)}>+ Log visit</Button>
          <Button variant="danger" onClick={() => setDeleteOpen(true)}>Delete</Button>
        </div>
      </div>

      {/* Map preview + coordinates */}
      <div className="relative border border-line mb-10 overflow-hidden">
        <div className="relative h-56 md:h-64 bg-ink-soft overflow-hidden">
          <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden="true">
            {/* faux survey grid */}
            {Array.from({ length: 14 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 90} y1="0" x2={i * 90} y2="400" stroke="#1f1c15" strokeWidth="1" />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 90} x2="1200" y2={i * 90} stroke="#1f1c15" strokeWidth="1" />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <ellipse key={i} cx={600 + Math.sin(i * 1.4) * 380} cy={200 + Math.cos(i * 1.1) * 130} rx={150 + i * 30} ry={80 + i * 16} stroke="#2e2a20" strokeWidth="1" />
            ))}
            {/* pin */}
            <circle cx="600" cy="200" r="26" fill="#d4a845" opacity="0.18" />
            <circle cx="600" cy="200" r="7" fill="#eec76f" />
          </svg>
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/80 to-transparent pointer-events-none" />
          <div className="absolute left-4 top-4 border border-line bg-ink/85 backdrop-blur-sm px-4 py-2.5">
            <p className="text-[0.6rem] uppercase tracking-[0.22em] text-gold-faint mb-0.5">Coordinates</p>
            <p className="text-[0.85rem] text-gold font-medium">{formatCoords(property.latitude, property.longitude)}</p>
          </div>
          <a
            className="absolute right-4 top-4 text-[0.66rem] uppercase tracking-[0.18em] text-amber border border-amber/50 bg-ink/85 backdrop-blur-sm px-3.5 py-2 hover:border-amber hover:text-amber-bright no-underline"
            href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
            target="_blank"
            rel="noreferrer"
          >
            Open in maps ↗
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 mb-16">
        {/* Left: documents + visits */}
        <div className="flex flex-col gap-14">
          {/* Documents */}
          <section>
            <div className="flex items-end justify-between mb-5">
              <div>
                <p className="text-[0.66rem] uppercase tracking-[0.28em] text-amber mb-2">Vault · Documents</p>
                <h2 className="font-serif text-2xl text-gold">Documents</h2>
              </div>
              <button onClick={() => setDocOpen(true)} className="text-[0.72rem] uppercase tracking-[0.14em] text-amber hover:text-amber-bright cursor-pointer no-underline">
                + Add
              </button>
            </div>

            {property.documents.length === 0 ? (
              <p className="border border-dashed border-line rounded-[2px] px-6 py-10 text-center text-[0.85rem] text-gold-faint">
                No documents yet. Add your deed, survey or tax receipts.
              </p>
            ) : (
              <ul className="border border-line-soft divide-y divide-line-soft">
                {property.documents.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="text-amber text-sm shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M6 2h8l4 4v16H6V2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                          <path d="M14 2v4h4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                          <path d="M9 12h6M9 15h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                      </span>
                      <div className="min-w-0">
                        <p className="text-[0.9rem] text-gold truncate">{d.name}</p>
                        <p className="text-[0.7rem] text-gold-faint mt-0.5">{d.type} · {d.size} · {formatDate(d.uploadedAt)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteDocument(property.id, d.id)}
                      className="text-[0.68rem] uppercase tracking-[0.14em] text-gold-faint hover:text-amber-bright transition-colors cursor-pointer shrink-0"
                      aria-label={`Delete ${d.name}`}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Visits */}
          <section>
            <div className="flex items-end justify-between mb-5">
              <div>
                <p className="text-[0.66rem] uppercase tracking-[0.28em] text-amber mb-2">Journal · Visits</p>
                <h2 className="font-serif text-2xl text-gold">Visit history</h2>
              </div>
              <button onClick={() => setVisitOpen(true)} className="text-[0.72rem] uppercase tracking-[0.14em] text-amber hover:text-amber-bright cursor-pointer no-underline">
                + Log visit
              </button>
            </div>

            {property.visits.length === 0 ? (
              <p className="border border-dashed border-line rounded-[2px] px-6 py-10 text-center text-[0.85rem] text-gold-faint">
                No visits logged yet. Each visit becomes a permanent, timestamped record.
              </p>
            ) : (
              <ol className="relative border-l border-line-soft ml-2">
                {property.visits.map((v) => (
                  <li key={v.id} className="relative pl-8 pb-8 last:pb-0">
                    <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-amber ring-4 ring-ink" aria-hidden="true" />
                    <p className="text-[0.7rem] uppercase tracking-[0.2em] text-amber">{formatDate(v.date)}</p>
                    <p className="mt-1.5 text-[0.95rem] text-gold leading-[1.65]">{v.note}</p>
                    <div className="mt-2.5 flex items-center justify-between gap-4">
                      <p className="text-[0.7rem] text-gold-faint font-mono">{formatCoords(v.latitude, v.longitude)}</p>
                      <button
                        onClick={() => deleteVisit(property.id, v.id)}
                        className="text-[0.66rem] uppercase tracking-[0.14em] text-gold-faint hover:text-amber-bright transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        {/* Right: metadata plate */}
        <aside>
          <div className="sticky top-28 border border-line bg-ink-soft">
            <div className="px-6 py-5 border-b border-line-soft">
              <p className="text-[0.62rem] uppercase tracking-[0.24em] text-amber mb-1">Record</p>
              <h2 className="font-serif text-xl text-gold">Property metadata</h2>
            </div>
            <dl className="px-6 py-5 flex flex-col gap-4">
              {metadataRows(property).map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-6">
                  <dt className="text-[0.62rem] uppercase tracking-[0.2em] text-gold-faint shrink-0">{row.label}</dt>
                  <dd className="text-[0.88rem] text-gold text-right">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </div>

      <AddDocumentDialog open={docOpen} onClose={() => setDocOpen(false)} propertyId={property.id} />
      <AddVisitDialog
        open={visitOpen}
        onClose={() => setVisitOpen(false)}
        propertyId={property.id}
        defaultLat={property.latitude}
        defaultLng={property.longitude}
      />
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          deleteProperty(property.id)
          navigate('/properties')
        }}
        title="Delete this property?"
        body={`This removes “${property.name}” and its ${property.documents.length} document${property.documents.length === 1 ? '' : 's'} and ${property.visits.length} visit${property.visits.length === 1 ? '' : 's'} from your vault. Files in your Drive are not touched.`}
        confirmLabel="Delete record"
      />
    </PageFrame>
  )
}

function metadataRows(p: Property) {
  return [
    { label: 'Category', value: p.category },
    { label: 'Ownership', value: p.ownership },
    { label: 'Total area', value: formatArea(p.area, p.areaUnit) },
    { label: 'Purchase date', value: formatDate(p.purchaseDate) },
    { label: 'Purchase price', value: formatCurrency(p.purchasePrice) },
    { label: 'Market value', value: formatCurrency(p.marketValue) },
    { label: 'Previous owner', value: p.previousOwner ?? '—' },
    { label: 'Coordinates', value: formatCoords(p.latitude, p.longitude) },
    { label: 'Documents', value: String(p.documents.length) },
    { label: 'Visits', value: String(p.visits.length) },
  ]
}
