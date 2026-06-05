const styles = {
  present: 'bg-[#ECFDF3] text-[#067647]',
  absent: 'bg-[var(--accent-soft)] text-[var(--primary)]',
  late: 'bg-[#FFF7ED] text-[#C2410C]',
  pending: 'bg-[#FAFAFA] text-[var(--text-muted)]',
  approved: 'bg-[#ECFDF3] text-[#067647]',
  rejected: 'bg-[var(--accent-soft)] text-[var(--primary)]',
  open: 'bg-[#ECFDF3] text-[#067647]',
  closed: 'bg-[#FAFAFA] text-[var(--text-muted)]',
  soumis: 'bg-[#FAFAFA] text-[var(--text-muted)]',
  examine: 'bg-[#FAFAFA] text-[var(--text-muted)]',
  accorde: 'bg-[#ECFDF3] text-[#067647]',
  refuse: 'bg-[var(--accent-soft)] text-[var(--primary)]',
  envoye: 'bg-[#ECFDF3] text-[#067647]',
  echec: 'bg-[var(--accent-soft)] text-[var(--primary)]',
  cloturee: 'bg-[#FAFAFA] text-[var(--text-muted)]',
}

const labels = {
  present: 'Présent',
  absent: 'Absent',
  late: 'Retard',
  pending: 'En attente',
  approved: 'Approuvée',
  rejected: 'Rejetée',
  open: 'Ouvert',
  closed: 'Fermé',
  soumis: 'Soumis',
  examine: 'En examen',
  accorde: 'Accordée',
  refuse: 'Refusé',
  envoye: 'Envoyé',
  echec: 'Échec',
  cloturee: 'Clôturée',
}

export default function Badge({ status = 'pending', children }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] || styles.pending}`}>
      {children || labels[status] || status}
    </span>
  )
}
