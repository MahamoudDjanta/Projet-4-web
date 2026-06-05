export default function Input({ label, error, className = '', id, ...props }) {
  const inputId = id || props.name

  return (
    <label className="grid gap-2 text-sm font-medium text-[var(--text)]" htmlFor={inputId}>
      {label && <span>{label}</span>}
      <input
        id={inputId}
        className={`h-12 rounded-2xl border border-[var(--border)] bg-white/95 px-4 text-sm text-[var(--text)] transition duration-200 ease-in-out placeholder:text-[var(--text-muted)] shadow-[0_18px_40px_rgba(15,23,42,0.05)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(232,0,45,0.16)] ${className}`}
        {...props}
      />
      {error && <span className="text-xs font-medium text-[var(--primary)]">{error}</span>}
    </label>
  )
}
