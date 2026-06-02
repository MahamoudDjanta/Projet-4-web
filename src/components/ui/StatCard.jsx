import Card from './Card'

export default function StatCard({ label, value, icon: Icon, trend }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--text-muted)]">{label}</p>
          <strong className="mt-3 block text-3xl font-bold text-[var(--primary)]">{value ?? '--'}</strong>
          {trend && <span className="mt-2 block text-xs font-medium text-[var(--text-muted)]">{trend}</span>}
        </div>
        {Icon && (
          <span className="rounded-xl bg-[var(--accent-soft)] p-3 text-[var(--primary)]">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        )}
      </div>
    </Card>
  )
}
