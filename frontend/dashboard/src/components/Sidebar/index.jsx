import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/',          icon: 'wifi_tethering',    label: 'Live Feed'     },
  { to: '/historico', icon: 'table_rows',         label: 'Histórico'    },
]

export default function Sidebar() {
  return (
    <aside
      className="fixed left-0 top-0 w-60 z-40 flex flex-col p-6 gap-10"
      style={{
        height: 'calc(100vh)',
        marginTop: '0',
        background: 'rgba(16,20,24,0.6)',
        backdropFilter: 'blur(32px)',
        borderRight: '1px solid rgba(255,255,255,0.04)',
        paddingTop: '80px',
      }}
    >
      <div className="flex items-center gap-3 px-2">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
          style={{
            background: 'var(--surface-container-highest)',
            border: '1px solid rgba(114,220,255,0.2)',
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 22, color: 'var(--primary)' }}
          >
            sensors
          </span>
        </div>
        <div>
          <p
            className="font-headline text-sm font-bold"
            style={{ color: 'var(--on-surface)' }}
          >
            Estação 1
          </p>
          <p
            className="font-headline text-[10px] tracking-widest uppercase"
            style={{ color: 'var(--primary)', letterSpacing: '0.15em' }}
          >
            Monitoramento ativo
          </p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink
            key={label}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 font-body font-medium text-sm tracking-wide group ${
                isActive ? '' : 'hover:translate-x-1'
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background: 'rgba(114,220,255,0.12)',
                    color: 'var(--primary)',
                    boxShadow: '0 0 12px rgba(114,220,255,0.15)',
                  }
                : { color: 'var(--on-surface-variant)' }
            }
            onMouseEnter={e => {
              if (!e.currentTarget.classList.contains('active'))
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.getAttribute('aria-current'))
                e.currentTarget.style.background = 'transparent'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              {icon}
            </span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}