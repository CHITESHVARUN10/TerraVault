import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, useProperties, useDrive } from '../contexts'
import { PageFrame } from '../components/ui/PageFrame'
import { Button } from '../components/ui/Button'
import PropertyCard from '../components/PropertyCard'
import AddPropertyDialog from '../components/dialogs/AddPropertyDialog'
import ConnectDriveDialog from '../components/dialogs/ConnectDriveDialog'
import PageEnter from '../components/PageEnter'
import { IconCheckCircle, IconAdd } from '../components/icons'
import { formatCurrency, formatNumber } from '../lib/format'

/**
 * Dashboard — matches stitch_screens/04_dashboard.html:
 * ARCHIVE OVERVIEW eyebrow, welcome serif title, stat strip,
 * drive status plate with ticks, recent records cards.
 */
export default function Dashboard() {
  const { user } = useAuth()
  const { properties } = useProperties()
  const { drive } = useDrive()
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
    <PageEnter>
      <PageFrame>
        {/* Header block */}
        <section className="mb-16 flex flex-col md:flex-row md:justify-between md:items-end gap-8">
          <div data-page-reveal>
            <h2 className="text-[0.7rem] uppercase tracking-[0.3em] text-amber mb-4 font-semibold">
              Archive Overview
            </h2>
            <h1 className="font-serif text-[2.6rem] md:text-[3rem] leading-[1.1] text-on-surface mb-2">
              Welcome back, {user?.name.split(' ')[0] ?? 'friend'}.
            </h1>
            <p className="text-on-surface-variant">Your physical records, digitally secured.</p>
          </div>
          <div className="flex gap-4" data-page-reveal>
            <Button variant="ghost" onClick={() => setDriveOpen(true)}>
              {drive.connected ? 'Drive connected' : 'Connect Drive'}
            </Button>
            <Button onClick={() => setAddOpen(true)}>
              <IconAdd size={16} />
              Register property
            </Button>
          </div>
        </section>

        {/* Stat strip */}
        <section className="mb-16 border-y border-line-soft py-8" data-page-reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-line-soft">
            <div className="px-4">
              <p className="font-serif text-[2rem] text-gold">{String(stats.count).padStart(2, '0')}</p>
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-on-surface-variant mt-2 font-semibold">Properties</p>
            </div>
            <div className="px-4">
              <p className="font-serif text-[2rem] text-gold">{formatNumber(stats.totalArea)}</p>
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-on-surface-variant mt-2 font-semibold">Total area</p>
            </div>
            <div className="px-4">
              <p className="font-serif text-[2rem] text-gold">{formatCurrency(stats.marketValue, true)}</p>
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-on-surface-variant mt-2 font-semibold">Est. market value</p>
            </div>
            <div className="px-4">
              <p className="font-serif text-[2rem] text-gold">{stats.documents} / {stats.visits}</p>
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-on-surface-variant mt-2 font-semibold">Documents / Visits</p>
            </div>
          </div>
        </section>

        {/* Drive status strip */}
        <section className="mb-16 bg-ink-card border border-line-soft p-4 rounded-[2px] flex justify-between items-center corner-ticks plate-hover transition-colors duration-300" data-page-reveal>
          <div className="flex items-center gap-3">
            <IconCheckCircle size={22} className="text-gold" />
            <span className="text-[0.95rem] text-on-surface">
              {drive.connected ? 'Google Drive Connected' : 'Google Drive not connected'}
            </span>
          </div>
          <button
            onClick={() => setDriveOpen(true)}
            className="text-[0.7rem] uppercase tracking-[0.14em] text-amber hover:underline cursor-pointer"
          >
            {drive.connected ? 'Manage' : 'Connect'}
          </button>
        </section>

        {/* Recent records */}
        <section className="mb-16" data-page-reveal>
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-line-soft">
            <h3 className="font-serif text-2xl text-on-surface">Recent records</h3>
            <Link to="/properties" className="text-[0.7rem] uppercase tracking-[0.14em] text-amber hover:text-gold no-underline">
              View all →
            </Link>
          </div>

          {properties.length === 0 ? (
            <div className="border border-dashed border-line-soft rounded-[2px] px-8 py-16 text-center" data-page-reveal>
              <p className="font-serif text-xl text-gold mb-2">Your vault is empty</p>
              <p className="text-[0.9rem] text-gold-dim mb-6 max-w-[26rem] mx-auto">
                Register your first property to start preserving its records forever.
              </p>
              <Button onClick={() => setAddOpen(true)}>
                <IconAdd size={16} />
                Register property
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recent.map((p, i) => (
                <div key={p.id} data-page-reveal style={{ transitionDelay: `${i * 60}ms` }}>
                  <PropertyCard property={p} />
                </div>
              ))}
            </div>
          )}
        </section>

        <AddPropertyDialog open={addOpen} onClose={() => setAddOpen(false)} />
        <ConnectDriveDialog open={driveOpen} onClose={() => setDriveOpen(false)} />
      </PageFrame>
    </PageEnter>
  )
}
