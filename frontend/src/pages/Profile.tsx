import { useState } from 'react'
import { useStore } from '../lib/store'
import { PageFrame } from '../components/ui/PageFrame'
import { Button } from '../components/ui/Button'
import { UnderlineInput } from '../components/ui/Field'
import ConnectDriveDialog from '../components/dialogs/ConnectDriveDialog'
import PageEnter from '../components/PageEnter'
import CornerTicks from '../components/ui/CornerTicks'
import { IconLock, IconCheck, IconCloudSync, IconEdit, IconShield } from '../components/icons'
import { formatBytes, formatDate } from '../lib/format'

/**
 * Profile — matches stitch_screens/07_profile.html:
 * ACCOUNT eyebrow, personal details plate, storage plate with
 * capacity bar, identity plate, vault summary, zero-trust note.
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

  const documentCount = properties.reduce((a, p) => a + p.documents.length, 0)
  const visitCount = properties.reduce((a, p) => a + p.visits.length, 0)

  return (
    <PageEnter>
      <PageFrame>
        {/* Header */}
        <header className="flex flex-col gap-2 mb-16" data-page-reveal>
          <span className="text-[0.7rem] uppercase tracking-[0.3em] text-amber font-semibold">Account</span>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] text-gold leading-[1.05]">Profile</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left column (2/3) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Personal details */}
            <section className="bg-ink-card border border-line-soft relative p-8 hover:border-line transition-colors duration-200 flex flex-col gap-6" data-page-reveal>
              <CornerTicks />
              <h2 className="font-serif text-xl text-gold border-b border-line-soft pb-4">Personal details</h2>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2 relative">
                  <label className="text-[0.68rem] uppercase tracking-[0.18em] text-on-surface-variant font-semibold">Full name</label>
                  <UnderlineInput type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2 relative">
                  <label className="text-[0.68rem] uppercase tracking-[0.18em] text-on-surface-variant font-semibold">Email address</label>
                  <UnderlineInput type="email" value={user.email} disabled className="opacity-70" />
                  <span className="absolute right-0 top-9 text-on-surface-variant">
                    <IconLock size={14} />
                  </span>
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <Button onClick={save} disabled={saved}>
                  {saved ? 'Saved' : 'Save Changes'}
                  {saved && <IconCheck size={16} />}
                </Button>
              </div>
            </section>

            {/* Storage */}
            <section className="bg-ink-card border border-line-soft relative p-8 hover:border-line transition-colors duration-200 flex flex-col gap-6" data-page-reveal>
              <CornerTicks />
              <div className="flex justify-between items-end border-b border-line-soft pb-4">
                <h2 className="font-serif text-xl text-gold">Storage</h2>
                <span className="bg-[#17150f] border border-line-soft px-3 py-1 rounded-[2px] text-[0.68rem] uppercase tracking-[0.16em] text-gold inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sage" /> {drive.connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="w-16 h-16 rounded-[8px] bg-line-soft flex items-center justify-center shrink-0 border border-line">
                  <IconCloudSync size={28} className="text-gold" />
                </div>
                <div className="flex-grow flex flex-col gap-4 w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[0.95rem] text-on-surface">Google Drive Integration</h3>
                      <p className="text-[0.85rem] text-on-surface-variant mt-1">
                        {drive.connected
                          ? `${drive.email} • /${drive.folderName.replace(/_Archive$/, '')}_Archive`
                          : 'Not connected yet'}
                      </p>
                    </div>
                    <button onClick={() => setDriveOpen(true)} className="text-[0.8rem] text-amber nav-link hidden md:block cursor-pointer">
                      Manage connection
                    </button>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex justify-between text-[0.68rem] uppercase tracking-[0.16em] text-on-surface-variant">
                      <span>Capacity</span>
                      <span>{formatBytes(drive.usedBytes)} of {formatBytes(drive.quotaBytes)} used</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container-lowest border border-line-soft relative overflow-hidden rounded-[2px]">
                      <div
                        className="absolute top-0 left-0 h-full bg-amber"
                        style={{ width: `${drive.quotaBytes ? Math.min(100, (drive.usedBytes / drive.quotaBytes) * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                  <button onClick={() => setDriveOpen(true)} className="text-[0.8rem] text-amber nav-link md:hidden self-start mt-2 cursor-pointer">
                    Manage connection
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Right column (1/3) */}
          <div className="lg:col-span-1 flex flex-col gap-8 sticky top-28">
            {/* Identity block */}
            <div className="bg-ink-card border border-line-soft relative p-8 flex flex-col items-center text-center gap-4" data-page-reveal>
              <CornerTicks />
              <div className="w-32 h-32 rounded-full bg-paper border-2 border-line-soft flex items-center justify-center mb-2 relative">
                <span className="font-serif text-[2.4rem] text-gold tracking-tighter">{user.initials}</span>
                <button
                  onClick={save}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gold text-ink flex items-center justify-center btn-lift border-2 border-ink-card cursor-pointer"
                  aria-label="Edit profile"
                >
                  <IconEdit size={15} />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="font-serif text-[1.4rem] text-gold">{user.name}</h2>
                <p className="text-[0.85rem] text-amber opacity-80">{user.email}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-line-soft w-full flex flex-col items-center gap-2">
                <p className="text-[0.85rem] text-on-surface-variant">Joined {formatDate(user.joinedAt)}</p>
                <span className="bg-[#17150f] border border-amber px-4 py-1 rounded-[2px] text-[0.68rem] uppercase tracking-[0.2em] text-amber">
                  {user.plan === 'Pro' ? 'Premium Tier' : 'Free Tier'}
                </span>
              </div>
            </div>

            {/* Vault summary */}
            <div className="bg-ink-card border border-line-soft p-6 flex flex-col gap-4" data-page-reveal>
              <h3 className="text-[0.68rem] uppercase tracking-[0.18em] text-on-surface-variant mb-2 font-semibold">Vault summary</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-3 bg-paper border border-line-soft rounded-[2px]">
                  <span className="font-serif text-[1.4rem] text-gold">{properties.length}</span>
                  <span className="text-[0.62rem] uppercase tracking-[0.12em] text-on-surface-variant mt-1">Assets</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-paper border border-line-soft rounded-[2px]">
                  <span className="font-serif text-[1.4rem] text-gold">{documentCount}</span>
                  <span className="text-[0.62rem] uppercase tracking-[0.12em] text-on-surface-variant mt-1">Records</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-paper border border-line-soft rounded-[2px]">
                  <span className="font-serif text-[1.4rem] text-gold">{visitCount}</span>
                  <span className="text-[0.62rem] uppercase tracking-[0.12em] text-on-surface-variant mt-1">Logs</span>
                </div>
              </div>
            </div>

            {/* Zero-trust note */}
            <div className="flex items-center gap-3 justify-center text-center px-4" data-page-reveal>
              <IconShield size={20} className="text-amber opacity-80" filled />
              <p className="text-[0.78rem] text-amber opacity-80">
                Protected by TerraVault's Zero-Trust Security Protocol.
              </p>
            </div>
          </div>
        </div>

        <ConnectDriveDialog open={driveOpen} onClose={() => setDriveOpen(false)} />
      </PageFrame>
    </PageEnter>
  )
}
