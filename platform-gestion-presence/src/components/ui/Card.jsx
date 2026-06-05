export default function Card({ children, className = '' }) {
  return (
    <section className={`rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-[var(--shadow)] ${className}`}>
      {children}
    </section>
  )
}
