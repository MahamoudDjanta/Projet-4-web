import EmptyState from './EmptyState'
import Spinner from './Spinner'

export default function Table({ columns = [], data = [], isLoading = false, emptyTitle }) {
  if (isLoading) {
    return (
      <div className="grid min-h-48 place-items-center rounded-[1.5rem] border border-[var(--border)] bg-white shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
        <Spinner />
      </div>
    )
  }

  if (!data.length) {
    return <EmptyState title={emptyTitle || 'Aucun resultat'} description="Aucune ligne ne correspond aux filtres actuels." />
  }

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/95 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left text-sm">
          <thead className="bg-slate-50/90 text-xs font-semibold uppercase text-slate-500 backdrop-blur-sm">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-4 tracking-[0.14em]">{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex} className="transition duration-200 hover:bg-slate-50/80">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-4 text-slate-700">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
