import { useRef, useState } from 'react'
import Dialog from '../ui/Dialog'
import { Button } from '../ui/Button'
import { Field, Select } from '../ui/Field'
import { useStore } from '../../lib/store'
import type { DocumentType } from '../../lib/types'

const DOC_TYPES: DocumentType[] = [
  'Ownership Deed',
  'Inheritance Document',
  'Will',
  'Trust Document',
  'Survey Map',
  'Property Tax Receipt',
  'Chain of Ownership',
  'Court Order',
  'Other',
]

export default function AddDocumentDialog({
  open,
  onClose,
  propertyId,
}: {
  open: boolean
  onClose: () => void
  propertyId: string
}) {
  const { addDocument } = useStore()
  const [type, setType] = useState<DocumentType>('Ownership Deed')
  const [fileName, setFileName] = useState('')
  const [size, setSize] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const mb = file.size / (1024 * 1024)
    setSize(mb < 1 ? `${Math.round(file.size / 1024)} KB` : `${mb.toFixed(1)} MB`)
    setError('')
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fileName) return setError('Choose a file to upload.')
    addDocument(propertyId, { name: fileName, type, size: size || '—' })
    setFileName('')
    setSize('')
    if (inputRef.current) inputRef.current.value = ''
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Add a document"
      eyebrow="Vault · Document"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>Store in vault</Button>
        </>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-5">
        <Field label="Document type" hint="Files are kept under a meaningful type">
          <Select value={type} onChange={(e) => setType(e.target.value as DocumentType)}>
            {DOC_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </Field>

        <Field label="File" required>
          <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-line rounded-[2px] px-6 py-8 text-center cursor-pointer hover:border-amber transition-colors">
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={pickFile}
            />
            <span className="text-amber text-lg leading-none">＋</span>
            <span className="text-[0.85rem] text-gold-dim">
              {fileName || 'Choose a PDF, image or file'}
            </span>
            {size && <span className="text-[0.7rem] text-gold-faint">{size}</span>}
          </label>
        </Field>

        {error && <p className="text-[0.82rem] text-amber-bright">{error}</p>}
      </form>
    </Dialog>
  )
}
