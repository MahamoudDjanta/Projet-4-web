import { useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'
import { createCours, deleteCours, getCours } from '../../api/cours'
import { useAsyncData } from '../../hooks/useAsyncData'
import { Button, Card, Input, Table } from '../../components/ui'

export default function GestionCours() {
  const [filters, setFilters] = useState({ classe_id: '' })
  const [form, setForm] = useState({ nom: '', classe_id: '', professeur: '' })
  const [refresh, setRefresh] = useState(0)
  const { data, isLoading } = useAsyncData(() => getCours(filters), [filters.classe_id, refresh])
  const courses = data?.data || data || []

  async function submit(event) {
    event.preventDefault()
    await createCours(form)
    toast.success('Cours cree')
    setForm({ nom: '', classe_id: '', professeur: '' })
    setRefresh((value) => value + 1)
  }

  async function remove(id) {
    await deleteCours(id)
    toast.success('Cours supprime')
    setRefresh((value) => value + 1)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <Card>
        <form className="grid gap-4" onSubmit={submit}>
          <Input label="Nom du cours" name="nom" value={form.nom} onChange={(event) => setForm({ ...form, nom: event.target.value })} required />
          <Input label="Classe" name="classe_id" value={form.classe_id} onChange={(event) => setForm({ ...form, classe_id: event.target.value })} required />
          <Input label="Professeur" name="professeur" value={form.professeur} onChange={(event) => setForm({ ...form, professeur: event.target.value })} />
          <Button type="submit"><Plus className="h-4 w-4" /> Creer le cours</Button>
        </form>
      </Card>
      <div className="grid gap-4">
        <Input label="Filtrer par classe" value={filters.classe_id} onChange={(event) => setFilters({ classe_id: event.target.value })} placeholder="ID de classe" />
        <Table
          columns={[
            { key: 'nom', label: 'Cours', render: (row) => row.nom || row.name },
            { key: 'classe', label: 'Classe', render: (row) => row.classe?.nom || row.classe || row.classe_id },
            { key: 'professeur', label: 'Professeur' },
            { key: 'actions', label: '', render: (row) => <Button variant="ghost" size="sm" onClick={() => remove(row.id)} aria-label="Supprimer"><Trash2 className="h-4 w-4" /></Button> },
          ]}
          data={courses}
          isLoading={isLoading}
          emptyTitle="Aucun cours"
        />
      </div>
    </div>
  )
}
