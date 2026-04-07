export default function CircularGauge({ label, value, displayValue, unit, color, delay = 0 }) {
  const R = 40
  const CIRC = 2 * Math.PI * R        // 251.2
  const pct = Math.min(Math.max(value, 0), 100)
  const offset = CIRC * (1 - pct / 100)

  return (
    <div
      className="glass-panel rounded-xl p-4 flex flex-col items-center justify-center stagger"
      style={{
        animationDelay: `${delay}ms`,
        border: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <span
        className="font-headline text-[10px] font-bold uppercase tracking-widest mb-3"
        style={{ color }}
      >
        {label}
      </span>

      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
          <circle
            cx="48" cy="48" r={R}
            fill="transparent"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="5"
          />
          <circle
            cx="48" cy="48" r={R}
            fill="transparent"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            className="gauge-ring"
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div className="absolute text-center">
          <span
            className="font-headline font-bold text-xl"
            style={{ color: 'var(--on-surface)' }}
          >
            {displayValue ?? value}
          </span>
          {unit && (
            <span
              className="font-headline text-[10px] ml-0.5"
              style={{ color: 'var(--on-surface-variant)' }}
            >
              {unit}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}