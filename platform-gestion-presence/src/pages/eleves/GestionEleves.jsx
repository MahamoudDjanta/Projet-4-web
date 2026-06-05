import { useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Trash2, Trash } from 'lucide-react'
import { clearPresences } from '../../api/presences'
import { createEleve, deleteEleve, getEleves } from '../../api/eleves'
import { getClasses } from '../../api/classes'
import { useAsyncData } from '../../hooks/useAsyncData'
import { Button, Card, Input, Table } from '../../components/ui'

export default function GestionEleves() {
  const [form, setForm] = useState({ nom: '', email: '', classe_id: '' })
  const [refresh, setRefresh] = useState(0)
  const { data, isLoading } = useAsyncData(() => getEleves(), [refresh])
  const { data: classesData } = useAsyncData(getClasses, [])
  const students = data?.data || data || []
  const classes = classesData?.data || classesData || []

  async function submit(event) {
    event.preventDefault()
    await createEleve(form)
    toast.success('Élève créé')
    setForm({ nom: '', email: '', classe_id: '' })
    setRefresh((value) => value + 1)
  }

  async function remove(id) {
    await deleteEleve(id)
    toast.success('Élève supprimé')
    setRefresh((value) => value + 1)
  }

  async function clearAll() {
    if (!window.confirm('Confirmer la suppression de toutes les présences marquees ?')) return

    await clearPresences()
    toast.success('Toutes les présences ont été effacées')
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <Card>
        <form className="grid gap-4" onSubmit={submit}>
          <Input label="Nom complet" value={form.nom} onChange={(event) => setForm({ ...form, nom: event.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <label className="grid gap-2 text-sm font-medium text-[var(--text)]">
            Classe
            <select className="h-11 rounded-lg border border-gray-200 px-3 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" value={form.classe_id} onChange={(event) => setForm({ ...form, classe_id: event.target.value })} required>
              <option value="">Sélectionner</option>
              {classes.map((classe) => <option key={classe.id} value={classe.id}>{classe.nom}</option>)}
            </select>
          </label>
          <div className="grid gap-3">
            <Button type="submit"><Plus className="h-4 w-4" /> Ajouter</Button>
            <Button type="button" variant="danger" onClick={clearAll}><Trash className="h-4 w-4" /> Vider les présences</Button>
          </div>
        </form>
      </Card>
      <Table
        columns={[
          { key: 'nom', label: 'Élève', render: (row) => row.nom || row.name },
          { key: 'email', label: 'Email' },
          { key: 'classe', label: 'Classe', render: (row) => row.classe?.nom || row.classe || row.classe_id },
          { key: 'actions', label: '', render: (row) => <Button variant="ghost" size="sm" onClick={() => remove(row.id)} aria-label="Supprimer"><Trash2 className="h-4 w-4" /></Button> },
        ]}
        data={students}
        isLoading={isLoading}
        emptyTitle="Aucun élève"
      />
    </div>
  )
}
