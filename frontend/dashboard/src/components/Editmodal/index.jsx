import { useState } from 'react'
import { http } from '../../api/api'

export default function EditModal({ leitura, onClose, onSave }) {
  const [form, setForm] = useState({
    temperatura: leitura.temperatura,
    umidade:     leitura.umidade,
    pressao:     leitura.pressao ?? '',
    localizacao: leitura.localizacao ?? 'Lab',
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await http.put(`/leituras/${leitura.id}`, form)
    onSave()
    onClose()
  }

  const fields = [
    { key: 'temperatura', label: 'Temperatura (°C)', type: 'number' },
    { key: 'umidade',     label: 'Umidade (%)',       type: 'number' },
    { key: 'pressao',     label: 'Pressão (hPa)',     type: 'number' },
    { key: 'localizacao', label: 'Localização',       type: 'text'   },
  ]

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="glass-panel rounded-xl p-8 w-full max-w-md page-enter"
        style={{ border: '1px solid rgba(114,220,255,0.15)', boxShadow: '0 0 40px rgba(114,220,255,0.12)' }}
      >

        <div className="flex items-center justify-between mb-6">
          <div>
            <p
              className="font-headline text-[10px] uppercase tracking-[0.2em]"
              style={{ color: 'var(--primary)' }}
            >
              EDIT RECORD
            </p>
            <h2
              className="font-headline text-xl font-bold mt-0.5"
              style={{ color: 'var(--on-surface)' }}
            >
              Leitura #{leitura.id}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors"
            style={{ color: 'var(--on-surface-variant)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
          </button>
        </div>

        <div className="flex flex-col gap-5">
          {fields.map(({ key, label, type }) => (
            <div key={key}>
              <label
                className="font-headline text-[10px] uppercase tracking-[0.15em] block mb-1.5"
                style={{ color: 'var(--on-surface-variant)' }}
              >
                {label}
              </label>
              <input
                type={type}
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="atmos-input w-full px-0 py-2"
                step={type === 'number' ? '0.1' : undefined}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 font-headline font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-transform hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, var(--primary-container), var(--primary-dim))',
              color: '#003a4a',
              boxShadow: '0 0 16px rgba(0,210,255,0.25)',
            }}
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 font-headline font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-colors"
            style={{
              background: 'rgba(33,38,45,0.6)',
              color: 'var(--on-surface-variant)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}