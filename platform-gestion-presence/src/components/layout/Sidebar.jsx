import { NavLink } from 'react-router-dom'
import {
  Bell,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutDashboard,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const items = [
  { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard, roles: ['admin', 'professeur', 'parent', 'eleve'] },
  { to: '/presences/nouvelle', label: 'Ouvrir présence', icon: CalendarCheck, roles: ['admin', 'professeur'] },
  { to: '/presences/sessions', label: 'Sessions', icon: ClipboardList, roles: ['admin', 'professeur'] },
  { to: '/presences/qr', label: 'Scanner QR', icon: ClipboardList, roles: ['admin', 'professeur', 'eleve'] },
  { to: '/cours', label: 'Cours', icon: BookOpen, roles: ['admin', 'professeur', 'parent', 'eleve'] },
  { to: '/eleves', label: 'Élèves', icon: GraduationCap, roles: ['admin', 'professeur'] },
  { to: '/notifications', label: 'Notifications', icon: Bell, badge: true, roles: ['admin', 'parent', 'eleve'] },
  { to: '/requetes', label: 'Requêtes', icon: Users, badge: true, roles: ['admin', 'professeur', 'parent', 'eleve'] },
  { to: '/users', label: 'Utilisateurs', icon: Users, roles: ['admin'] },
  { to: '/permissions', label: 'Permissions', icon: ShieldCheck, roles: ['admin', 'professeur', 'parent', 'eleve'] },
  { to: '/rapports', label: 'Rapports', icon: FileText, roles: ['admin', 'professeur'] },
]

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth()
  const role = (user?.role || 'admin').toLowerCase()
  const visibleItems = items.filter((item) => item.roles.includes(role))

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 border-r border-[var(--border)] bg-[#FAFAFA] transition duration-200 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between border-b border-[var(--border)] px-5 bg-gradient-to-r from-[#ffe4e6] via-white to-[#eff6ff]">
          <NavLink to="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--primary)] font-bold text-white">P</span>
            <span className="text-sm font-bold text-[var(--text)]">Présence</span>
          </NavLink>
          <button className="rounded-lg p-2 text-[var(--text-muted)] lg:hidden" onClick={onClose} aria-label="Fermer le menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="grid gap-1 p-3">
          {visibleItems.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition duration-200 ${
                  isActive
                    ? 'bg-[var(--accent-soft)] text-[var(--primary)]'
                    : 'text-[var(--text-muted)] hover:bg-white hover:text-[var(--text)]'
                }`
              }
            >
              <span className="flex items-center gap-3">
                <Icon className="h-5 w-5" aria-hidden="true" />
                {label}
              </span>
              {badge && <span className="h-2 w-2 rounded-full bg-[var(--primary)]" aria-label="Nouveau" />}
            </NavLink>
          ))}
        </nav>
      </aside>
      {open && <button className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={onClose} aria-label="Fermer le menu" />}
    </>
  )
}
