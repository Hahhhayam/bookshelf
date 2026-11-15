import type { CSSProperties } from 'react'
import type { Money } from '@/shared/api'
import { tokens } from '@/shared/config/tokens'
import { formatMoney } from '@/shared/lib'

type Variant = 'default' | 'strong' | 'positive' | 'muted' | 'strike'

const styles: Record<Variant, CSSProperties> = {
  default: {},
  strong: { fontWeight: 600 },
  positive: { fontWeight: 600, color: tokens.color.positive },
  muted: { color: tokens.color.ink2 },
  strike: { color: tokens.color.ink3, textDecoration: 'line-through' },
}

export function MoneyText({ value, variant = 'default', size }: { value: Money | null | undefined; variant?: Variant; size?: number }) {
  return <span style={{ whiteSpace: 'nowrap', fontSize: size, ...styles[variant] }}>{formatMoney(value)}</span>
}
