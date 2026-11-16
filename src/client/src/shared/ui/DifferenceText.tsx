import { statusTone, tokens } from '@/shared/config/tokens'

/** «−2», «+1», «0»: a shortage in the problem colour, a surplus in the attention colour, zero muted. */
export function DifferenceText({ value }: { value: number | null }) {
  if (value === null) return <span style={{ color: tokens.color.ink3 }}>—</span>
  const color = value < 0 ? statusTone.problem.text : value > 0 ? statusTone.attention.text : tokens.color.ink3
  return <span style={{ color, fontWeight: value === 0 ? 400 : 600 }}>{value > 0 ? `+${value}` : value < 0 ? `−${-value}` : '0'}</span>
}

/** The row tint for a line whose actual quantity differs from the expected one. */
export function differenceRowStyle(value: number | null) {
  if (!value) return undefined
  return { background: value < 0 ? statusTone.problem.bg : statusTone.attention.bg }
}
