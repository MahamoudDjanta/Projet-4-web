export default function Input({ label, error, className = '', id, ...props }) {
  const inputId = id || props.name

  return (
    <label className="grid gap-2 text-sm font-medium text-[var(--text)]" htmlFor={inputId}>
      {label && <span>{label}</span>}
      <input
        id={inputId}
        className={`h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-[var(--text)] transition duration-200 ease-in-out placeholder:text-[var(--text-muted)] focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 ${className}`}
        {...props}
      />
      {error && <span className="text-xs font-medium text-[var(--primary)]">{error}</span>}
    </label>
  )
}
