import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { PageFrame } from '../components/ui/PageFrame'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import PropertyCard from '../components/PropertyCard'
import AddPropertyDialog from '../components/dialogs/AddPropertyDialog'
import ConnectDriveDialog from '../components/dialogs/ConnectDriveDialog'
import { formatCurrency, formatBytes, pluralize } from '../lib/format'

/**
 * Dashboard — the vault overview: stats, drive status, recent records.
 */
export default function Dashboard() {
  const { user, properties, drive } = useStore()
  const [addOpen, setAddOpen] = useState(false)
  const [driveOpen, setDriveOpen] = useState(false)

  const stats = useMemo(() => {
    const totalArea = properties.reduce((acc, p) => acc + p.area, 0)
    const marketValue = properties.reduce(
      (acc, p) => acc + (p.marketValue ?? p.purchasePrice ?? 0),
      0,
    )
    const documents = properties.reduce((acc, p) => acc + p.documents.length, 0)
    const visits = properties.reduce((acc, p) => acc + p.visits.length, 0)
    return { count: properties.length, totalArea, marketValue, documents, visits }
  }, [properties])

  const recent = properties.slice(0, 3)

  return (
    <PageFrame>
      <PageHeader
        eyebrow="Vault overview"
        title={`Welcome back, ${user?.name.split(' ')[0] ?? 'friend'}.`}
        description="Everything you've preserved — properties, documents, visits — in one quiet place."
        actions={
          <>
            <Button variant="ghost" onClick={() => setDriveOpen(true)}>
              {drive.connected ? 'Drive connected' : 'Connect Drive'}
            </Button>
            <Button onClick={() => setAddOpen(true)}>+ Register property</Button>
          </>
        }
      />

      {/* Stat plates */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line mb-14">
        {[
          { label: 'Properties', value: String(stats.count), sub: pluralize(stats.count, 'record') },
          { label: 'Total area', value: `${stats.totalArea.toLocaleString('en-IN')} ${stats.totalArea > 0 ? 'units' : ''}`, sub: 'across your vault' },
          { label: 'Est. market value', value: formatCurrency(stats.marketValue, true), sub: 'current estimate' },
          { label: 'Documents', value: String(stats.documents), sub: pluralize(stats.visits, 'logged visit') },
        ].map((s) => (
          <div key={s.label} className="bg-ink px-6 py-6">
            <p className="text-[0.62rem] uppercase tracking-[0.22em] text-gold-faint mb-2.5">{s.label}</p>
            <p className="font-serif text-[1.7rem] text-gold leading-none mb-2">{s.value}</p>
            <p className="text-[0.72rem] text-gold-faint">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Drive status strip */}
      <div className="flex flex-wrap items-center justify-between gap-6 border border-line-soft bg-ink-soft px-7 py-6 mb-16">
        <div className="flex items-center gap-5">
          <span className="text-amber text-xl leading-none">
            {drive.connected ? '✓' : '▣'}
          </span>
          <div>
            <p className="text-[0.95rem] text-gold">
              {drive.connected ? 'Google Drive vault connected' : 'Connect your Google Drive'}
            </p>
            <p className="text-[0.78rem] text-gold-faint mt-0.5">
              {drive.connected
                ? `${drive.email} · folder “${drive.folderName}” · ${formatBytes(drive.usedBytes)} used`
                : 'Your property data is stored only in your own Drive — never on our servers.'}
            </p>
          </div>
        </div>
        <Button variant={drive.connected ? 'ghost' : 'solid'} onClick={() => setDriveOpen(true)}>
          {drive.connected ? 'Manage' : 'Connect Drive'}
        </Button>
      </div>

      {/* Recent properties */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[0.66rem] uppercase tracking-[0.28em] text-amber mb-2">Recent records</p>
          <h2 className="font-serif text-2xl text-gold">Your properties</h2>
        </div>
        <Link to="/properties" className="text-[0.75rem] uppercase tracking-[0.14em] text-amber hover:text-amber-bright no-underline">
          View all →
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="border border-dashed border-line rounded-[2px] px-8 py-16 text-center">
          <p className="font-serif text-xl text-gold mb-2">Your vault is empty</p>
          <p className="text-[0.9rem] text-gold-dim mb-6 max-w-[26rem] mx-auto">
            Register your first property to start preserving its records forever.
          </p>
          <Button onClick={() => setAddOpen(true)}>+ Register property</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recent.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}

      <AddPropertyDialog open={addOpen} onClose={() => setAddOpen(false)} />
      <ConnectDriveDialog open={driveOpen} onClose={() => setDriveOpen(false)} />
    </PageFrame>
  )
}
