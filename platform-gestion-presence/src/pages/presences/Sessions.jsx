import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { closePresenceSession, getSessions } from '../../api/presences'
import { useAsyncData } from '../../hooks/useAsyncData'
import { Button, Card, EmptyState, Table } from '../../components/ui'

export default function SessionList() {
  const [refresh, setRefresh] = useState(0)
  const navigate = useNavigate()
  const { data, isLoading } = useAsyncData(() => getSessions(), [refresh])
  const sessions = data || []

  async function handleClose(sessionId) {
    try {
      await closePresenceSession(sessionId)
      toast.success('Session clôturée')
      setRefresh((value) => value + 1)
    } catch (error) {
      toast.error('Impossible de clôturer la session.')
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-xl font-bold text-[var(--text)]">Sessions de présence</h1>
            <p className="text-sm text-[var(--text-muted)]">Consultez les sessions ouvertes et fermez-les lorsque la présence est terminée.</p>
          </div>
          <Button onClick={() => navigate('/presences/qr')}>
            Voir le scanner QR
          </Button>
        </div>
      </Card>

      <Table
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'cours', label: 'Cours', render: (row) => row.cours?.nom || row.cours || 'N/A' },
          { key: 'classe', label: 'Classe', render: (row) => row.cours?.classe?.nom || row.classe || 'N/A' },
          { key: 'statut', label: 'Statut' },
          { key: 'date', label: 'Date' },
          { key: 'actions', label: 'Actions', render: (row) => (
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={() => navigate(`/presences/qr?sessionId=${row.id}`)}>
                Voir QR
              </Button>
              <Button size="sm" variant="ghost" onClick={() => navigate(`/presences/sessions/${row.id}`)}>
                Détails
              </Button>
              {['ouvert', 'ouverte'].includes((row.statut || '').toLowerCase()) && (
                <Button size="sm" variant="danger" onClick={() => handleClose(row.id)}>
                  Clôturer
                </Button>
              )}
            </div>
          ) },
        ]}
        data={sessions}
        isLoading={isLoading}
        emptyTitle="Aucune session de présence"
      />
    </div>
  )
}
