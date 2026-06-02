import toast from 'react-hot-toast'
import { updatePresenceRequest, getPresenceRequests } from '../../api/presences'
import { useAsyncData } from '../../hooks/useAsyncData'
import { Badge, Button, Table } from '../../components/ui'

export default function Requetes() {
  const { data, isLoading } = useAsyncData(getPresenceRequests, [])
  const requests = data?.data || data || []

  async function decide(row, statut) {
    await updatePresenceRequest(row.id, { statut })
    toast.success('Requete mise a jour')
  }

  return (
    <Table
      columns={[
        { key: 'eleve', label: 'Eleve', render: (row) => row.eleve?.nom || row.eleve || row.nom },
        { key: 'absence', label: 'Absence', render: (row) => row.absence?.date || row.date },
        { key: 'motif', label: 'Motif' },
        { key: 'statut', label: 'Statut', render: (row) => <Badge status={row.statut || 'pending'} /> },
        {
          key: 'actions',
          label: 'Actions',
          render: (row) => (
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => decide(row, 'approved')}>Approuver</Button>
              <Button size="sm" variant="ghost" onClick={() => decide(row, 'rejected')}>Rejeter</Button>
            </div>
          ),
        },
      ]}
      data={requests}
      isLoading={isLoading}
      emptyTitle="Aucune requete"
    />
  )
}
