import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Check, QrCode } from 'lucide-react'
import { closePresenceSession, createPresenceSession } from '../../api/presences'
import { getEleves } from '../../api/eleves'
import { getCours } from '../../api/cours'
import { useAsyncData } from '../../hooks/useAsyncData'
import ManualAttendanceList from '../../components/presence/ManualAttendanceList'
import SessionQrCode from '../../components/qrcode/SessionQrCode'
import { Button, Card, EmptyState, Input } from '../../components/ui'

export default function ListePresence() {
  const [form, setForm] = useState({ classe_id: '', cours_id: '', mode: 'qr' })
  const [session, setSession] = useState(null)
  const [selected, setSelected] = useState({})
  const { data: studentsData } = useAsyncData(() => getEleves({ classe_id: form.classe_id }), [form.classe_id])
  const { data: coursData } = useAsyncData(() => getCours({ classe_id: form.classe_id }), [form.classe_id])
  const students = useMemo(() => studentsData?.data || studentsData || [], [studentsData])
  const courses = useMemo(() => coursData?.data || coursData || [], [coursData])
  const presentCount = Object.values(selected).filter(Boolean).length

  async function openSession(event) {
    event.preventDefault()
    const { data } = await createPresenceSession(form)
    setSession({
      ...data,
      local_token: `${data.id || 'session'}-${Date.now()}`,
      opened_at: new Date().toLocaleTimeString(),
    })
    toast.success('Liste ouverte')
  }

  async function closeSession() {
    await closePresenceSession(session.id)
    toast.success('Liste cloturee')
    setSession(null)
    setSelected({})
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <Card>
        <form className="grid gap-4" onSubmit={openSession}>
          <Input label="Classe" name="classe_id" placeholder="ID de classe" value={form.classe_id} onChange={(event) => setForm({ ...form, classe_id: event.target.value })} required />
          <label className="grid gap-2 text-sm font-medium text-[var(--text)]">
            Cours
            <select className="h-11 rounded-lg border border-gray-200 px-3 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" value={form.cours_id} onChange={(event) => setForm({ ...form, cours_id: event.target.value })} required>
              <option value="">Selectionner</option>
              {courses.map((course) => <option key={course.id} value={course.id}>{course.nom || course.name}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#FAFAFA] p-1">
            {['qr', 'manuel'].map((mode) => (
              <button key={mode} type="button" onClick={() => setForm({ ...form, mode })} className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${form.mode === mode ? 'bg-white text-[var(--primary)] shadow-sm' : 'text-[var(--text-muted)]'}`}>
                {mode === 'qr' ? 'QR Code' : 'Manuel'}
              </button>
            ))}
          </div>
          <Button type="submit"><QrCode className="h-4 w-4" /> Ouvrir la liste</Button>
        </form>
      </Card>
      <div className="grid gap-4">
        <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-muted)]">Presents / total</p>
            <strong className="text-2xl font-bold text-[var(--primary)]">{presentCount} / {students.length}</strong>
          </div>
          <Button variant="danger" disabled={!session} onClick={closeSession}><Check className="h-4 w-4" /> Cloturer la liste</Button>
        </Card>
        {!session ? (
          <EmptyState title="Aucune liste ouverte" description="Selectionnez une classe et un cours pour commencer." />
        ) : form.mode === 'qr' ? (
          <SessionQrCode value={session.qr_token || session.local_token} title={session.cours?.nom || 'Session de presence'} subtitle={session.opened_at} />
        ) : (
          <ManualAttendanceList students={students} selected={selected} onToggle={(id) => setSelected({ ...selected, [id]: !selected[id] })} />
        )}
      </div>
    </div>
  )
}
