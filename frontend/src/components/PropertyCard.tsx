import { Link } from 'react-router-dom'
import type { Property } from '../lib/types'
import { formatArea, formatCoords, formatDate, formatCurrency } from '../lib/format'

/**
 * Property record card — the recurring unit across Dashboard and
 * All Properties. Archive-plate treatment with corner ticks.
 */
export default function PropertyCard({ property }: { property: Property }) {
  return (
    <Link
      to={`/properties/${property.id}`}
      className="group relative block border border-line bg-ink-soft hover:border-amber/60 transition-colors no-underline"
    >
      <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-amber/70 group-hover:border-amber transition-colors pointer-events-none" aria-hidden="true" />
      <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-amber/70 group-hover:border-amber transition-colors pointer-events-none" aria-hidden="true" />
      <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-amber/70 group-hover:border-amber transition-colors pointer-events-none" aria-hidden="true" />
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-amber/70 group-hover:border-amber transition-colors pointer-events-none" aria-hidden="true" />

      <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-5 border-b border-line-soft">
        <div>
          <p className="text-[0.62rem] uppercase tracking-[0.24em] text-amber mb-2">{property.category}</p>
          <h3 className="font-serif text-[1.35rem] text-gold group-hover:text-amber-bright transition-colors leading-snug">
            {property.name}
          </h3>
        </div>
        <span className="shrink-0 text-[0.68rem] uppercase tracking-[0.16em] text-gold-faint border border-line rounded-[2px] px-2.5 py-1.5">
          {property.ownership}
        </span>
      </div>

      <div className="px-6 py-5 grid grid-cols-2 gap-x-6 gap-y-3.5 text-[0.78rem]">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.2em] text-gold-faint mb-1">Area</p>
          <p className="text-gold">{formatArea(property.area, property.areaUnit)}</p>
        </div>
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.2em] text-gold-faint mb-1">Market value</p>
          <p className="text-gold">{formatCurrency(property.marketValue, true)}</p>
        </div>
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.2em] text-gold-faint mb-1">Coordinates</p>
          <p className="text-gold-dim">{formatCoords(property.latitude, property.longitude)}</p>
        </div>
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.2em] text-gold-faint mb-1">Acquired</p>
          <p className="text-gold-dim">{formatDate(property.purchaseDate ?? property.createdAt)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between px-6 pb-6 text-[0.7rem] uppercase tracking-[0.16em] text-gold-faint">
        <span>{property.documents.length} documents · {property.visits.length} visits</span>
        <span className="text-amber group-hover:text-amber-bright transition-colors">Open →</span>
      </div>
    </Link>
  )
}
