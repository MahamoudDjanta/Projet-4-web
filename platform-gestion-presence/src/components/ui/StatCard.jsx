import Card from './Card'

export default function StatCard({ label, value, icon: Icon, trend }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-600">{label}</p>
          <strong className="mt-3 block text-4xl font-extrabold text-[var(--primary)]">{value ?? '--'}</strong>
          {trend && <span className="mt-2 block text-xs font-medium text-slate-500">{trend}</span>}
        </div>
        {Icon && (
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-white/85 text-[var(--primary)] shadow-sm">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
        )}
      </div>
    </Card>
  )
}
