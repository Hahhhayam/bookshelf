import { Text } from '@mantine/core'
import { tokens } from '@/shared/config/tokens'

const was = { color: tokens.color.danger, textDecoration: 'line-through' } as const
const now = { color: tokens.color.positive, fontWeight: 600 } as const

/** Values before and after a change; collapsed to one line, expanded as a two-row table. */
export function AuditChange({ before, after, expanded }: { before: string | null; after: string | null; expanded: boolean }) {
  if (!before && !after) return <Text span c="dimmed">—</Text>
  if (!expanded) {
    return (
      <Text size="sm" lineClamp={1}>
        {before && <span style={was}>{before}</span>}
        {before && after && ' → '}
        {after && <span style={now}>{after}</span>}
      </Text>
    )
  }
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, background: tokens.color.side }}>
      <tbody>
        {[['Було', before, was], ['Стало', after, now]].map(([label, value, style]) => (
          <tr key={label as string}>
            <th style={{ textAlign: 'left', width: 72, padding: '8px 10px', fontSize: 11, color: tokens.color.ink3, textTransform: 'uppercase', verticalAlign: 'top' }}>
              {label as string}
            </th>
            <td style={{ padding: '8px 10px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', ...(value ? (style as object) : {}) }}>
              {(value as string | null) ?? '—'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
