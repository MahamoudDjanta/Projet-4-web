import { useParams } from 'react-router-dom'
import { getProgramme } from '../../api/cours'
import { useAsyncData } from '../../hooks/useAsyncData'
import { EmptyState, Table } from '../../components/ui'

export default function Programme() {
  const { classeId } = useParams()
  const { data, isLoading } = useAsyncData(() => getProgramme(classeId), [classeId])
  const rows = data?.data || data || []

  if (!classeId) return <EmptyState title="Classe manquante" description="Ouvrez un programme avec un identifiant de classe." />

  return (
    <Table
      columns={[
        { key: 'jour', label: 'Jour' },
        { key: 'heure_debut', label: 'Debut' },
        { key: 'heure_fin', label: 'Fin' },
        { key: 'cours', label: 'Cours', render: (row) => row.cours?.nom || row.cours || row.nom },
        { key: 'salle', label: 'Salle' },
      ]}
      data={rows}
      isLoading={isLoading}
      emptyTitle="Programme vide"
    />
  )
}
