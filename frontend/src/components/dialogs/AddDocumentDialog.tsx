import { useRef, useState } from 'react'
import Dialog from '../ui/Dialog'
import { useStore } from '../../lib/store'
import type { DocumentType } from '../../lib/types'
import { IconDescription, IconArrowDropDown } from '../icons'

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

/**
 * Add document — matches stitch_screens/10_add_document.html:
 * FILE REPOSITORY eyebrow, custom-chevron select, dashed dropzone
 * with description icon + file name/size + Change File,
 * Cancel + "Store in Vault".
 */
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
      title="Add Document"
      eyebrow="File repository"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-line text-amber text-[0.78rem] font-semibold uppercase tracking-[0.1em] hover:bg-ink-card hover:text-gold transition-all duration-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            className="btn-lift px-6 py-3 bg-gold text-ink text-[0.78rem] font-semibold uppercase tracking-[0.1em] hover:bg-primary transition-all duration-300 cursor-pointer"
          >
            Store in Vault
          </button>
        </>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-6 mt-2">
        {/* Document type */}
        <div className="flex flex-col gap-2">
          <label className="text-[0.68rem] uppercase tracking-[0.18em] text-on-surface-variant font-semibold" htmlFor="doc-type">
            Document type
          </label>
          <div className="relative">
            <select
              id="doc-type"
              value={type}
              onChange={(e) => setType(e.target.value as DocumentType)}
              className="w-full bg-transparent border-b border-line-soft hover:border-line focus:border-amber focus:outline-none text-on-surface font-body-md text-[1rem] py-3 px-0 cursor-pointer transition-colors duration-200 appearance-none pr-6"
            >
              {DOC_TYPES.map((t) => (
                <option key={t} value={t} className="bg-surface text-on-surface">{t}</option>
              ))}
            </select>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-amber pointer-events-none">
              <IconArrowDropDown size={18} />
            </span>
          </div>
        </div>

        {/* File dropzone */}
        <div className="flex flex-col gap-2">
          <label className="text-[0.68rem] uppercase tracking-[0.18em] text-on-surface-variant font-semibold">File upload</label>
          <label className="w-full border border-dashed border-line p-6 flex flex-col items-center justify-center bg-paper hover:border-amber transition-colors duration-300 cursor-pointer text-center">
            <input ref={inputRef} type="file" className="hidden" onChange={pickFile} />
            {fileName ? (
              <div className="flex flex-col items-center gap-3 text-center">
                <IconDescription size={36} className="text-amber" filled />
                <div>
                  <p className="text-[0.95rem] text-on-surface">{fileName}</p>
                  <p className="text-[0.8rem] text-on-surface-variant mt-1">{size}</p>
                </div>
                <span className="mt-2 text-[0.8rem] text-amber hover:text-gold underline underline-offset-4 transition-all">
                  Change File
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center">
                <IconDescription size={36} className="text-amber" filled />
                <div>
                  <p className="text-[0.95rem] text-on-surface">Choose a PDF, image or file</p>
                </div>
              </div>
            )}
          </label>
        </div>

        {error && <p className="text-error text-[0.85rem]">{error}</p>}
      </form>
    </Dialog>
  )
}
