export default function StatCard({ label, value, unit, accentColor = 'var(--primary)', delay = 0 }) {
  return (
    <div
      className="glass-panel rounded-xl p-6 stagger relative overflow-hidden flex flex-col justify-center"
      style={{
        animationDelay: `${delay}ms`,
        border: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div
        style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
          background: accentColor,
          borderRadius: '4px 0 0 4px',
          opacity: 0.7,
          boxShadow: `0 0 12px ${accentColor}`,
        }}
      />

      <div style={{ marginLeft: '24px' }}>
        <p
          className="font-headline text-[10px] uppercase tracking-[0.2em] mb-2"
          style={{ color: accentColor }}
        >
          {label}
        </p>
        <p
          className="font-headline text-3xl font-bold"
          style={{ color: 'var(--on-surface)' }}
        >
          {value ?? '—'}
          <span
            className="text-sm font-normal ml-1"
            style={{ color: 'var(--on-surface-variant)' }}
          >
            {unit}
          </span>
        </p>
      </div>
    </div>
  )
}