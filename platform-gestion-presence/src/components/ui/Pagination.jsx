import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from './Button'

export default function Pagination({ total = 1, page = 1, onChange }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="secondary" size="sm" aria-label="Page precedente" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium text-[var(--text-muted)]">Page {page} / {total}</span>
      <Button variant="secondary" size="sm" aria-label="Page suivante" disabled={page >= total} onClick={() => onChange(page + 1)}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
