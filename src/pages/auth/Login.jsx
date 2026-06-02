import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { roles } from '../../utils/roles'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', role: 'Admin' })

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      await login(form)
      toast.success('Connexion reussie')
      navigate('/dashboard')
    } catch {
      toast.error('Identifiants invalides')
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-white p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[var(--primary)] text-lg font-bold text-white">P</span>
          <h1 className="mt-5 text-2xl font-bold text-[var(--text)]">Plateforme Presence</h1>
          <p className="mt-2 text-sm font-medium text-[var(--text-muted)]">Connectez-vous a votre espace scolaire.</p>
        </div>
        <div className="grid gap-4">
          <Input label="Email" name="email" type="email" placeholder="admin@ecole.test" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <Input label="Mot de passe" name="password" type="password" placeholder="Votre mot de passe" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          <label className="grid gap-2 text-sm font-medium text-[var(--text)]">
            Role
            <select className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
              {roles.map((role) => <option key={role}>{role}</option>)}
            </select>
          </label>
          <Button type="submit" size="lg" disabled={isLoading}>
            <LogIn className="h-4 w-4" />
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </div>
      </form>
    </main>
  )
}
