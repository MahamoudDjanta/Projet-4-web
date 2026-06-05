import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getClasses } from '../../api/classes'
import { getProgramme } from '../../api/cours'
import { useAsyncData } from '../../hooks/useAsyncData'
import { EmptyState, Table } from '../../components/ui'

export default function Programme() {
  const navigate = useNavigate()
  const { classeId } = useParams()
  const { data: classesData } = useAsyncData(getClasses, [])
  const { data, isLoading } = useAsyncData(
    () => (classeId ? getProgramme(classeId) : Promise.resolve({ data: [] })),
    [classeId]
  )

  const classes = useMemo(() => classesData?.data || classesData || [], [classesData])
  const rows = data?.data || data || []
  const selectedClasse = classes.find((classe) => String(classe.id) === String(classeId))

  function handleClassChange(event) {
    const value = event.target.value
    if (value) {
      navigate(`/cours/programme/${value}`)
    }
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-[1fr_280px] items-end">
        <label className="grid gap-2 text-sm font-medium text-[var(--text)]">
          Classe
          <select
            value={classeId || ''}
            onChange={handleClassChange}
            className="h-11 rounded-lg border border-gray-200 px-3 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="">Sélectionner</option>
            {classes.map((classe) => (
              <option key={classe.id} value={classe.id}>{classe.nom}</option>
            ))}
          </select>
        </label>
        {classeId && (
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm text-[var(--text-muted)]">Programme de</p>
            <p className="mt-1 text-lg font-semibold text-[var(--text)]">{selectedClasse?.nom || `Classe ${classeId}`}</p>
          </div>
        )}
      </div>

      {!classeId ? (
        <EmptyState title="Choisissez une classe" description="Sélectionnez une classe pour consulter son programme." />
      ) : (
        <Table
          columns={[
            { key: 'jour', label: 'Jour' },
            { key: 'heure_debut', label: 'Début' },
            { key: 'heure_fin', label: 'Fin' },
            { key: 'cours', label: 'Cours', render: (row) => row.cours?.nom || row.cours || row.nom },
            { key: 'salle', label: 'Salle' },
          ]}
          data={rows}
          isLoading={isLoading}
          emptyTitle="Programme vide"
        />
      )}
    </div>
  )
}
