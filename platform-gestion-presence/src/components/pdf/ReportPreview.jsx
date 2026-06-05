import Table from '../ui/Table'

export default function ReportPreview({ report, isLoading }) {
  const rows = report?.eleves || report?.students || []
  const columns = [
    { key: 'nom', label: 'Élève', render: (row) => row.nom || row.name },
    { key: 'presents', label: 'Présents' },
    { key: 'absences', label: 'Absences' },
    { key: 'taux', label: 'Taux', render: (row) => `${row.taux ?? row.rate ?? 0}%` },
  ]

  return (
    <div id="report-preview" className="rounded-2xl border border-[var(--border)] bg-white p-5">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-[var(--text)]">{report?.ecole || 'Rapport de présence'}</h2>
        <p className="text-sm font-medium text-[var(--text-muted)]">
          {report?.classe || 'Classe'} - {report?.periode || 'Période sélectionnée'}
        </p>
      </div>
      <Table columns={columns} data={rows} isLoading={isLoading} emptyTitle="Aucun aperçu disponible" />
    </div>
  )
}
