/** Shared formatting helpers for the app pages. */

export function formatCurrency(value: number | undefined, compact = false): string {
  if (value === undefined || value === null || Number.isNaN(value)) return '—'
  if (compact) {
    if (value >= 1_000_000) return `₹${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `₹${(value / 1_000).toFixed(0)}K`
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value)
}

export function formatDate(iso: string | undefined): string {
  if (!iso) return '—'
  return new Date(iso + (iso.length === 10 ? 'T00:00:00' : '')).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatArea(area: number, unit: string): string {
  return `${formatNumber(area)} ${unit}`
}

export function formatCoords(lat: number, lng: number): string {
  const ns = lat >= 0 ? 'N' : 'S'
  const ew = lng >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(4)}° ${ns} · ${Math.abs(lng).toFixed(4)}° ${ew}`
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 MB'
  const mb = bytes / (1024 * 1024)
  if (mb < 1024) return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`
  return `${(bytes / (1024 ** 3)).toFixed(2)} GB`
}

export function pluralize(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? '' : 's'}`
}
