import { BACKGROUNDS } from '../backgrounds'

export default function BackgroundForm({ data, onChange }) {
  const bg = data || { type: 'effect', value: 'particles' }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-slate-300 mb-1">Choose Background</label>
      <div className="grid grid-cols-2 gap-3">
        {BACKGROUNDS.map(b => {
          const selected = bg.value === b.id
          return (
            <button key={b.id}
              onClick={() => onChange({ type: 'effect', value: b.id })}
              className="rounded-xl overflow-hidden text-left transition-all hover:scale-[1.02]"
              style={{
                border: selected ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
                boxShadow: selected ? '0 0 0 3px rgba(99,102,241,0.25)' : 'none',
              }}>
              <div className="h-20 w-full" style={b.preview} />
              <div className="px-3 py-2 text-xs font-medium"
                style={{ background: 'rgba(255,255,255,0.03)', color: selected ? '#818cf8' : '#94a3b8' }}>
                {b.name}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
