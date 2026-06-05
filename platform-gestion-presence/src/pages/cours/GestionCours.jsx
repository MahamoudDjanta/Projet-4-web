import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'
import { createCours, deleteCours, getCours } from '../../api/cours'
import { getClasses } from '../../api/classes'
import { useAsyncData } from '../../hooks/useAsyncData'
import { useAuth } from '../../hooks/useAuth'
import { Button, Card, Input, Table } from '../../components/ui'

export default function GestionCours() {
  const { user } = useAuth()
  const role = (user?.role || '').toLowerCase()
  const canManage = ['admin', 'professeur'].includes(role)
  const [filters, setFilters] = useState({ classe_id: '' })
  const [form, setForm] = useState({ nom: '', classe_id: '', professeur: '' })
  const [refresh, setRefresh] = useState(0)
  const { data: classesData } = useAsyncData(getClasses, [])
  const { data, isLoading } = useAsyncData(() => getCours(filters), [filters.classe_id, refresh])
  const courses = data?.data || data || []
  const classes = classesData?.data || classesData || []
  const navigate = useNavigate()

  async function submit(event) {
    event.preventDefault()
    await createCours(form)
    toast.success('Cours créé')
    setForm({ nom: '', classe_id: '', professeur: '' })
    setRefresh((value) => value + 1)
  }

  async function remove(id) {
    await deleteCours(id)
    toast.success('Cours supprimé')
    setRefresh((value) => value + 1)
  }

  return (
    <div className={`grid gap-6 ${canManage ? 'xl:grid-cols-[360px_1fr]' : ''}`}>
      {canManage && (
        <Card>
          <form className="grid gap-4" onSubmit={submit}>
            <Input label="Nom du cours" name="nom" value={form.nom} onChange={(event) => setForm({ ...form, nom: event.target.value })} required />
            <label className="grid gap-2 text-sm font-medium text-[var(--text)]">
              Classe
              <select className="h-11 rounded-lg border border-gray-200 px-3 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" value={form.classe_id} onChange={(event) => setForm({ ...form, classe_id: event.target.value })} required>
                <option value="">Sélectionner</option>
                {classes.map((classe) => <option key={classe.id} value={classe.id}>{classe.nom}</option>)}
              </select>
            </label>
            <Input label="Professeur" name="professeur" value={form.professeur} onChange={(event) => setForm({ ...form, professeur: event.target.value })} />
            <Button type="submit"><Plus className="h-4 w-4" /> Créer le cours</Button>
          </form>
        </Card>
      )}
      <div className="grid gap-4">
        <label className="grid gap-2 text-sm font-medium text-[var(--text)]">
          {canManage ? 'Filtrer par classe' : 'Consulter le programme de la classe'}
          <select className="h-11 rounded-lg border border-gray-200 px-3 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" value={filters.classe_id} onChange={(event) => setFilters({ classe_id: event.target.value })}>
            <option value="">Toutes les classes</option>
            {classes.map((classe) => <option key={classe.id} value={classe.id}>{classe.nom}</option>)}
          </select>
        </label>
        {filters.classe_id && (
          <Button variant="secondary" onClick={() => navigate(`/cours/programme/${filters.classe_id}`)}>
            Voir le programme
          </Button>
        )}
        <Table
          columns={[
            { key: 'nom', label: 'Cours', render: (row) => row.nom || row.name },
            { key: 'classe', label: 'Classe', render: (row) => row.classe?.nom || row.classe || row.classe_id },
            { key: 'professeur', label: 'Professeur' },
            ...(canManage ? [{ key: 'actions', label: '', render: (row) => <Button variant="ghost" size="sm" onClick={() => remove(row.id)} aria-label="Supprimer"><Trash2 className="h-4 w-4" /></Button> }] : []),
          ]}
          data={courses}
          isLoading={isLoading}
          emptyTitle="Aucun cours"
        />
      </div>
    </div>
  )
}
