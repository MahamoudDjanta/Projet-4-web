import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getSessionQrToken, getSessions, scanQrPresence } from '../../api/presences'
import { useAuth } from '../../hooks/useAuth'
import { useAsyncData } from '../../hooks/useAsyncData'
import QrScanner from '../../components/qrcode/QrScanner'
import SessionQrCode from '../../components/qrcode/SessionQrCode'
import { Card, EmptyState, Input } from '../../components/ui'

export default function MarquageQR() {
  const { user } = useAuth()
  const role = (user?.role || '').toLowerCase()
  const location = useLocation()
  const navigate = useNavigate()
  const initialSessionId = useMemo(() => new URLSearchParams(location.search).get('sessionId') || '', [location.search])
  const [eleveId, setEleveId] = useState(user?.eleve_id || '')
  const [sessionId, setSessionId] = useState(initialSessionId)
  const [sessionInfo, setSessionInfo] = useState(null)
  const [sessionToken, setSessionToken] = useState('')
  const { data: sessionsData, isLoading: sessionsLoading } = useAsyncData(getSessions, [])

  const openSessions = useMemo(() => {
    const sessions = sessionsData?.data || sessionsData || []
    return sessions.filter((item) => ['ouvert', 'ouverte'].includes((item.statut || '').toLowerCase()))
  }, [sessionsData])

  const handleSessionChange = (event) => {
    const value = event.target.value
    setSessionId(value)
    navigate(value ? `/presences/qr?sessionId=${value}` : '/presences/qr', { replace: true })
  }

  useEffect(() => {
    if (!sessionId) {
      setSessionInfo(null)
      setSessionToken('')
      return
    }

    let active = true
    const loadSessionToken = async () => {
      try {
        const { data } = await getSessionQrToken(sessionId)
        if (!active) return
        setSessionInfo(data)
        setSessionToken(data.qr_token)
        toast.success('Jeton QR charge')
      } catch (error) {
        if (!active) return
        setSessionInfo(null)
        setSessionToken('')
        toast.error('Impossible de charger le QR Code de la session.')
      }
    }

    loadSessionToken()

    return () => {
      active = false
    }
  }, [sessionId])

  const handleScan = useCallback(async (decodedText) => {
    if (!eleveId) {
      toast.error('Veuillez saisir votre identifiant élève avant de scanner.')
      throw new Error('ID élève requis')
    }

    try {
      await scanQrPresence({ qr_token: decodedText, eleve_id: Number(eleveId) })
      toast.success('Présence enregistrée')
    } catch (error) {
      toast.error('Échec du scan. Vérifiez le QR Code et votre ID élève.')
      throw error
    }
  }, [eleveId])

  if (role === 'eleve') {
    return (
      <div className="mx-auto grid max-w-2xl gap-6">
        <Card>
          <h2 className="mb-4 text-lg font-bold text-[var(--text)]">Scanner ma présence</h2>
          <div className="mb-4">
            <Input label="Mon ID élève" value={eleveId} onChange={(event) => setEleveId(event.target.value)} placeholder="Ex: 1" required />
          </div>
          {eleveId ? (
            <QrScanner onScan={handleScan} />
          ) : (
            <EmptyState title="Saisissez votre identifiant" description="Entrez votre ID élève pour activer le scanner." />
          )}
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <div className="grid gap-4">
        <Card>
          <h2 className="mb-4 text-lg font-bold text-[var(--text)]">QR Code de session</h2>
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-[var(--text)]">
              Session ouverte
              <select
                value={sessionId}
                onChange={handleSessionChange}
                disabled={sessionsLoading}
                className="h-11 rounded-lg border border-gray-200 px-3 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="">Sélectionner une session</option>
                {openSessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.cours?.nom || `Session ${session.id}`} - {session.cours?.classe?.nom || session.cours?.classe || session.classe_id}
                  </option>
                ))}
              </select>
            </label>
            {sessionInfo && (
              <div className="rounded-2xl border border-gray-200 p-4 bg-white">
                <p className="text-sm text-[var(--text-muted)]">Cours</p>
                <p className="font-semibold">{sessionInfo.cours}</p>
                <p className="text-sm text-[var(--text-muted)]">Classe</p>
                <p className="font-semibold">{sessionInfo.classe}</p>
              </div>
            )}
            {!sessionId && (
              <EmptyState title="Choisissez une session" description="Sélectionnez une session ouverte pour afficher son QR Code." />
            )}
          </div>
        </Card>
        {sessionToken && (
          <SessionQrCode value={sessionToken} title="Session ouverte" subtitle={sessionInfo?.cours || 'QR Code de session'} />
        )}
      </div>
      <Card>
        <h2 className="mb-4 text-lg font-bold text-[var(--text)]">Contrôle scan</h2>
        <p className="text-sm font-medium text-[var(--text-muted)]">Les élèves utilisent leur espace pour scanner le QR Code de la session. Ce composant sert de vue de session ouverte.</p>
      </Card>
    </div>
  )
}
