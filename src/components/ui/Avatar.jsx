export default function Avatar({ name = 'Utilisateur', size = 'md' }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
  const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm' }

  return (
    <span className={`inline-flex items-center justify-center rounded-full bg-[var(--accent-soft)] font-semibold text-[var(--primary)] ${sizes[size]}`}>
      {initials || 'U'}
    </span>
  )
}
