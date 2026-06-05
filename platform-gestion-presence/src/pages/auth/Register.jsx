import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'professeur', label: 'Professeur' },
  { value: 'parent', label: 'Parent' },
  { value: 'eleve', label: 'Élève' },
]

export default function Register() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuth()
  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'eleve',
  })

  async function handleSubmit(event) {
    event.preventDefault()

    if (form.password !== form.password_confirmation) {
      toast.error('La confirmation du mot de passe ne correspond pas.')
      return
    }

    try {
      await register(form)
      toast.success('Inscription réussie')
      navigate('/dashboard')
    } catch (error) {
      const response = error?.response?.data
      const message = response?.message || 'Impossible de créer le compte'
      const validationErrors = response?.errors
      const firstError = validationErrors && Object.values(validationErrors).flat()[0]
      toast.error(firstError || message)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-white p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[var(--primary)] text-lg font-bold text-white">P</span>
          <h1 className="mt-5 text-2xl font-bold text-[var(--text)]">Créer un compte</h1>
          <p className="mt-2 text-sm font-medium text-[var(--text-muted)]">Inscrivez-vous pour accéder à la plateforme selon votre rôle.</p>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            Vous avez déjà un compte ? <Link to="/login" className="font-semibold text-[var(--primary)] hover:underline">Connectez-vous</Link>
          </p>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Prénom" name="prenom" type="text" placeholder="Votre prénom" value={form.prenom} onChange={(event) => setForm({ ...form, prenom: event.target.value })} required />
            <Input label="Nom" name="nom" type="text" placeholder="Votre nom" value={form.nom} onChange={(event) => setForm({ ...form, nom: event.target.value })} required />
          </div>

          <Input label="Email" name="email" type="email" placeholder="adresse@example.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <Input label="Mot de passe" name="password" type="password" placeholder="Votre mot de passe" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required minLength={8} />
          <Input label="Confirmation du mot de passe" name="password_confirmation" type="password" placeholder="Confirmez votre mot de passe" value={form.password_confirmation} onChange={(event) => setForm({ ...form, password_confirmation: event.target.value })} required minLength={8} />

          <label className="grid gap-2 text-sm font-medium text-[var(--text)]">
            Rôle
            <select
              name="role"
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value })}
              className="h-12 rounded-2xl border border-[var(--border)] bg-white/95 px-4 text-sm text-[var(--text)] shadow-[0_18px_40px_rgba(15,23,42,0.05)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(232,0,45,0.16)]"
            >
              {roles.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading ? 'Inscription...' : 'S’inscrire'}
          </Button>
        </div>
      </form>
    </main>
  )
}
