import { useState } from 'react'
import { useAuth } from '../contexts'
import { PageFrame } from '../components/ui/PageFrame'
import { UnderlineInput } from '../components/ui/Field'
import PageEnter from '../components/PageEnter'

/**
 * Contact — matches stitch_screens/08_contact.html:
 * Support eyebrow, "Reach out to the registry archives.",
 * form plate with underline fields + sent state,
 * info plates (Direct Inquiry / Registry Latency / Secure Protocol).
 */
export default function Contact() {
  const { user } = useAuth()
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
    <PageEnter>
      <PageFrame>
        {/* Page header */}
        <div className="mb-16" data-page-reveal>
          <span className="text-[0.7rem] uppercase tracking-[0.3em] text-outline block mb-4 font-semibold">Support</span>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] text-on-surface mb-4">Contact</h1>
          <p className="text-[1.05rem] text-on-surface-variant max-w-2xl">Reach out to the registry archives.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: form */}
          <div className="md:col-span-7 lg:col-span-8" data-page-reveal>
            <div className="bg-ink-card border border-line-soft p-8 md:p-12 corner-ticks hover:border-line transition-colors relative">
              <h2 className="font-serif text-[1.6rem] text-on-surface mb-8">Send a message</h2>

              {sent ? (
                <div className="text-center py-8">
                  <p className="font-serif text-xl text-gold mb-2">Message sent ✓</p>
                  <p className="text-[0.9rem] text-on-surface-variant">
                    Thank you — we'll get back to you at {form.email} shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <label className="text-[0.68rem] uppercase tracking-[0.2em] text-outline mb-2 font-semibold" htmlFor="name">Name</label>
                      <UnderlineInput
                        id="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[0.68rem] uppercase tracking-[0.2em] text-outline mb-2 font-semibold" htmlFor="email">Email</label>
                      <UnderlineInput
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[0.68rem] uppercase tracking-[0.2em] text-outline mb-2 font-semibold" htmlFor="subject">Subject</label>
                    <UnderlineInput
                      id="subject"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[0.68rem] uppercase tracking-[0.2em] text-outline mb-2 font-semibold" htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full bg-transparent border border-line-soft text-on-surface font-body-md p-4 focus:outline-none focus:border-amber transition-colors resize-none mt-2"
                    />
                  </div>

                  {error && <p className="text-error text-[0.85rem] border-l-2 border-error pl-2">{error}</p>}

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="btn-lift bg-gold text-ink font-semibold text-[0.8rem] uppercase tracking-[0.14em] px-8 py-4 hover:bg-primary transition-colors flex items-center justify-center min-w-[200px] cursor-pointer"
                    >
                      {sent ? 'Message sent ✓' : 'Send message'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right: info plates */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col space-y-6" data-page-reveal>
            {[
              { title: 'Direct Inquiry', body: 'registry@terravault.io' },
              { title: 'Registry Latency', body: 'Average response time: 24-48 hours.' },
              { title: 'Secure Protocol', body: 'All communications are encrypted and purged after resolution.' },
            ].map((plate) => (
              <div key={plate.title} className="bg-ink-card border border-line-soft p-8 corner-ticks hover:border-line transition-colors relative">
                <h3 className="font-serif text-xl text-gold mb-2">{plate.title}</h3>
                <p className="text-[0.95rem] text-on-surface-variant">{plate.body}</p>
              </div>
            ))}
          </div>
        </div>
      </PageFrame>
    </PageEnter>
  )
}
