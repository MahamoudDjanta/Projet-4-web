import { QRCodeSVG } from 'qrcode.react'
import Card from '../ui/Card'

export default function SessionQrCode({ value, title, subtitle }) {
  return (
    <Card className="grid place-items-center text-center">
      <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
        <QRCodeSVG value={value || 'pending-session'} size={240} fgColor="#111111" />
      </div>
      <h2 className="mt-5 text-xl font-bold text-[var(--text)]">{title}</h2>
      <p className="mt-1 text-sm font-medium text-[var(--text-muted)]">{subtitle}</p>
    </Card>
  )
}
