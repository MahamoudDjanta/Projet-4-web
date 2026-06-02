import { Inbox } from 'lucide-react'

export default function EmptyState({ icon: Icon = Inbox, title = 'Aucune donnee', description = 'Les informations apparaitront ici.' }) {
  return (
    <div className="grid min-h-48 place-items-center rounded-2xl border border-dashed border-[var(--border)] bg-[#FAFAFA] p-8 text-center">
      <div>
        <Icon className="mx-auto mb-3 h-8 w-8 text-[var(--primary)]" aria-hidden="true" />
        <h3 className="text-base font-bold text-[var(--text)]">{title}</h3>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{description}</p>
      </div>
    </div>
  )
}
