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

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/presences/nouvelle', label: 'Presence', icon: CalendarCheck },
  { to: '/presences/qr', label: 'QR Code', icon: ClipboardList },
  { to: '/cours', label: 'Cours', icon: BookOpen },
  { to: '/eleves', label: 'Eleves', icon: GraduationCap },
  { to: '/notifications', label: 'Notifications', icon: Bell, badge: true },
  { to: '/requetes', label: 'Requetes', icon: Users, badge: true },
  { to: '/permissions', label: 'Permissions', icon: ShieldCheck },
  { to: '/rapports', label: 'Rapports', icon: FileText },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 border-r border-[var(--border)] bg-[#FAFAFA] transition duration-200 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between border-b border-[var(--border)] px-5">
          <NavLink to="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--primary)] font-bold text-white">P</span>
            <span className="text-sm font-bold text-[var(--text)]">Presence</span>
          </NavLink>
          <button className="rounded-lg p-2 text-[var(--text-muted)] lg:hidden" onClick={onClose} aria-label="Fermer le menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="grid gap-1 p-3">
          {items.map(({ to, label, icon: Icon, badge }) => (
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
