import { useMemo, useState } from 'react'
import { useStore } from '../lib/store'
import { PageFrame } from '../components/ui/PageFrame'
import { Button } from '../components/ui/Button'
import PropertyCard from '../components/PropertyCard'
import AddPropertyDialog from '../components/dialogs/AddPropertyDialog'
import PageEnter from '../components/PageEnter'
import { IconSearch, IconArrowDropDown, IconAdd, IconTravelExplore } from '../components/icons'

const CATEGORY_FILTERS = ['All', 'Agricultural Land', 'Residential Plot', 'Commercial Property', 'Open Land', 'Farm', 'Industrial Land', 'Other']

/**
 * All properties — matches stitch_screens/05_all_properties.html:
 * Registry eyebrow, title + count, search + filter bar,
 * card grid, "No matches found" empty state.
 */
export default function Properties() {
  const { properties } = useStore()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [addOpen, setAddOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return properties.filter((p) => {
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.ownership.toLowerCase().includes(q) ||
        (p.previousOwner ?? '').toLowerCase().includes(q)
      const matchesCategory = category === 'All' || p.category === category
      return matchesQuery && matchesCategory
    })
  }, [properties, query, category])

  const clearFilters = () => {
    setQuery('')
    setCategory('All')
  }

  return (
    <PageEnter>
      <PageFrame>
        {/* Page header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6" data-page-reveal>
          <div>
            <span className="text-[0.7rem] uppercase tracking-[0.3em] text-amber block mb-4 font-semibold">Registry</span>
            <div className="flex items-baseline gap-4">
              <h1 className="font-serif text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] text-on-surface m-0">All properties</h1>
              <span className="font-serif text-xl text-on-surface-variant opacity-70">
                {String(properties.length).padStart(2, '0')}
              </span>
            </div>
          </div>
          <Button onClick={() => setAddOpen(true)}>
            <IconAdd size={16} />
            Register property
          </Button>
        </header>

        {/* Filters bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 border-b border-line-soft pb-6" data-page-reveal>
          <div className="relative flex-grow max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
              <IconSearch size={18} />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search properties..."
              className="w-full bg-ink border border-line-soft text-on-surface font-body-md py-3 pl-12 pr-4 focus:outline-none focus:border-amber transition-colors rounded-[2px] placeholder:text-on-surface-variant/50"
            />
          </div>
          <div className="relative w-full md:w-64">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-ink border border-line-soft text-on-surface font-body-md py-3 pl-4 pr-10 focus:outline-none focus:border-amber transition-colors rounded-[2px] appearance-none cursor-pointer"
            >
              {CATEGORY_FILTERS.map((c) => (
                <option key={c} value={c} className="bg-surface-container text-on-surface">
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
              <IconArrowDropDown size={18} />
            </span>
          </div>
        </div>

        {/* Grid or empty state */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center" data-page-reveal>
            <span className="text-[48px] text-on-surface-variant mb-6 opacity-50">
              <IconTravelExplore size={48} />
            </span>
            <h3 className="font-serif text-xl text-on-surface mb-2">No matches found</h3>
            <p className="text-[0.95rem] text-on-surface-variant mb-8 max-w-md mx-auto">
              The requested archive parameters yielded no results within the current registry.
            </p>
            <button
              onClick={clearFilters}
              className="text-[0.8rem] uppercase tracking-[0.12em] text-gold border-b border-gold pb-1 hover:text-amber hover:border-amber transition-colors cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative" data-page-reveal>
            {filtered.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}

        <AddPropertyDialog open={addOpen} onClose={() => setAddOpen(false)} />
      </PageFrame>
    </PageEnter>
  )
}
