/**
 * Minimal inline-SVG icon set mirroring the Material Symbols used by the
 * stitch_screens HTML (landscape, location_on, lock, mail, key, search,
 * arrow_drop_down, add, arrow_forward/outward, check_circle, cloud_sync,
 * description, receipt_long, history_edu, folder_open, data_object,
 * warning, close, calendar_today, info, edit, shield, my_location,
 * travel_explore, menu). All accept `size` and `className`.
 */
interface IconProps {
  size?: number
  className?: string
  filled?: boolean
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true as const,
})

export function IconLandscape({ size = 24, className = '' }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 19h18l-5.5-8-4.5 6-3-4L3 19Z" />
      <circle cx="17.5" cy="7.5" r="1.5" />
    </svg>
  )
}

export function IconLocation({ size = 24, className = '', filled = false }: IconProps) {
  return (
    <svg {...base(size)} className={className} fill={filled ? 'currentColor' : 'none'}>
      <path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10Z" />
      <circle cx="12" cy="11" r="2.2" />
    </svg>
  )
}

export function IconLock({ size = 24, className = '', filled = false }: IconProps) {
  return (
    <svg {...base(size)} className={className} fill={filled ? 'currentColor' : 'none'}>
      <rect x="5" y="10.5" width="14" height="9" rx="1" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconMail({ size = 24, className = '' }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

export function IconKey({ size = 24, className = '' }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="8" cy="14" r="4" />
      <path d="m11 11 9-9M16 6l3 3M14 8l2 2" />
    </svg>
  )
}

export function IconSearch({ size = 24, className = '' }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  )
}

export function IconArrowDropDown({ size = 24, className = '' }: IconProps) {
  return (
    <svg {...base(size)} className={className} stroke="none" fill="currentColor">
      <path d="m7 9.5 5 5 5-5H7Z" />
    </svg>
  )
}

export function IconAdd({ size = 24, className = '' }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function IconArrowForward({ size = 24, className = '' }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function IconArrowOutward({ size = 24, className = '' }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

export function IconArrowBack({ size = 24, className = '' }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  )
}

export function IconCheckCircle({ size = 24, className = '' }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </svg>
  )
}

export function IconCheck({ size = 24, className = '' }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  )
}

export function IconCloudSync({ size = 24, className = '' }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M7 18.5a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17 9.5a3.5 3.5 0 0 1 .5 6.97" />
      <path d="M9.5 16.5 7 19l2.5 2.5M14.5 14l2.5 2.5-2.5 2.5" />
    </svg>
  )
}

export function IconDescription({ size = 24, className = '', filled = false }: IconProps) {
  return (
    <svg {...base(size)} className={className} fill={filled ? 'currentColor' : 'none'}>
      <path d="M6 2h8l4 4v16H6V2Z" />
      <path d="M14 2v4h4" />
      <path d="M9 12h6M9 15h6" />
    </svg>
  )
}

export function IconReceiptLong({ size = 24, className = '' }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M5 3h14v18l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21V3Z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </svg>
  )
}

export function IconHistoryEdu({ size = 24, className = '' }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 6a3 3 0 0 1 3-3h13v14H7a3 3 0 0 0-3 3V6Z" />
      <path d="M8 3v11M7 17a2 2 0 0 0-2 2h12" />
      <path d="M11 7h5M11 10h5" />
    </svg>
  )
}

export function IconFolderOpen({ size = 24, className = '' }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v1H4l-1.5 9A2 2 0 0 0 3 21h16a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2" />
    </svg>
  )
}

export function IconDataObject({ size = 24, className = '' }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="8" y="3" width="8" height="18" rx="2" />
      <path d="M12 7.5v.01M12 12v.01M12 16.5v.01" />
    </svg>
  )
}

export function IconWarning({ size = 24, className = '' }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 3 2 20h20L12 3Z" />
      <path d="M12 9.5v5M12 17v.01" />
    </svg>
  )
}

export function IconClose({ size = 24, className = '' }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

export function IconCalendarToday({ size = 24, className = '' }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="3" y="5" width="18" height="16" rx="1" />
      <path d="M3 9.5h18M8 3v4M16 3v4" />
    </svg>
  )
}

export function IconInfo({ size = 24, className = '' }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5v.01" />
    </svg>
  )
}

export function IconEdit({ size = 24, className = '' }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
      <path d="m13.5 6.5 3 3" />
    </svg>
  )
}

export function IconShield({ size = 24, className = '', filled = false }: IconProps) {
  return (
    <svg {...base(size)} className={className} fill={filled ? 'currentColor' : 'none'}>
      <path d="M12 3 4 6v5.5c0 4.5 3.3 8.3 8 9.5 4.7-1.2 8-5 8-9.5V6l-8-3Z" />
      <path d="m9 11.5 2 2 4-4.5" />
    </svg>
  )
}

export function IconMyLocation({ size = 24, className = '' }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="6.5" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3" />
    </svg>
  )
}

export function IconTravelExplore({ size = 24, className = '' }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="11" cy="11" r="7.5" />
      <path d="m16 16 5 5" />
      <path d="M8.5 11a2.5 2.5 0 0 1 5 0c0 1.8-2.5 3.5-2.5 3.5S8.5 12.8 8.5 11Z" />
    </svg>
  )
}

export function IconMenu({ size = 24, className = '' }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function IconGoogle({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}
