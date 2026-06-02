export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  ...props
}) {
  const variants = {
    primary: 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]',
    secondary: 'bg-white text-[var(--text)] border border-[var(--border)] hover:border-[var(--primary)]',
    danger: 'bg-[#111111] text-white hover:bg-[var(--primary)]',
    ghost: 'bg-transparent text-[var(--text-muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--primary)]',
  }
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm',
    lg: 'h-12 px-5 text-base',
  }

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
