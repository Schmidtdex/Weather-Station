export default function HumidityBar({ value = 65, dewPoint }) {
  const pct = Math.min(Math.max(value, 0), 100)

  return (
    <section
      className="glass-panel rounded-xl p-6 flex flex-col flex-1 items-center stagger"
      style={{
        border: '1px solid rgba(255,255,255,0.04)',
        animationDelay: '200ms',
      }}
    >
      <h2
        className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] mb-6"
        style={{ color: 'var(--tertiary)' }}
      >
        Umidade Relativa
      </h2>


      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div
          className="relative w-13 rounded-full"
          style={{
            height: 250,
            background: 'var(--surface-container-highest)',
            padding: '4px',
          }}
        >
          <div
            className="absolute bottom-1 left-1 right-1 rounded-full thermo-fill"
            style={{
              height: `${pct}%`,
              background: 'linear-gradient(to top, var(--tertiary-container), var(--tertiary))',
              boxShadow: '0 0 16px rgba(0,253,193,0.45)',
            }}
          />
          <div
            className="absolute flex items-center justify-center"
            style={{
              bottom: `calc(${pct}% - 14px)`,
              left: '50%',
              transform: 'translateX(28px)',
              whiteSpace: 'nowrap',
            }}
          >
            <span
              className="font-headline font-bold text-xs px-3 py-1 rounded-full"
              style={{ background: 'white', color: '#0c0e12' }}
            >
              {value}%
            </span>
          </div>
        </div>
      </div>

      {dewPoint !== undefined && (
        <div className="mt-6 text-center">
          <p
            className="font-headline text-[10px] uppercase tracking-widest"
            style={{ color: 'var(--on-surface-variant)' }}
          >
            Ponto de Orvalho
          </p>
          <p
            className="font-headline font-bold text-xl mt-1"
            style={{ color: 'var(--on-surface)' }}
          >
            {dewPoint}°C
          </p>
        </div>
      )}
    </section>
  )
}