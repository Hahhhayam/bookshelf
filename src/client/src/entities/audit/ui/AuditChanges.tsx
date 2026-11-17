import { Text } from '@mantine/core'
import { tokens } from '@/shared/config/tokens'
import { auditFieldLabel, auditValueText, type AuditFieldChange } from '../model/types'

const was = { color: tokens.color.danger, textDecoration: 'line-through' } as const
const now = { color: tokens.color.positive, fontWeight: 600 } as const
const cell = { padding: '6px 10px', verticalAlign: 'top', whiteSpace: 'pre-wrap', wordBreak: 'break-word' } as const

/**
 * The key fields of an audit record, before → after. Collapsed: one line of changed fields; expanded: a row per
 * field. `valueText` names ids (roles, locations, categories…) the record keeps as ids.
 */
export function AuditChanges({ changes, expanded, valueText }: {
  changes: readonly AuditFieldChange[]
  expanded: boolean
  valueText?: (field: string, value: string) => string
}) {
  if (changes.length === 0) return <Text span c="dimmed">—</Text>
  const show = (change: AuditFieldChange, value: string | null) =>
    value === null ? null : (valueText?.(change.field, value) ?? auditValueText(value))
  const label = (field: string) => auditFieldLabel[field] ?? field

  if (!expanded) {
    return (
      <Text size="sm" lineClamp={1}>
        {changes.map((change, i) => (
          <span key={change.field}>
            {i > 0 && ' · '}
            {label(change.field)}: {change.before !== null && <span style={was}>{show(change, change.before)}</span>}
            {change.before !== null && change.after !== null && ' → '}
            {change.after !== null && <span style={now}>{show(change, change.after)}</span>}
          </span>
        ))}
      </Text>
    )
  }
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, background: tokens.color.side }}>
      <thead>
        <tr>
          {['Поле', 'Було', 'Стало'].map((title) => (
            <th key={title} style={{ ...cell, textAlign: 'left', fontSize: 11, color: tokens.color.ink3, textTransform: 'uppercase' }}>{title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {changes.map((change) => (
          <tr key={change.field}>
            <td style={{ ...cell, color: tokens.color.ink2, width: 120 }}>{label(change.field)}</td>
            <td style={{ ...cell, ...(change.before !== null ? was : {}) }}>{show(change, change.before) ?? '—'}</td>
            <td style={{ ...cell, ...(change.after !== null ? now : {}) }}>{show(change, change.after) ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
