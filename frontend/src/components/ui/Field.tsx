import type { ReactNode } from 'react'

/**
 * Form field wrapper: label + children + hint/error, editorial styling.
 */
export function Field({
  label,
  hint,
  error,
  children,
  required,
}: {
  label: string
  hint?: string
  error?: string
  children: ReactNode
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3 mb-1.5">
        <span className="text-[0.68rem] uppercase tracking-[0.18em] text-gold-dim">
          {label}
          {required && <span className="text-amber ml-1">*</span>}
        </span>
        {hint && <span className="text-[0.68rem] text-gold-faint">{hint}</span>}
      </span>
      {children}
      {error && <span className="block mt-1.5 text-[0.75rem] text-amber-bright">{error}</span>}
    </label>
  )
}

const inputBase =
  'w-full bg-ink text-gold border border-line rounded-[2px] px-3.5 py-2.5 text-[0.95rem] placeholder:text-gold-faint/60 focus:outline-none focus:border-amber transition-colors'

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputBase} ${props.className ?? ''}`} />
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`${inputBase} appearance-none ${props.className ?? ''}`}
    >
      {props.children}
    </select>
  )
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputBase} resize-y min-h-[90px] ${props.className ?? ''}`} />
}

/** Borderless underline input used by register / profile / add-property dialogs. */
export function UnderlineInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`input-underline ${props.className ?? ''}`} />
}

export function UnderlineSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`input-underline appearance-none cursor-pointer bg-transparent ${props.className ?? ''}`}
    >
      {props.children}
    </select>
  )
}
