import { statusTone, type StatusTone } from '@/shared/config/tokens'

/** A status always shows its word next to the colour, so colour never carries the meaning alone. */
export function StatusBadge({ tone, label }: { tone: StatusTone; label: string }) {
  const c = statusTone[tone]
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, height: 22, padding: '0 8px',
        fontSize: 12, fontWeight: 600, lineHeight: 1, whiteSpace: 'nowrap',
        background: c.bg, color: c.text, boxShadow: c.ring ? `inset 0 0 0 1px ${c.ring}` : undefined,
      }}
    >
      <i style={{ width: 6, height: 6, display: 'block', background: c.dot }} />
      {label}
    </span>
  )
}
