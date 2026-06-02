import Badge from '../ui/Badge'

export default function ManualAttendanceList({ students = [], selected = {}, onToggle }) {
  return (
    <div className="max-h-96 overflow-y-auto rounded-2xl border border-[var(--border)]">
      {students.map((student) => (
        <label key={student.id} className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-4 py-3 last:border-b-0">
          <span>
            <span className="block text-sm font-semibold text-[var(--text)]">{student.nom || student.name}</span>
            <span className="text-xs font-medium text-[var(--text-muted)]">{student.matricule || student.classe}</span>
          </span>
          <span className="flex items-center gap-3">
            <Badge status={selected[student.id] ? 'present' : 'absent'} />
            <input
              type="checkbox"
              checked={Boolean(selected[student.id])}
              onChange={() => onToggle(student.id)}
              className="h-5 w-5 rounded border-gray-200 text-[var(--primary)] focus:ring-red-500"
              aria-label={`Marquer ${student.nom || student.name}`}
            />
          </span>
        </label>
      ))}
    </div>
  )
}
