import EmptyState from './EmptyState'
import Spinner from './Spinner'

export default function Table({ columns = [], data = [], isLoading = false, emptyTitle }) {
  if (isLoading) {
    return (
      <div className="grid min-h-48 place-items-center rounded-2xl border border-[var(--border)]">
        <Spinner />
      </div>
    )
  }

  if (!data.length) {
    return <EmptyState title={emptyTitle || 'Aucun resultat'} description="Aucune ligne ne correspond aux filtres actuels." />
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="bg-[#FAFAFA] text-xs font-semibold uppercase text-[var(--text-muted)]">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3">{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex} className="transition duration-200 hover:bg-[#FAFAFA]">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-[var(--text)]">
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
