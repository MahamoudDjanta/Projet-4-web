import { Bell, LogOut, Menu } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'

const titles = {
  '/dashboard': 'Dashboard',
  '/presences/nouvelle': 'Ouverture de presence',
  '/presences/qr': 'Marquage QR Code',
  '/cours': 'Gestion des cours',
  '/eleves': 'Gestion des eleves',
  '/notifications': 'Notifications',
  '/requetes': 'Requetes de presence',
  '/permissions': 'Demandes de permission',
  '/rapports': 'Rapports PDF',
}

export default function Header({ onMenu }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const title = titles[pathname] || (pathname.startsWith('/cours/programme') ? 'Programme de classe' : 'Presence')

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[var(--border)] bg-white px-4 shadow-sm lg:px-6">
      <div className="flex items-center gap-3">
        <button className="rounded-lg p-2 text-[var(--text-muted)] lg:hidden" onClick={onMenu} aria-label="Ouvrir le menu">
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold text-[var(--text)]">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--primary)]" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--primary)]" />
        </button>
        <Avatar name={user?.name || user?.nom || 'Utilisateur'} />
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-[var(--text)]">{user?.name || user?.nom || 'Utilisateur'}</p>
          <p className="text-xs font-medium text-[var(--text-muted)]">{user?.role || 'Admin'}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} aria-label="Deconnexion">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
