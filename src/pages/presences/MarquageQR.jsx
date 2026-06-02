import { useCallback, useState } from 'react'
import { scanQrPresence } from '../../api/presences'
import QrScanner from '../../components/qrcode/QrScanner'
import SessionQrCode from '../../components/qrcode/SessionQrCode'
import { Card } from '../../components/ui'

export default function MarquageQR() {
  const [token] = useState(() => `presence-${Date.now()}`)
  const handleScan = useCallback((decodedText) => scanQrPresence({ token: decodedText }), [])

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <SessionQrCode value={token} title="QR Code de session" subtitle="Identifiant unique genere pour le cours en cours" />
      <Card>
        <h2 className="mb-4 text-lg font-bold text-[var(--text)]">Scan cote eleve</h2>
        <QrScanner onScan={handleScan} />
      </Card>
    </div>
  )
}
