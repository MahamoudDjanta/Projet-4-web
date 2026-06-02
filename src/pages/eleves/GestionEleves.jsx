import { useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'
import { createEleve, deleteEleve, getEleves } from '../../api/eleves'
import { useAsyncData } from '../../hooks/useAsyncData'
import { Button, Card, Input, Table } from '../../components/ui'

export default function GestionEleves() {
  const [form, setForm] = useState({ nom: '', email: '', classe_id: '' })
  const [refresh, setRefresh] = useState(0)
  const { data, isLoading } = useAsyncData(() => getEleves(), [refresh])
  const students = data?.data || data || []

  async function submit(event) {
    event.preventDefault()
    await createEleve(form)
    toast.success('Eleve cree')
    setForm({ nom: '', email: '', classe_id: '' })
    setRefresh((value) => value + 1)
  }

  async function remove(id) {
    await deleteEleve(id)
    toast.success('Eleve supprime')
    setRefresh((value) => value + 1)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <Card>
        <form className="grid gap-4" onSubmit={submit}>
          <Input label="Nom complet" value={form.nom} onChange={(event) => setForm({ ...form, nom: event.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <Input label="Classe" value={form.classe_id} onChange={(event) => setForm({ ...form, classe_id: event.target.value })} required />
          <Button type="submit"><Plus className="h-4 w-4" /> Ajouter</Button>
        </form>
      </Card>
      <Table
        columns={[
          { key: 'nom', label: 'Eleve', render: (row) => row.nom || row.name },
          { key: 'email', label: 'Email' },
          { key: 'classe', label: 'Classe', render: (row) => row.classe?.nom || row.classe || row.classe_id },
          { key: 'actions', label: '', render: (row) => <Button variant="ghost" size="sm" onClick={() => remove(row.id)} aria-label="Supprimer"><Trash2 className="h-4 w-4" /></Button> },
        ]}
        data={students}
        isLoading={isLoading}
        emptyTitle="Aucun eleve"
      />
    </div>
  )
}
