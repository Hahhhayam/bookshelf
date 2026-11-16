import { TextInput } from '@mantine/core'
import { useEffect, useState } from 'react'
import { tokens } from '@/shared/config/tokens'

/** A quantity typed freely and saved on Enter or when the field loses focus, so each line is sent once. */
export function QuantityInput({ value, label, highlighted, onCommit }: {
  value: number | null
  label: string
  highlighted?: boolean
  onCommit: (value: number | null) => void
}) {
  const [draft, setDraft] = useState(value === null ? '' : String(value))
  useEffect(() => setDraft(value === null ? '' : String(value)), [value])

  function commit() {
    const text = draft.trim()
    const next = text === '' ? null : Number.parseInt(text, 10)
    if (next !== null && (Number.isNaN(next) || next < 0)) return setDraft(value === null ? '' : String(value))
    if (next !== value) onCommit(next)
  }

  return (
    <TextInput
      size="sm" w={88} inputMode="numeric" placeholder="—" aria-label={label}
      value={draft}
      onChange={(event) => setDraft(event.currentTarget.value.replace(/[^\d]/g, ''))}
      onBlur={commit}
      onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); commit() } }}
      styles={{ input: { textAlign: 'right', borderColor: highlighted ? tokens.color.danger : undefined } }}
    />
  )
}
