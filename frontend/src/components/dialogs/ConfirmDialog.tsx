import Dialog from '../ui/Dialog'
import { IconWarning } from '../icons'

/**
 * Confirm deletion — matches stitch_screens/12_confirm_delete.html:
 * warning icon in bordered circle, PERMANENT ACTION eyebrow,
 * body plate with counts, Cancel + red "Delete Record" (btn-lift).
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  eyebrow = 'Permanent action',
  body,
  confirmLabel = 'Delete Record',
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  eyebrow?: string
  body: string
  confirmLabel?: string
}) {
  return (
    <Dialog open={open} onClose={onClose} title={title} eyebrow={eyebrow}>
      <div className="flex flex-col items-center text-center mb-2">
        <div className="w-16 h-16 rounded-full border border-line-soft flex items-center justify-center mb-6 bg-ink-card">
          <IconWarning size={30} className="text-error" />
        </div>
      </div>

      <div className="bg-ink-card border border-line-soft p-6 mb-8 text-center rounded-[2px]">
        <p className="text-[0.95rem] text-on-surface-variant leading-relaxed">{body}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto px-6 py-3 border border-line text-gold text-[0.78rem] font-semibold uppercase tracking-[0.1em] hover:bg-ink-card transition-colors duration-200 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => { onConfirm(); onClose() }}
          className="btn-lift w-full sm:w-auto px-6 py-3 bg-delete text-on-surface-variant text-[0.78rem] font-semibold uppercase tracking-[0.1em] hover:bg-delete-hover transition-colors duration-200 cursor-pointer"
        >
          {confirmLabel}
        </button>
      </div>
    </Dialog>
  )
}
