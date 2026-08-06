import Dialog from '../ui/Dialog'
import { Button } from '../ui/Button'

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  body,
  confirmLabel = 'Delete',
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  body: string
  confirmLabel?: string
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      eyebrow="Please confirm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={() => { onConfirm(); onClose() }}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-[0.9rem] text-gold-dim leading-[1.7]">{body}</p>
    </Dialog>
  )
}
