import { useState } from 'react'
import toast from 'react-hot-toast'
import { Send } from 'lucide-react'
import { createPermission, getPermissions, updatePermission } from '../../api/permissions'
import { getEleves } from '../../api/eleves'
import { useAsyncData } from '../../hooks/useAsyncData'
import { useAuth } from '../../hooks/useAuth'
import { Badge, Button, Card, Input, Table } from '../../components/ui'

export default function Permissions() {
  const { user } = useAuth()
  const role = (user?.role || '').toLowerCase()
  const canReview = ['admin', 'professeur'].includes(role)
  const defaultEleveId = user?.eleve_id || user?.enfants?.[0]?.id || ''
  const [refresh, setRefresh] = useState(0)
  const [form, setForm] = useState({ eleve_id: defaultEleveId, date_debut: '', date_fin: '', motif: '', piece_jointe: null })
  const { data, isLoading } = useAsyncData(getPermissions, [refresh])
  const { data: elevesData } = useAsyncData(getEleves, [])
  const rows = data?.data || data || []
  const eleves = elevesData?.data || elevesData || []

  async function submit(event) {
    event.preventDefault()
    const payload = new FormData()
    Object.entries(form).forEach(([key, value]) => value && payload.append(key, value))
    await createPermission(payload)
    toast.success('Permission soumise')
    setRefresh((value) => value + 1)
  }

  async function decide(row, statut) {
    await updatePermission(row.id, { statut })
    toast.success('Statut de permission mis à jour')
    setRefresh((value) => value + 1)
  }

  return (
    <div className={`grid gap-6 ${canReview ? '' : 'xl:grid-cols-[360px_1fr]'}`}>
      {!canReview && (
        <Card>
          <form className="grid gap-4" onSubmit={submit}>
            <label className="grid gap-2 text-sm font-medium text-[var(--text)]">
              Élève
              <select className="h-11 rounded-lg border border-gray-200 px-3 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" value={form.eleve_id} onChange={(event) => setForm({ ...form, eleve_id: event.target.value })} required>
                <option value="">Sélectionner</option>
                {eleves.map((eleve) => <option key={eleve.id} value={eleve.id}>{eleve.nom || eleve.name}</option>)}
              </select>
            </label>
            <Input label="Date de début" type="date" value={form.date_debut} onChange={(event) => setForm({ ...form, date_debut: event.target.value })} required />
            <Input label="Date de fin" type="date" value={form.date_fin} onChange={(event) => setForm({ ...form, date_fin: event.target.value })} required />
            <Input label="Motif" value={form.motif} onChange={(event) => setForm({ ...form, motif: event.target.value })} required />
            <Input label="Pièce jointe" type="file" onChange={(event) => setForm({ ...form, piece_jointe: event.target.files[0] })} />
            <Button type="submit"><Send className="h-4 w-4" /> Soumettre</Button>
          </form>
        </Card>
      )}
      <Table
        columns={[
          { key: 'eleve', label: 'Élève', render: (row) => row.eleve?.nom || row.eleve || row.eleve_id },
          { key: 'dates', label: 'Dates', render: (row) => `${row.date_debut} - ${row.date_fin}` },
          { key: 'motif', label: 'Motif' },
          { key: 'statut', label: 'Statut', render: (row) => <Badge status={normalizePermissionStatus(row.statut)} /> },
          ...(canReview ? [{
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => decide(row, 'accorde')}>Accorder</Button>
                <Button size="sm" variant="ghost" onClick={() => decide(row, 'refuse')}>Refuser</Button>
              </div>
            ),
          }] : []),
        ]}
        data={rows}
        isLoading={isLoading}
        emptyTitle="Aucune permission"
      />
    </div>
  )
}

function normalizePermissionStatus(status) {
  if (!status) return 'pending'
  return ['soumis', 'examine', 'accorde', 'refuse'].includes(status) ? status : 'pending'
}
