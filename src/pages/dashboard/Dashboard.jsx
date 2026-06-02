import { AlertTriangle, BookOpen, CalendarX, Percent, Users } from 'lucide-react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getPresenceDashboard } from '../../api/presences'
import { useAsyncData } from '../../hooks/useAsyncData'
import { useAuth } from '../../hooks/useAuth'
import { Badge, Card, EmptyState, StatCard, Table } from '../../components/ui'

export default function Dashboard() {
  const { user } = useAuth()
  const { data, isLoading } = useAsyncData(getPresenceDashboard, [])
  const role = user?.role || 'Admin'
  const stats = data?.stats || {}
  const weekly = data?.weekly || []
  const courses = data?.cours_du_jour || data?.courses || []
  const alerts = data?.alertes || []
  const parent = data?.parent || {}

  if (role === 'Parent') {
    return (
      <div className="grid gap-6">
        <Card>
          <p className="text-sm font-medium text-[var(--text-muted)]">Presence aujourd'hui</p>
          <strong className="mt-3 block text-3xl font-bold text-[var(--primary)]">{parent.status || '--'}</strong>
        </Card>
        <Table columns={[{ key: 'date', label: 'Date' }, { key: 'cours', label: 'Cours' }, { key: 'motif', label: 'Motif' }]} data={parent.absences || []} isLoading={isLoading} emptyTitle="Aucune absence recente" />
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Presents aujourd'hui" value={stats.presents} icon={Users} />
        <StatCard label="Absences du jour" value={stats.absences} icon={CalendarX} />
        <StatCard label="Cours en cours" value={stats.cours_en_cours} icon={BookOpen} />
        <StatCard label="Taux de presence" value={stats.taux_presence ? `${stats.taux_presence}%` : '--'} icon={Percent} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <h2 className="mb-4 text-lg font-bold text-[var(--text)]">Taux hebdomadaire</h2>
          {weekly.length ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekly}>
                  <XAxis dataKey="jour" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="taux" fill="#E8002D" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <EmptyState title="Aucune statistique" description="Le graphique apparaitra apres synchronisation API." />}
        </Card>
        <Card>
          <h2 className="mb-4 text-lg font-bold text-[var(--text)]">Eleves a risque</h2>
          {alerts.length ? alerts.map((alert) => (
            <div key={alert.id} className="mb-3 flex items-center gap-3 rounded-xl bg-[var(--accent-soft)] p-3 text-sm font-medium text-[var(--primary)]">
              <AlertTriangle className="h-5 w-5" />
              {alert.nom || alert.name} - {alert.absences_consecutives} absences
            </div>
          )) : <EmptyState icon={AlertTriangle} title="Aucune alerte" description="Les absences successives seront signalees ici." />}
        </Card>
      </div>
      <Table
        columns={[
          { key: 'classe', label: 'Classe' },
          { key: 'cours', label: 'Cours' },
          { key: 'heure', label: 'Heure' },
          { key: 'statut', label: 'Statut', render: (row) => <Badge status={row.statut === 'ouvert' ? 'open' : 'closed'} /> },
        ]}
        data={courses}
        isLoading={isLoading}
        emptyTitle="Aucun cours aujourd'hui"
      />
    </div>
  )
}
