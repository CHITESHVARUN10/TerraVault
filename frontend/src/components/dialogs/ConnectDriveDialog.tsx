import Dialog from '../ui/Dialog'
import { Button } from '../ui/Button'
import { useStore } from '../../lib/store'
import { formatBytes } from '../../lib/format'

export default function ConnectDriveDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { drive, connectDrive, disconnectDrive } = useStore()

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={drive.connected ? 'Your Drive vault' : 'Connect Google Drive'}
      eyebrow="Storage · Your data"
      footer={
        drive.connected ? (
          <>
            <Button variant="danger" onClick={disconnectDrive}>Disconnect</Button>
            <Button onClick={onClose}>Done</Button>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={connectDrive}>Connect with Google</Button>
          </>
        )
      }
    >
      {drive.connected ? (
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-4 border border-line-soft rounded-[2px] px-5 py-4">
            <span className="text-amber text-xl leading-none mt-0.5">✓</span>
            <div>
              <p className="text-[0.95rem] text-gold">Drive connected</p>
              <p className="text-[0.8rem] text-gold-dim mt-1">{drive.email}</p>
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-[0.68rem] uppercase tracking-[0.18em] text-gold-dim">
                Vault usage
              </span>
              <span className="text-[0.75rem] text-gold-faint">
                {formatBytes(drive.usedBytes)} of {formatBytes(drive.quotaBytes)}
              </span>
            </div>
            <div className="h-1 bg-ink-card rounded-full overflow-hidden">
              <div
                className="h-full bg-amber"
                style={{ width: `${Math.min(100, (drive.usedBytes / drive.quotaBytes) * 100)}%` }}
              />
            </div>
          </div>

          <p className="text-[0.75rem] text-gold-faint leading-relaxed">
            Everything is stored in your folder <span className="text-gold-dim">“{drive.folderName}”</span>.
            TerraVault never persists your property data on its own servers.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <p className="text-[0.9rem] text-gold-dim leading-[1.7]">
            Connect your Google account to create a dedicated{' '}
            <span className="text-gold">“TerraVault”</span> folder in your own Drive.
            Deeds, surveys, photos and visit records live there — only you can open it.
          </p>
          <ul className="flex flex-col gap-2 text-[0.82rem] text-gold-dim">
            <li className="flex gap-2.5"><span className="text-amber">·</span>Your data is never stored on TerraVault servers</li>
            <li className="flex gap-2.5"><span className="text-amber">·</span>Each device grants its own access after your consent</li>
            <li className="flex gap-2.5"><span className="text-amber">·</span>Disconnect anytime — your files stay in your Drive</li>
          </ul>
        </div>
      )}
    </Dialog>
  )
}
