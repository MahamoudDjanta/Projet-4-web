import { Inbox } from 'lucide-react'

export default function EmptyState({ icon: Icon = Inbox, title = 'Aucune donnée', description = 'Les informations apparaîtront ici.' }) {
  return (
    <div className="grid min-h-48 place-items-center rounded-[1.75rem] border border-dashed border-[var(--border)] bg-white/90 p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
      <div>
        <span className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[var(--accent-soft)] text-[var(--primary)] shadow-sm">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <h3 className="text-base font-bold text-[var(--text)]">{title}</h3>
        <p className="mt-2 text-sm text-[var(--text-muted)]">{description}</p>
      </div>
    </div>
  )
}
