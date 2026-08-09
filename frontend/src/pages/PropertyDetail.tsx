import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useProperties } from '../contexts'
import { PageFrame } from '../components/ui/PageFrame'
import { Button } from '../components/ui/Button'
import AddDocumentDialog from '../components/dialogs/AddDocumentDialog'
import AddVisitDialog from '../components/dialogs/AddVisitDialog'
import ConfirmDialog from '../components/dialogs/ConfirmDialog'
import PageEnter from '../components/PageEnter'
import {
  IconLocation,
  IconArrowOutward,
  IconMyLocation,
  IconFolderOpen,
  IconHistoryEdu,
  IconDescription,
  IconReceiptLong,
  IconDataObject,
  IconAdd,
} from '../components/icons'
import { formatArea, formatCoords, formatCurrency, formatDate } from '../lib/format'
import type { Property } from '../lib/types'

/**
 * Property detail — matches stitch_screens/06_property_detail.html
 * and 18_property_detail_empty.html: breadcrumb, serif title, map
 * plate, documents list, visits journal, sticky metadata sidebar,
 * and dashed empty states for documents/visits.
 */
export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { properties, remove, removeDocument, removeVisit } = useProperties()
  const [docOpen, setDocOpen] = useState(false)
  const [visitOpen, setVisitOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const property = properties.find((p) => p.id === id)

  if (!property) {
    return (
      <PageFrame>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="text-on-surface-variant opacity-50 mb-6"><IconLocation size={48} /></span>
          <h3 className="font-serif text-xl text-on-surface mb-2">Record not found</h3>
          <p className="text-[0.95rem] text-on-surface-variant mb-8 max-w-md mx-auto">
            This property doesn't exist or was deleted from your vault.
          </p>
          <Link to="/properties">
            <Button variant="ghost">Back to properties</Button>
          </Link>
        </div>
      </PageFrame>
    )
  }

  return (
    <PageEnter>
      <PageFrame>
        {/* Breadcrumb */}
        <div className="flex flex-wrap gap-2 mb-8" data-page-reveal>
          <Link to="/properties" className="text-[0.8rem] text-outline hover:text-gold transition-colors no-underline">
            Properties
          </Link>
          <span className="text-[0.8rem] text-outline">/</span>
          <span className="text-[0.8rem] text-gold">{property.name}</span>
        </div>

        {/* Header */}
        <div className="flex flex-wrap justify-between items-end gap-8 mb-12 border-b border-outline-variant pb-4" data-page-reveal>
          <div className="flex flex-col gap-2">
            <span className="text-[0.68rem] uppercase tracking-[0.3em] text-amber font-semibold">{property.category}</span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-on-surface leading-[1.05]">{property.name}</h1>
            <p className="text-[0.95rem] text-outline">
              {property.ownership} <span className="mx-2">·</span> Registered {formatDate(property.createdAt)}
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button onClick={() => setDocOpen(true)} className="corner-ticks h-10 font-bold">
              <IconAdd size={16} />
              Document
            </Button>
            <Button onClick={() => setVisitOpen(true)} className="corner-ticks h-10 font-bold">
              <IconAdd size={16} />
              Log visit
            </Button>
            <Button variant="ghost" onClick={() => setDeleteOpen(true)} className="corner-ticks-tr-bl h-10">
              Delete
            </Button>
          </div>
        </div>

        {/* Map preview */}
        <div className="w-full h-[300px] mb-12 relative border border-outline-variant corner-ticks bg-surface-container overflow-hidden group" data-page-reveal>
          {/* Simulated map texture */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(rgba(232,200,119,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(232,200,119,0.1) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(232,200,119,0.1) 0%, rgba(22,19,14,0.05) 50%, rgba(22,19,14,1) 100%)',
            }}
          />

          {/* Coordinate pin */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <IconLocation size={30} className="text-gold drop-shadow-[0_0_8px_rgba(232,200,119,0.5)]" filled />
            <div className="w-2 h-2 bg-gold rounded-full mt-1 animate-pulse-soft" />
          </div>

          {/* Overlays */}
          <div className="absolute bottom-4 left-4 bg-surface-container-high border border-outline-variant px-3 py-1.5 corner-ticks text-[0.8rem] text-gold flex items-center gap-2">
            <IconMyLocation size={16} />
            {formatCoords(property.latitude, property.longitude)}
          </div>
          <a
            className="absolute top-4 right-4 bg-surface-container-high/80 backdrop-blur border border-outline-variant px-3 py-1.5 corner-ticks-tr-bl text-[0.8rem] text-on-surface hover:text-gold transition-colors flex items-center gap-1 no-underline"
            href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
            target="_blank"
            rel="noreferrer"
          >
            Open in maps <IconArrowOutward size={14} />
          </a>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Left column */}
          <div className="lg:col-span-8 flex flex-col gap-16">
            {/* Documents */}
            <section data-page-reveal>
              <h3 className="font-serif text-3xl mb-8 text-gold border-b border-outline-variant pb-2 flex items-center gap-3">
                <IconFolderOpen size={24} /> Documents
              </h3>
              {property.documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border border-dashed border-outline-variant rounded-[2px] bg-surface-container-low">
                  <span className="text-4xl text-gold-faint mb-4">
                    <IconDescription size={40} />
                  </span>
                  <p className="text-on-surface-variant text-base mb-6 text-center">No documents stored yet</p>
                  <Button variant="ghost" onClick={() => setDocOpen(true)} className="h-10">
                    <IconAdd size={16} />
                    Document
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col border border-outline-variant corner-ticks bg-surface-container/30">
                  {property.documents.map((d, i) => (
                    <div
                      key={d.id}
                      className={`flex items-center justify-between p-4 ${i < property.documents.length - 1 ? 'border-b border-outline-variant' : ''} hover:bg-surface-container-high transition-colors group`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-outline group-hover:text-gold transition-colors">
                          {d.type === 'Property Tax Receipt' ? <IconReceiptLong size={20} /> : <IconDescription size={20} />}
                        </span>
                        <div>
                          <p className="text-[0.9rem] text-on-surface">{d.name}</p>
                          <p className="text-[0.8rem] text-outline">{d.type} · {d.size} · {formatDate(d.uploadedAt)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeDocument(property.id, d.id)}
                        className="text-[0.7rem] uppercase tracking-wider text-outline hover:text-error transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Visits journal */}
            <section data-page-reveal>
              <h3 className="font-serif text-3xl mb-8 text-gold border-b border-outline-variant pb-2 flex items-center gap-3">
                <IconHistoryEdu size={24} /> Visits Journal
              </h3>

              {property.visits.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border border-dashed border-outline-variant rounded-[2px] bg-surface-container-low">
                  <span className="text-4xl text-gold-faint mb-4">
                    <IconLocation size={40} />
                  </span>
                  <p className="text-on-surface-variant text-base mb-6 text-center">No visits recorded yet</p>
                  <Button variant="ghost" onClick={() => setVisitOpen(true)} className="h-10">
                    <IconAdd size={16} />
                    Log visit
                  </Button>
                </div>
              ) : (
                <div className="relative pl-6 ml-4 border-l border-outline-variant space-y-8">
                  {property.visits.map((v) => (
                    <div key={v.id} className="relative">
                      <span className="absolute -left-[31px] top-1 w-3 h-3 bg-background border-2 border-amber rounded-full" aria-hidden="true" />
                      <div className="bg-surface-container/30 border border-outline-variant p-4 corner-ticks hover:border-amber/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-amber font-semibold">{formatDate(v.date)}</p>
                          <button
                            onClick={() => removeVisit(property.id, v.id)}
                            className="text-[0.7rem] uppercase tracking-wider text-outline hover:text-error transition-colors cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-[1.05rem] text-on-surface mb-3 font-serif italic">{v.note}</p>
                        <div className="flex items-center gap-1 text-[0.78rem] text-outline bg-surface-container-high w-fit px-2 py-1 border border-outline-variant/50">
                          <IconLocation size={14} />
                          {formatCoords(v.latitude, v.longitude)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right column — sticky metadata */}
          <aside className="lg:col-span-4" data-page-reveal>
            <div className="sticky top-[100px] border border-outline-variant bg-surface-container-lowest p-6 corner-ticks-tr-bl shadow-2xl">
              <h4 className="font-serif text-xl text-gold mb-6 flex items-center gap-2">
                <IconDataObject size={20} /> Metadata
              </h4>
              <ul className="flex flex-col divide-y divide-outline-variant/50">
                {metadataRows(property).map((row) => (
                  <li key={row.label} className="py-3 flex justify-between items-center group">
                    <span className="text-[0.78rem] text-outline group-hover:text-on-surface transition-colors">{row.label}</span>
                    <span className={`text-[0.9rem] text-on-surface ${row.mono ? 'font-mono text-sm' : ''}`}>{row.value}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t border-outline-variant flex justify-between">
                <div className="text-center">
                  <span className="block font-serif text-2xl text-gold">{property.documents.length}</span>
                  <span className="text-[0.68rem] uppercase tracking-[0.16em] text-outline">Docs</span>
                </div>
                <div className="w-px bg-outline-variant" />
                <div className="text-center">
                  <span className="block font-serif text-2xl text-gold">{property.visits.length}</span>
                  <span className="text-[0.68rem] uppercase tracking-[0.16em] text-outline">Visits</span>
                </div>
              </div>
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
          onConfirm={async () => {
            await remove(property.id)
            navigate('/properties')
          }}
          title="Confirm Record Deletion"
          eyebrow="Permanent action"
          body={`Deleting this record will remove the property profile along with its ${property.documents.length} document${property.documents.length === 1 ? '' : 's'} and ${property.visits.length} visit log${property.visits.length === 1 ? '' : 's'} from the TerraVault ledger. Files already synchronized to your Google Drive will remain untouched.`}
          confirmLabel="Delete Record"
        />
      </PageFrame>
    </PageEnter>
  )
}

function metadataRows(p: Property) {
  return [
    { label: 'Category', value: p.category, mono: false },
    { label: 'Ownership', value: p.ownership, mono: false },
    { label: 'Total area', value: formatArea(p.area, p.areaUnit), mono: true },
    { label: 'Purchase date', value: formatDate(p.purchaseDate), mono: false },
    { label: 'Purchase price', value: formatCurrency(p.purchasePrice), mono: true },
    { label: 'Market value', value: formatCurrency(p.marketValue), mono: true },
    { label: 'Previous owner', value: p.previousOwner ?? '—', mono: false },
    { label: 'Coordinates', value: formatCoords(p.latitude, p.longitude), mono: true },
  ]
}
