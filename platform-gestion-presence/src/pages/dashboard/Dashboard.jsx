import {
  AlertTriangle,
  Bell,
  BookOpen,
  CalendarCheck,
  CalendarX,
  ClipboardList,
  FileText,
  Percent,
  QrCode,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getPresenceDashboard } from '../../api/presences'
import { useAsyncData } from '../../hooks/useAsyncData'
import { useAuth } from '../../hooks/useAuth'
import { Badge, Button, Card, EmptyState, StatCard, Table } from '../../components/ui'

export default function Dashboard() {
  const { user } = useAuth()
  const { data, isLoading } = useAsyncData(getPresenceDashboard, [])
  const role = (user?.role || 'admin').toLowerCase()

  if (role === 'parent') return <ParentDashboard data={data} isLoading={isLoading} />
  if (role === 'eleve') return <EleveDashboard data={data} isLoading={isLoading} />
  if (role === 'professeur') return <ProfDashboard data={data} isLoading={isLoading} />

  return <AdminDashboard data={data} isLoading={isLoading} />
}

function AdminDashboard({ data, isLoading }) {
  const stats = data?.stats || {}
  const weekly = data?.weekly || data?.presences_semaine || []
  const courses = data?.cours_du_jour || []
  const alerts = data?.alertes || data?.eleves_a_risque || []
  const latest = flattenLatest(data?.dernieres_donnees)

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Présents aujourd'hui" value={stats.presents ?? data?.presents_aujourd_hui} icon={Users} />
        <StatCard label="Absences du jour" value={stats.absences ?? data?.absences_aujourd_hui} icon={CalendarX} />
        <StatCard label="Cours en cours" value={stats.cours_en_cours ?? data?.cours_en_cours} icon={BookOpen} />
        <StatCard label="Taux de présence" value={formatPercent(stats.taux_presence ?? data?.taux_presence)} icon={Percent} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <WeeklyChart weekly={weekly} />
        <RiskAlerts alerts={alerts} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <QuickAction to="/presences/nouvelle" icon={CalendarCheck} title="Ouvrir une liste" text="Démarrer une session de présence." />
        <QuickAction to="/rapports" icon={FileText} title="Générer un rapport" text="Exporter les présences au format PDF." />
        <QuickAction to="/notifications" icon={Bell} title="Voir les alertes" text="Suivre les notifications envoyées aux parents." />
      </div>
      <LatestDataTable rows={latest} isLoading={isLoading} />
      <CoursesTable courses={courses} isLoading={isLoading} />
    </div>
  )
}

function ProfDashboard({ data, isLoading }) {
  const stats = data?.stats || {}
  const courses = data?.cours_du_jour || []
  const weekly = data?.weekly || data?.presences_semaine || []
  const latest = flattenLatest(data?.dernieres_donnees)

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Mes cours actifs" value={stats.cours_en_cours ?? data?.cours_en_cours} icon={BookOpen} />
        <StatCard label="Absences à traiter" value={stats.absences ?? data?.absences_aujourd_hui} icon={CalendarX} />
        <StatCard label="Taux du jour" value={formatPercent(stats.taux_presence ?? data?.taux_presence)} icon={Percent} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <QuickAction to="/presences/nouvelle" icon={CalendarCheck} title="Ouvrir la présence" text="Choisir la classe et le cours." />
        <QuickAction to="/presences/qr" icon={QrCode} title="QR Code" text="Afficher ou scanner un QR de session." />
        <QuickAction to="/requetes" icon={ClipboardList} title="Traiter les requêtes" text="Approuver ou rejeter les demandes." />
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <WeeklyChart weekly={weekly} />
        <CoursesTable courses={courses} isLoading={isLoading} />
      </div>
      <LatestDataTable rows={latest} isLoading={isLoading} />
    </div>
  )
}

function ParentDashboard({ data, isLoading }) {
  const parent = data?.parent || {}
  const absences = parent.absences || []

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Statut aujourd'hui" value={parent.status || 'À vérifier'} icon={CalendarCheck} />
        <StatCard label="Absences récentes" value={absences.length} icon={CalendarX} />
        <StatCard label="Notifications" value="Actives" icon={Bell} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <QuickAction to="/requetes" icon={ClipboardList} title="Contester une absence" text="Envoyer une justification ou une demande." />
        <QuickAction to="/permissions" icon={ShieldCheck} title="Permission d'absence" text="Déclarer une absence imprévue." />
      </div>
      <Table
        columns={[
          { key: 'date', label: 'Date' },
          { key: 'cours', label: 'Cours' },
          { key: 'motif', label: 'Motif' },
        ]}
        data={absences}
        isLoading={isLoading}
        emptyTitle="Aucune absence récente"
      />
    </div>
  )
}

function EleveDashboard({ data, isLoading }) {
  const courses = data?.cours_du_jour || []

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Présence aujourd'hui" value="À scanner" icon={QrCode} />
        <StatCard label="Cours du jour" value={courses.length} icon={BookOpen} />
        <StatCard label="Demandes" value="Ouvertes" icon={ClipboardList} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <QuickAction to="/presences/qr" icon={QrCode} title="Scanner un QR" text="Valider ma présence au cours." />
        <QuickAction to="/cours" icon={BookOpen} title="Voir le programme" text="Consulter mes horaires de classe." />
        <QuickAction to="/permissions" icon={ShieldCheck} title="Demander une permission" text="Soumettre une absence imprévue." />
      </div>
      <CoursesTable courses={courses} isLoading={isLoading} />
    </div>
  )
}

function WeeklyChart({ weekly }) {
  return (
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
  )
}

function RiskAlerts({ alerts }) {
  return (
    <Card>
      <h2 className="mb-4 text-lg font-bold text-[var(--text)]">Élèves à risque</h2>
      {alerts.length ? alerts.map((alert) => (
        <div key={alert.id} className="mb-3 flex items-center gap-3 rounded-xl bg-[var(--accent-soft)] p-3 text-sm font-medium text-[var(--primary)]">
          <AlertTriangle className="h-5 w-5" />
          {alert.nom || alert.name} - {alert.absences_consecutives} absences
        </div>
      )) : <EmptyState icon={AlertTriangle} title="Aucune alerte" description="Les absences successives seront signalées ici." />}
    </Card>
  )
}

function CoursesTable({ courses, isLoading }) {
  return (
    <Table
      columns={[
        { key: 'classe', label: 'Classe', render: (row) => row.classe?.nom || row.classe || row.classe_id || '--' },
        { key: 'cours', label: 'Cours', render: (row) => row.cours || row.nom || row.name || '--' },
        { key: 'heure', label: 'Heure', render: (row) => row.heure || row.heure_debut || '--' },
        { key: 'statut', label: 'Statut', render: (row) => <Badge status={row.statut === 'ouvert' ? 'open' : 'closed'} /> },
      ]}
      data={courses}
      isLoading={isLoading}
      emptyTitle="Aucun cours aujourd'hui"
    />
  )
}

function LatestDataTable({ rows, isLoading }) {
  return (
    <Table
      columns={[
        { key: 'type', label: 'Type' },
        { key: 'titre', label: 'Élément' },
        { key: 'detail', label: 'Détail' },
        { key: 'date', label: 'Ajouté le' },
      ]}
      data={rows}
      isLoading={isLoading}
      emptyTitle="Aucune donnée en base"
    />
  )
}

function flattenLatest(latest) {
  if (!latest) return []
  return [
    ...(latest.cours || []),
    ...(latest.requetes || []),
    ...(latest.permissions || []),
  ].sort((left, right) => String(right.date || '').localeCompare(String(left.date || '')))
}

function QuickAction({ to, icon: Icon, title, text }) {
  return (
    <Card className="p-0">
      <Link to={to} className="block p-5 transition duration-200 hover:bg-[#FAFAFA]">
        <span className="mb-4 inline-flex rounded-xl bg-[var(--accent-soft)] p-3 text-[var(--primary)]">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="text-base font-bold text-[var(--text)]">{title}</h3>
        <p className="mt-1 text-sm font-medium text-[var(--text-muted)]">{text}</p>
        <Button className="mt-4" size="sm" variant="secondary">Ouvrir</Button>
      </Link>
    </Card>
  )
}

function formatPercent(value) {
  return value === undefined || value === null ? '--' : `${value}%`
}
