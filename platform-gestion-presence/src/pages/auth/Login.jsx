import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function Login() {
  const navigate = useNavigate()
  const { login, logout, isLoading } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [selectedRole, setSelectedRole] = useState('')

  function quickLogin(role) {
    setSelectedRole(role)
    toast.success(`Rôle ${role} sélectionné. Saisissez vos identifiants et appuyez sur Se connecter.`)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!selectedRole) {
      toast.error('Veuillez sélectionner un rôle avant de vous connecter.')
      return
    }

    try {
      const user = await login(form)
      if (user.role !== selectedRole) {
        await logout()
        toast.error(`Ce compte n'est pas un ${selectedRole}.`) 
        return
      }
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
          <p className="mt-4 text-sm text-[var(--text-muted)]">
            Pas encore de compte ? <Link to="/register" className="font-semibold text-[var(--primary)] hover:underline">Inscrivez-vous</Link>
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            <Button type="button" size="sm" variant={selectedRole === 'admin' ? 'primary' : 'secondary'} onClick={() => quickLogin('admin')}>Admin</Button>
            <Button type="button" size="sm" variant={selectedRole === 'professeur' ? 'primary' : 'secondary'} onClick={() => quickLogin('professeur')}>Professeur</Button>
            <Button type="button" size="sm" variant={selectedRole === 'parent' ? 'primary' : 'secondary'} onClick={() => quickLogin('parent')}>Parent</Button>
            <Button type="button" size="sm" variant={selectedRole === 'eleve' ? 'primary' : 'secondary'} onClick={() => quickLogin('eleve')}>Élève</Button>
          </div>
        </div>
        <div className="grid gap-4">
          <Input label="Email" name="email" type="email" placeholder="admin@ecole.test" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <Input label="Mot de passe" name="password" type="password" placeholder="Votre mot de passe" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          <Button type="submit" size="lg" disabled={isLoading}>
            <LogIn className="h-4 w-4" />
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </div>
      </form>
    </main>
  )
}
