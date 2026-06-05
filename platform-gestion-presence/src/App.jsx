import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ShieldAlert } from 'lucide-react'
import Layout from './components/layout/Layout'
import { useAuth } from './hooks/useAuth'
import { Button, EmptyState } from './components/ui'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import ListePresence from './pages/presences/ListePresence'
import MarquageQR from './pages/presences/MarquageQR'
import MarquageManuel from './pages/presences/MarquageManuel'
import SessionList from './pages/presences/Sessions'
import SessionDetail from './pages/presences/SessionDetail'
import GestionCours from './pages/cours/GestionCours'
import Programme from './pages/cours/Programme'
import GestionEleves from './pages/eleves/GestionEleves'
import Notifications from './pages/notifications/Notifications'
import Permissions from './pages/permissions/Permissions'
import Rapports from './pages/rapports/Rapports'
import Requetes from './pages/requetes/Requetes'
import GestionUsers from './pages/users/GestionUsers'

function ProtectedRoute({ children }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

function RoleRoute({ roles, children }) {
  const { user } = useAuth()
  const role = (user?.role || '').toLowerCase()

  if (!roles.includes(role)) return <AccessDenied />
  return children
}

function AccessDenied() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="grid gap-4 text-center">
        <EmptyState
          icon={ShieldAlert}
          title="Acces refuse"
          description="Cette interface n'est pas disponible pour votre role."
        />
        <Button onClick={() => window.history.back()} variant="secondary">Retour</Button>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          element={(
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          )}
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/presences/nouvelle" element={<RoleRoute roles={['admin', 'professeur']}><ListePresence /></RoleRoute>} />
          <Route path="/presences/sessions" element={<RoleRoute roles={['admin', 'professeur']}><SessionList /></RoleRoute>} />
          <Route path="/presences/sessions/:sessionId" element={<RoleRoute roles={['admin', 'professeur']}><SessionDetail /></RoleRoute>} />
          <Route path="/presences/qr" element={<RoleRoute roles={['admin', 'professeur', 'eleve']}><MarquageQR /></RoleRoute>} />
          <Route path="/presences/manuel" element={<RoleRoute roles={['admin', 'professeur']}><MarquageManuel /></RoleRoute>} />
          <Route path="/cours" element={<GestionCours />} />
          <Route path="/cours/programme/:classeId?" element={<Programme />} />
          <Route path="/eleves" element={<RoleRoute roles={['admin', 'professeur']}><GestionEleves /></RoleRoute>} />
          <Route path="/notifications" element={<RoleRoute roles={['admin', 'parent', 'eleve']}><Notifications /></RoleRoute>} />
          <Route path="/requetes" element={<Requetes />} />
          <Route path="/users" element={<RoleRoute roles={['admin']}><GestionUsers /></RoleRoute>} />
          <Route path="/permissions" element={<Permissions />} />
          <Route path="/rapports" element={<RoleRoute roles={['admin', 'professeur']}><Rapports /></RoleRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
    </>
  )
}
