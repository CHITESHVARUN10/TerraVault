import { useState } from 'react'
import { useStore } from '../lib/store'
import { PageFrame } from '../components/ui/PageFrame'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Field, TextInput } from '../components/ui/Field'
import ConnectDriveDialog from '../components/dialogs/ConnectDriveDialog'
import { formatBytes, formatDate } from '../lib/format'

/**
 * Profile — account details, drive connection, plan.
 */
export default function Profile() {
  const { user, drive, properties } = useStore()
  const [driveOpen, setDriveOpen] = useState(false)
  const [name, setName] = useState(user?.name ?? '')
  const [saved, setSaved] = useState(false)

  if (!user) return null

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const propertyCount = properties.length

  return (
    <PageFrame>
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Your account layer — preferences and connections. Property data stays in your Drive, not here."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10">
        {/* Left: details */}
        <div className="flex flex-col gap-10">
          <section className="border border-line bg-ink-soft">
            <div className="px-7 py-5 border-b border-line-soft">
              <h2 className="font-serif text-xl text-gold">Personal details</h2>
            </div>
            <form onSubmit={save} className="px-7 py-6 flex flex-col gap-5">
              <Field label="Full name">
                <TextInput value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field label="Email" hint="Used to sign in">
                <TextInput value={user.email} disabled className="opacity-60" />
              </Field>
              <div>
                <Button onClick={save} disabled={saved}>
                  {saved ? 'Saved ✓' : 'Save changes'}
                </Button>
              </div>
            </form>
          </section>

          <section className="border border-line bg-ink-soft">
            <div className="px-7 py-5 border-b border-line-soft">
              <h2 className="font-serif text-xl text-gold">Storage — your data, yours</h2>
            </div>
            <div className="px-7 py-6">
              {drive.connected ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between text-[0.88rem]">
                    <span className="text-gold-dim">Connected as</span>
                    <span className="text-gold">{drive.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-[0.88rem]">
                    <span className="text-gold-dim">Folder</span>
                    <span className="text-gold">“{drive.folderName}”</span>
                  </div>
                  <div className="flex items-center justify-between text-[0.88rem]">
                    <span className="text-gold-dim">Usage</span>
                    <span className="text-gold">{formatBytes(drive.usedBytes)} of {formatBytes(drive.quotaBytes)}</span>
                  </div>
                  <div className="h-1 bg-ink-card rounded-full overflow-hidden">
                    <div className="h-full bg-amber" style={{ width: `${Math.min(100, (drive.usedBytes / drive.quotaBytes) * 100)}%` }} />
                  </div>
                  <p className="text-[0.72rem] text-gold-faint leading-relaxed">
                    Connected {formatDate(drive.connectedAt)}. Disconnect anytime — files stay in your Drive.
                  </p>
                  <div>
                    <Button variant="ghost" onClick={() => setDriveOpen(true)}>Manage connection</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start gap-4">
                  <p className="text-[0.88rem] text-gold-dim leading-[1.7]">
                    Connect Google Drive to create a dedicated vault folder where all
                    deeds, surveys, photos and visits are stored.
                  </p>
                  <Button onClick={() => setDriveOpen(true)}>Connect Google Drive</Button>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right: summary */}
        <aside className="flex flex-col gap-6">
          <div className="border border-line bg-ink-soft px-7 py-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-full border border-amber/50 bg-ink-card grid place-items-center font-serif text-xl text-gold mb-4">
              {user.initials}
            </div>
            <p className="font-serif text-xl text-gold">{user.name}</p>
            <p className="text-[0.78rem] text-gold-faint mt-1">{user.email}</p>
            <div className="mt-5 pt-5 border-t border-line-soft flex items-center justify-center gap-6 text-[0.72rem] text-gold-faint">
              <span>Joined {formatDate(user.joinedAt)}</span>
              <span className="text-amber">·</span>
              <span className="text-gold-dim">{user.plan} plan</span>
            </div>
          </div>

          <div className="border border-line bg-ink-soft px-7 py-6">
            <p className="text-[0.62rem] uppercase tracking-[0.22em] text-gold-faint mb-3">Vault summary</p>
            <div className="flex items-center justify-between text-[0.88rem] py-2 border-b border-line-soft">
              <span className="text-gold-dim">Properties</span>
              <span className="text-gold">{propertyCount}</span>
            </div>
            <div className="flex items-center justify-between text-[0.88rem] py-2 border-b border-line-soft">
              <span className="text-gold-dim">Documents</span>
              <span className="text-gold">{properties.reduce((a, p) => a + p.documents.length, 0)}</span>
            </div>
            <div className="flex items-center justify-between text-[0.88rem] py-2">
              <span className="text-gold-dim">Visits</span>
              <span className="text-gold">{properties.reduce((a, p) => a + p.visits.length, 0)}</span>
            </div>
          </div>

          <div className="border border-line bg-ink-soft px-7 py-6">
            <p className="text-[0.62rem] uppercase tracking-[0.22em] text-gold-faint mb-3">Security</p>
            <p className="text-[0.8rem] text-gold-dim leading-[1.7]">
              Zero-trust by design — even a full compromise of our backend exposes
              no property data, because none of it lives on our servers.
            </p>
          </div>
        </aside>
      </div>

      <ConnectDriveDialog open={driveOpen} onClose={() => setDriveOpen(false)} />
    </PageFrame>
  )
}
