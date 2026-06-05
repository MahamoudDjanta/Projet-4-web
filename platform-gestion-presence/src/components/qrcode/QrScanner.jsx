import { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import Badge from '../ui/Badge'

export default function QrScanner({ onScan }) {
  const scannerRef = useRef(null)
  const [status, setStatus] = useState('pending')

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 240 }, false)
    scannerRef.current.render(
      async (decodedText) => {
        try {
          await onScan(decodedText)
          setStatus('approved')
        } catch {
          setStatus('rejected')
        }
      },
      () => {},
    )

    return () => {
      scannerRef.current?.clear().catch(() => {})
    }
  }, [onScan])

  return (
    <div className="grid gap-4">
      <div id="qr-reader" className="overflow-hidden rounded-2xl border border-[var(--border)]" />
      <Badge status={status}>{status === 'approved' ? 'Scan reussi' : status === 'rejected' ? 'Scan refuse' : 'En attente du scan'}</Badge>
    </div>
  )
}
