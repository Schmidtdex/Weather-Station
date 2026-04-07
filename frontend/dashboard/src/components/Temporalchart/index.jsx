import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className="glass-panel rounded-xl px-4 py-3"
      style={{ border: '1px solid rgba(114,220,255,0.15)' }}
    >
      <p
        className="font-headline text-[10px] uppercase tracking-widest mb-2"
        style={{ color: 'var(--on-surface-variant)' }}
      >
        {label}
      </p>
      {payload.map(p => (
        <p key={p.name} className="font-headline text-sm font-bold" style={{ color: p.color }}>
          {p.name}: {p.value}
          {p.name === 'Temperatura' ? '°C' : '%'}
        </p>
      ))}
    </div>
  )
}

export default function TemporalChart({ data = [] }) {
  return (
    <section
      className="glass-panel rounded-xl p-6 stagger"
      style={{
        border: '1px solid rgba(255,255,255,0.04)',
        animationDelay: '300ms',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          className="font-headline text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: 'var(--on-surface-variant)' }}
        >
          Variação Temporal — Stream de Dados
        </h2>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-headline text-[10px] uppercase tracking-wider" style={{ color: 'var(--primary)' }}>
            <span style={{ width: 20, height: 2, background: 'var(--primary)', display: 'inline-block', borderRadius: 2 }} />
            Temperatura
          </span>
          <span className="flex items-center gap-1.5 font-headline text-[10px] uppercase tracking-wider" style={{ color: 'var(--secondary)' }}>
            <span style={{ width: 20, height: 2, background: 'var(--secondary)', display: 'inline-block', borderRadius: 2 }} />
            Umidade
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.03)" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 9, fill: 'var(--on-surface-variant)', fontFamily: 'Space Grotesk' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 9, fill: 'var(--on-surface-variant)', fontFamily: 'Space Grotesk' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(114,220,255,0.15)', strokeWidth: 1 }} />
          <Line
            type="monotone" dataKey="Temperatura"
            stroke="var(--primary)" strokeWidth={2} dot={false}
            style={{ filter: 'drop-shadow(0 0 4px rgba(114,220,255,0.5))' }}
          />
          <Line
            type="monotone" dataKey="Umidade"
            stroke="var(--secondary)" strokeWidth={2} dot={false}
            style={{ filter: 'drop-shadow(0 0 4px rgba(208,188,255,0.4))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  )
}