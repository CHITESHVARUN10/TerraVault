import { useState } from 'react'
import { useStore } from '../lib/store'
import { PageFrame } from '../components/ui/PageFrame'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Field, TextInput, TextArea } from '../components/ui/Field'

export default function Contact() {
  const { user } = useStore()
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    subject: '',
    message: '',
  })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim())
      return setError('Please fill in your name, email and message.')
    setSent(true)
    setError('')
  }

  return (
    <PageFrame>
      <PageHeader
        eyebrow="Support"
        title="Contact"
        description="Questions about your vault, documents or Drive connection? Write to us — a human replies."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10">
        <section className="border border-line bg-ink-soft h-fit">
          <div className="px-7 py-5 border-b border-line-soft">
            <h2 className="font-serif text-xl text-gold">Send a message</h2>
          </div>

          {sent ? (
            <div className="px-7 py-10 text-center">
              <p className="text-amber text-2xl mb-3">✓</p>
              <p className="font-serif text-lg text-gold mb-2">Message sent</p>
              <p className="text-[0.85rem] text-gold-dim">
                Thank you — we'll get back to you at {form.email} shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="px-7 py-6 flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Name" required>
                  <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </Field>
                <Field label="Email" required>
                  <TextInput type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </Field>
              </div>
              <Field label="Subject">
                <TextInput
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="e.g. Drive connection issue"
                />
              </Field>
              <Field label="Message" required>
                <TextArea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help?"
                />
              </Field>
              {error && <p className="text-[0.82rem] text-amber-bright">{error}</p>}
              <div>
                <Button onClick={submit}>Send message</Button>
              </div>
            </form>
          )}
        </section>

        <aside className="flex flex-col gap-6">
          <div className="border border-line bg-ink-soft px-7 py-6">
            <p className="text-[0.62rem] uppercase tracking-[0.22em] text-gold-faint mb-3">Email</p>
            <p className="text-[0.92rem] text-gold">support@terravault.app</p>
          </div>
          <div className="border border-line bg-ink-soft px-7 py-6">
            <p className="text-[0.62rem] uppercase tracking-[0.22em] text-gold-faint mb-3">Response time</p>
            <p className="text-[0.92rem] text-gold-dim leading-[1.7]">
              We reply within two working days. For urgent account issues, mention
              “urgent” in the subject.
            </p>
          </div>
          <div className="border border-line bg-ink-soft px-7 py-6">
            <p className="text-[0.62rem] uppercase tracking-[0.22em] text-gold-faint mb-3">Privacy</p>
            <p className="text-[0.92rem] text-gold-dim leading-[1.7]">
              We never see your property documents, photos or GPS data — it all
              lives in your own Google Drive.
            </p>
          </div>
        </aside>
      </div>
    </PageFrame>
  )
}
