import { useState } from 'react'
import toast from 'react-hot-toast'
import { Send } from 'lucide-react'
import { createPermission, getPermissions } from '../../api/permissions'
import { useAsyncData } from '../../hooks/useAsyncData'
import { Badge, Button, Card, Input, Table } from '../../components/ui'

export default function Permissions() {
  const [refresh, setRefresh] = useState(0)
  const [form, setForm] = useState({ eleve_id: '', date_debut: '', date_fin: '', motif: '', fichier: null })
  const { data, isLoading } = useAsyncData(getPermissions, [refresh])
  const rows = data?.data || data || []

  async function submit(event) {
    event.preventDefault()
    const payload = new FormData()
    Object.entries(form).forEach(([key, value]) => value && payload.append(key, value))
    await createPermission(payload)
    toast.success('Permission soumise')
    setRefresh((value) => value + 1)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <Card>
        <form className="grid gap-4" onSubmit={submit}>
          <Input label="Eleve" value={form.eleve_id} onChange={(event) => setForm({ ...form, eleve_id: event.target.value })} required />
          <Input label="Date debut" type="date" value={form.date_debut} onChange={(event) => setForm({ ...form, date_debut: event.target.value })} required />
          <Input label="Date fin" type="date" value={form.date_fin} onChange={(event) => setForm({ ...form, date_fin: event.target.value })} required />
          <Input label="Motif" value={form.motif} onChange={(event) => setForm({ ...form, motif: event.target.value })} required />
          <Input label="Piece jointe" type="file" onChange={(event) => setForm({ ...form, fichier: event.target.files[0] })} />
          <Button type="submit"><Send className="h-4 w-4" /> Soumettre</Button>
        </form>
      </Card>
      <Table
        columns={[
          { key: 'eleve', label: 'Eleve', render: (row) => row.eleve?.nom || row.eleve || row.eleve_id },
          { key: 'dates', label: 'Dates', render: (row) => `${row.date_debut} - ${row.date_fin}` },
          { key: 'motif', label: 'Motif' },
          { key: 'statut', label: 'Statut', render: (row) => <Badge status={row.statut || 'pending'} /> },
        ]}
        data={rows}
        isLoading={isLoading}
        emptyTitle="Aucune permission"
      />
    </div>
  )
}
