import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getSession, markManualPresence } from '../../api/presences'
import { useAsyncData } from '../../hooks/useAsyncData'
import { Button, Card, EmptyState, Table } from '../../components/ui'

const STATUSES = ['present', 'absent', 'retard']

export default function SessionDetail() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [refreshKey, setRefreshKey] = useState(0)
  const { data: session, isLoading } = useAsyncData(() => getSession(sessionId), [sessionId, refreshKey])
  const [updatedPresences, setUpdatedPresences] = useState({})

  const rows = useMemo(() => {
    const presences = session?.presences || []
    return presences.map((presence) => ({
      ...presence,
      statut: updatedPresences[presence.eleve_id] ?? presence.statut,
      eleve_nom: presence.eleve?.user?.name || presence.eleve?.nom || `Eleve ${presence.eleve_id}`,
    }))
  }, [session, updatedPresences])

  async function savePresences() {
    if (!session) return

    const presences = rows.map((presence) => ({
      eleve_id: presence.eleve_id,
      statut: presence.statut,
    }))

    try {
      await markManualPresence(session.id, { session_id: session.id, presences })
      toast.success('Présences enregistrées')
      setUpdatedPresences({})
      setRefreshKey((value) => value + 1)
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement.")
    }
  }

  if (!sessionId) {
    return <EmptyState title="Session manquante" description="Aucun identifiant de session n'a ete fourni." />
  }

  if (!session && !isLoading) {
    return <EmptyState title="Session introuvable" description="Cette session n'existe pas ou a ete supprimee." />
  }

  return (
    <div className="grid gap-6">
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold text-[var(--text)]">Session #{sessionId}</h1>
            <p className="text-sm text-[var(--text-muted)]">{session?.cours?.nom || 'Cours inconnu'} - {session?.cours?.classe?.nom || session?.classe || 'Classe inconnue'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => navigate('/presences/sessions')} variant="secondary">Retour aux sessions</Button>
            <Button onClick={savePresences} disabled={!rows.length}>Enregistrer la liste</Button>
          </div>
        </div>
      </Card>

      <Card>
        <Table
          columns={[
            { key: 'eleve_nom', label: 'Élève' },
            { key: 'statut', label: 'Statut', render: (row) => (
              <select
                value={row.statut}
                onChange={(event) => setUpdatedPresences((prev) => ({ ...prev, [row.eleve_id]: event.target.value }))}
                className="h-11 rounded-lg border border-gray-200 px-3 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                {STATUSES.map((statut) => (
                  <option key={statut} value={statut}>{statut}</option>
                ))}
              </select>
            ) },
            { key: 'methode', label: 'Méthode' },
            { key: 'marque_le', label: 'Marqué le', render: (row) => row.marque_le ? new Date(row.marque_le).toLocaleString() : '-' },
          ]}
          data={rows}
          isLoading={isLoading}
          emptyTitle="Aucune présence en session"
        />
      </Card>
    </div>
  )
}
