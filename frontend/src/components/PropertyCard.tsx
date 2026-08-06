import { Link } from 'react-router-dom'
import type { Property } from '../lib/types'
import { formatArea, formatCoords, formatDate, formatCurrency } from '../lib/format'

/**
 * Property record card — matches stitch_screens/05_all_properties.html:
 * archive-plate with corner ticks, category label + status chip,
 * serif gold title, 2×2 metadata grid, "Open →" footer.
 */
export default function PropertyCard({ property }: { property: Property }) {
  return (
    <Link
      to={`/properties/${property.id}`}
      className="group relative block border border-line-soft bg-ink-card rounded-[2px] p-6 hover:border-line transition-colors duration-300 corner-ticks no-underline"
    >
      {/* hover-reveal full corner ticks */}
      <span
        className="absolute inset-0 pointer-events-none corner-ticks-tr-bl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-hidden="true"
      />

      <div className="flex items-start justify-between mb-6">
        <span className="text-[0.62rem] uppercase tracking-[0.2em] text-on-surface-variant">{property.category}</span>
        <span className="bg-[#17150f] border border-line-soft text-[0.62rem] uppercase tracking-[0.16em] text-amber px-2 py-1 rounded-[2px]">
          {property.ownership}
        </span>
      </div>

      <h2 className="font-serif text-[1.35rem] text-gold mb-8">{property.name}</h2>

      <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
        <div>
          <span className="block text-[0.6rem] uppercase tracking-[0.18em] text-on-surface-variant mb-1 font-semibold">Area</span>
          <span className="text-[0.95rem] text-on-surface">{formatArea(property.area, property.areaUnit)}</span>
        </div>
        <div>
          <span className="block text-[0.6rem] uppercase tracking-[0.18em] text-on-surface-variant mb-1 font-semibold">Value</span>
          <span className="text-[0.95rem] text-on-surface">{formatCurrency(property.marketValue ?? property.purchasePrice, true)}</span>
        </div>
        <div>
          <span className="block text-[0.6rem] uppercase tracking-[0.18em] text-on-surface-variant mb-1 font-semibold">Coord</span>
          <span className="text-[0.95rem] text-on-surface">{formatCoords(property.latitude, property.longitude)}</span>
        </div>
        <div>
          <span className="block text-[0.6rem] uppercase tracking-[0.18em] text-on-surface-variant mb-1 font-semibold">Acquired</span>
          <span className="text-[0.95rem] text-on-surface">{formatDate(property.purchaseDate ?? property.createdAt)}</span>
        </div>
      </div>

      <div className="border-t border-line-soft pt-4 flex justify-between items-center">
        <span className="text-[0.68rem] uppercase tracking-[0.16em] text-on-surface-variant">
          {property.documents.length} documents · {property.visits.length} visits
        </span>
        <span className="text-[0.8rem] text-amber flex items-center gap-1 group-hover:text-gold transition-colors">
          Open →
        </span>
      </div>
    </Link>
  )
}
