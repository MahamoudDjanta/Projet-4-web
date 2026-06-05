import { X } from 'lucide-react'
import Button from './Button'

export default function Modal({ title, isOpen, onClose, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="w-full max-w-xl rounded-2xl border border-[var(--border)] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <h2 className="text-lg font-bold text-[var(--text)]">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Fermer">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
