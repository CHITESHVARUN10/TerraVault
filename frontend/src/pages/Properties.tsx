import { useMemo, useState } from 'react'
import { useStore } from '../lib/store'
import { PageFrame, EmptyState } from '../components/ui/PageFrame'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { TextInput, Select } from '../components/ui/Field'
import PropertyCard from '../components/PropertyCard'
import AddPropertyDialog from '../components/dialogs/AddPropertyDialog'

const CATEGORY_FILTERS = ['All', 'Agricultural Land', 'Residential Plot', 'Commercial Property', 'Open Land', 'Farm', 'Industrial Land', 'Other']

/**
 * All properties — searchable, filterable registry of every record.
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

  return (
    <PageFrame>
      <PageHeader
        eyebrow="Registry"
        title="All properties"
        description={`${properties.length} ${properties.length === 1 ? 'record' : 'records'} in your vault. Every deed, survey and visit anchored to a place.`}
        actions={<Button onClick={() => setAddOpen(true)}>+ Register property</Button>}
      />

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="flex-1">
          <TextInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, category, owner…"
            aria-label="Search properties"
          />
        </div>
        <div className="sm:w-64">
          <Select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
            {CATEGORY_FILTERS.map((c) => (
              <option key={c} value={c}>{c === 'All' ? 'All categories' : c}</option>
            ))}
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={properties.length === 0 ? 'No properties yet' : 'No matches'}
          body={
            properties.length === 0
              ? 'Register your first property to begin your vault.'
              : 'Nothing matches that search. Try a different name or category.'
          }
          action={
            properties.length === 0 ? (
              <Button onClick={() => setAddOpen(true)}>+ Register property</Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}

      <AddPropertyDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </PageFrame>
  )
}
