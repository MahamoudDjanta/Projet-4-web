import { getNotifications } from '../../api/notifications'
import { useAsyncData } from '../../hooks/useAsyncData'
import { Badge, Table } from '../../components/ui'

export default function Notifications() {
  const { data, isLoading } = useAsyncData(getNotifications, [])
  const notifications = data?.data || data || []

  return (
    <Table
      columns={[
        { key: 'eleve', label: 'Eleve', render: (row) => row.eleve?.nom || row.eleve || row.nom },
        { key: 'cours', label: 'Cours manque', render: (row) => row.cours?.nom || row.cours },
        { key: 'date', label: 'Date' },
        { key: 'statut', label: 'Statut', render: (row) => <Badge status={row.statut === 'envoye' ? 'approved' : 'rejected'}>{row.statut || 'envoye'}</Badge> },
      ]}
      data={notifications}
      isLoading={isLoading}
      emptyTitle="Aucune notification"
    />
  )
}
