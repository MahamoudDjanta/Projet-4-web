import { useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'
import { createUser, deleteUser, getUsers } from '../../api/users'
import { useAsyncData } from '../../hooks/useAsyncData'
import { Button, Card, Input, Table } from '../../components/ui'

const roles = [
  { value: 'professeur', label: 'Professeur' },
  { value: 'parent', label: 'Parent' },
]

export default function GestionUsers() {
  const [form, setForm] = useState({ name: '', email: '', role: 'professeur', password: '' })
  const [refresh, setRefresh] = useState(0)
  const { data, isLoading } = useAsyncData(() => getUsers({ role: form.role }), [refresh])
  const users = data?.data || data || []

  async function submit(event) {
    event.preventDefault()
    await createUser(form)
    toast.success('Utilisateur créé')
    setForm({ name: '', email: '', role: 'professeur', password: '' })
    setRefresh((value) => value + 1)
  }

  async function remove(id) {
    await deleteUser(id)
    toast.success('Utilisateur supprimé')
    setRefresh((value) => value + 1)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <Card>
        <form className="grid gap-4" onSubmit={submit}>
          <Input label="Nom complet" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <label className="grid gap-2 text-sm font-medium text-[var(--text)]">
            Role
            <select className="h-11 rounded-lg border border-gray-200 px-3 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
              {roles.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
            </select>
          </label>
          <Input label="Mot de passe" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Laisser vide pour password" />
          <Button type="submit"><Plus className="h-4 w-4" /> Ajouter</Button>
        </form>
      </Card>
      <Table
        columns={[
          { key: 'name', label: 'Nom', render: (row) => row.name },
          { key: 'email', label: 'Email', render: (row) => row.email },
          { key: 'role', label: 'Role', render: (row) => row.role },
          { key: 'actions', label: '', render: (row) => <Button variant="ghost" size="sm" onClick={() => remove(row.id)} aria-label="Supprimer"><Trash2 className="h-4 w-4" /></Button> },
        ]}
        data={users}
        isLoading={isLoading}
        emptyTitle="Aucun utilisateur"
      />
    </div>
  )
}
