import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/layout/Layout'
import { useAuth } from './hooks/useAuth'
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import ListePresence from './pages/presences/ListePresence'
import MarquageQR from './pages/presences/MarquageQR'
import MarquageManuel from './pages/presences/MarquageManuel'
import GestionCours from './pages/cours/GestionCours'
import Programme from './pages/cours/Programme'
import GestionEleves from './pages/eleves/GestionEleves'
import Notifications from './pages/notifications/Notifications'
import Permissions from './pages/permissions/Permissions'
import Rapports from './pages/rapports/Rapports'
import Requetes from './pages/requetes/Requetes'

function ProtectedRoute({ children }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          element={(
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          )}
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/presences/nouvelle" element={<ListePresence />} />
          <Route path="/presences/qr" element={<MarquageQR />} />
          <Route path="/presences/manuel" element={<MarquageManuel />} />
          <Route path="/cours" element={<GestionCours />} />
          <Route path="/cours/programme/:classeId" element={<Programme />} />
          <Route path="/eleves" element={<GestionEleves />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/requetes" element={<Requetes />} />
          <Route path="/permissions" element={<Permissions />} />
          <Route path="/rapports" element={<Rapports />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
    </>
  )
}
