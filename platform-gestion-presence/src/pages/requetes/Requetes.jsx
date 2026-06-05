import toast from 'react-hot-toast'
import { useState } from 'react'
import { Send } from 'lucide-react'
import { createPresenceRequest, updatePresenceRequest, getPresenceRequests, getSessions } from '../../api/presences'
import { getEleves } from '../../api/eleves'
import { useAsyncData } from '../../hooks/useAsyncData'
import { useAuth } from '../../hooks/useAuth'
import { Badge, Button, Card, Input, Table } from '../../components/ui'

export default function Requetes() {
  const { user } = useAuth()
  const role = (user?.role || '').toLowerCase()
  const canTreat = ['admin', 'professeur'].includes(role)
  const defaultEleveId = user?.eleve_id || user?.enfants?.[0]?.id || ''
  const [refresh, setRefresh] = useState(0)
  const [form, setForm] = useState({ eleve_id: defaultEleveId, session_id: '', motif: '' })
  const { data, isLoading } = useAsyncData(getPresenceRequests, [refresh])
  const { data: elevesData } = useAsyncData(getEleves, [])
  const { data: sessionsData } = useAsyncData(getSessions, [])
  const requests = data?.data || data || []
  const eleves = elevesData?.data || elevesData || []
  const sessions = sessionsData?.data || sessionsData || []

  async function submit(event) {
    event.preventDefault()
    await createPresenceRequest(form)
    toast.success('Requête envoyée')
    setForm({ eleve_id: '', session_id: '', motif: '' })
    setRefresh((value) => value + 1)
  }

  async function decide(row, statut) {
    await updatePresenceRequest(row.id, { statut })
    toast.success('Requete mise a jour')
    setRefresh((value) => value + 1)
  }

  return (
    <div className={`grid gap-6 ${canTreat ? '' : 'xl:grid-cols-[360px_1fr]'}`}>
      {!canTreat && (
        <Card>
          <form className="grid gap-4" onSubmit={submit}>
            <label className="grid gap-2 text-sm font-medium text-[var(--text)]">
              Élève
              <select className="h-11 rounded-lg border border-gray-200 px-3 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" value={form.eleve_id} onChange={(event) => setForm({ ...form, eleve_id: event.target.value })} required>
                <option value="">Sélectionner</option>
                {eleves.map((eleve) => <option key={eleve.id} value={eleve.id}>{eleve.nom || eleve.name}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-[var(--text)]">
              Session / cours concerné
              <select className="h-11 rounded-lg border border-gray-200 px-3 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" value={form.session_id} onChange={(event) => setForm({ ...form, session_id: event.target.value })}>
                <option value="">Aucun</option>
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.cours?.nom || session.cours || `Session ${session.id}`} - {session.date || session.created_at || ''}
                  </option>
                ))}
              </select>
            </label>
            <Input label="Motif" value={form.motif} onChange={(event) => setForm({ ...form, motif: event.target.value })} required />
            <Button type="submit"><Send className="h-4 w-4" /> Envoyer la requête</Button>
          </form>
        </Card>
      )}
      <Table
        columns={[
          { key: 'eleve', label: 'Élève', render: (row) => row.eleve?.nom || row.eleve || row.nom },
          { key: 'session', label: 'Session', render: (row) => row.session?.cours?.nom || row.session_id || 'Non renseigné' },
          { key: 'motif', label: 'Motif' },
          { key: 'statut', label: 'Statut', render: (row) => <Badge status={normalizeStatus(row.statut)}>{row.statut}</Badge> },
          ...(canTreat ? [{
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => decide(row, 'approved')}>Approuver</Button>
                <Button size="sm" variant="ghost" onClick={() => decide(row, 'rejected')}>Rejeter</Button>
              </div>
            ),
          }] : []),
        ]}
        data={requests}
        isLoading={isLoading}
        emptyTitle="Aucune requête"
      />
    </div>
  )
}

function normalizeStatus(status) {
  if (status === 'en_attente') return 'pending'
  if (status === 'approuvee') return 'approved'
  if (status === 'rejetee') return 'rejected'
  return status || 'pending'
}
