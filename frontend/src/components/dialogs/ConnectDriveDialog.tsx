import { useState } from 'react'
import Dialog from '../ui/Dialog'
import { useDrive } from '../../contexts'
import { formatBytes } from '../../lib/format'
import {
  IconShield,
  IconCloudSync,
  IconKey,
  IconCheckCircle,
  IconGoogle,
} from '../icons'

/**
 * Connect Drive — matches stitch_screens/13_connect_drive.html and
 * 14_drive_connected.html: EXTERNAL STORAGE header, feature list,
 * gold "Connect with Google", and the connected success state with
 * storage bar + mono sync line + Disconnect.
 */
export default function ConnectDriveDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { drive, connect, disconnect } = useDrive()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const handleConnect = () => {
    setBusy(true)
    setError('')
    // Full-page OAuth flow: backend → Google consent → callback → here.
    connect(window.location.pathname)
  }

  const handleDisconnect = async () => {
    setBusy(true)
    setError('')
    try {
      await disconnect()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect.')
    } finally {
      setBusy(false)
    }
  }

  const usagePct = drive.quotaBytes ? Math.min(100, (drive.usedBytes / drive.quotaBytes) * 100) : 0

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={drive.connected ? 'Drive connected' : 'Connect Archive Repository'}
      eyebrow="External storage"
    >
      {drive.connected ? (
        <div className="flex flex-col items-center gap-6">
          <IconCheckCircle size={40} className="text-gold-faint" />
          <div className="text-center space-y-1">
            <h2 className="font-serif text-xl text-on-surface">Drive connected</h2>
            <p className="text-[0.9rem] text-on-surface-variant">{drive.email}</p>
          </div>

          <div className="w-full space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-[0.68rem] uppercase tracking-[0.18em] text-on-surface-variant font-semibold">Storage allocation</span>
              <span className="text-[0.9rem] text-on-surface text-sm">{formatBytes(drive.usedBytes)} / {formatBytes(drive.quotaBytes)}</span>
            </div>
            <div className="h-2 w-full border border-line bg-ink-card relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-amber" style={{ width: `${usagePct}%` }} />
            </div>
            <div className="text-left mt-4 pt-4 border-t border-line-soft">
              <p className="font-mono text-xs text-outline tracking-wide">
                Syncing to: TerraVault / Property Vault
              </p>
            </div>
          </div>

          {error && <p className="text-error text-[0.85rem]">{error}</p>}

          <button
            type="button"
            onClick={handleDisconnect}
            disabled={busy}
            className="btn-lift w-full py-3 px-6 border border-line text-error text-[0.78rem] font-semibold uppercase tracking-[0.14em] hover:bg-ink-card transition-colors duration-200 cursor-pointer disabled:opacity-60"
          >
            {busy ? 'Disconnecting…' : 'Disconnect'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <IconShield size={22} className="text-gold mt-0.5" filled />
              <div>
                <h3 className="text-[0.9rem] text-on-surface">Zero-trust encryption</h3>
                <p className="text-[0.85rem] text-on-surface-variant mt-1">
                  End-to-end security ensures your archival data remains entirely private and unreadable to third parties.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <IconCloudSync size={22} className="text-gold mt-0.5" />
              <div>
                <h3 className="text-[0.9rem] text-on-surface">Automated backup</h3>
                <p className="text-[0.85rem] text-on-surface-variant mt-1">
                  Continuous sync to maintain the integrity of your ledger without manual intervention.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <IconKey size={22} className="text-gold mt-0.5" />
              <div>
                <h3 className="text-[0.9rem] text-on-surface">Sovereign file ownership</h3>
                <p className="text-[0.85rem] text-on-surface-variant mt-1">
                  Maintain full custodial control over your vault assets at all times.
                </p>
              </div>
            </li>
          </ul>

          {error && <p className="text-error text-[0.85rem]">{error}</p>}

          <div className="flex flex-col gap-4 mt-4">
            <button
              type="button"
              onClick={handleConnect}
              disabled={busy}
              className="btn-lift w-full flex items-center justify-center gap-2 bg-gold text-ink text-[0.8rem] font-semibold uppercase tracking-[0.12em] py-3 px-6 hover:bg-primary transition-colors cursor-pointer disabled:opacity-60"
            >
              <IconGoogle size={20} />
              {busy ? 'Redirecting to Google…' : 'Connect with Google'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full text-center py-3 px-6 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-gold border border-line hover:bg-ink-card transition-colors duration-200 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </Dialog>
  )
}
