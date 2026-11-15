import { TextInput } from '@mantine/core'
import type { KeyboardEvent } from 'react'
import { tokens } from '@/shared/config/tokens'

/** The 48 px right-aligned amount field of the payment dialogs. */
export function AmountInput({ label, value, onChange, onKeyDown, invalid, autoFocus, disabled }: {
  label: string
  value: string
  onChange: (value: string) => void
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
  invalid?: boolean
  autoFocus?: boolean
  disabled?: boolean
}) {
  return (
    <TextInput
      aria-label={label}
      data-autofocus={autoFocus || undefined}
      inputMode="decimal"
      value={value}
      disabled={disabled}
      error={invalid}
      onChange={(event) => onChange(event.currentTarget.value)}
      onKeyDown={onKeyDown}
      onFocus={(event) => event.currentTarget.select()}
      rightSection="₴"
      styles={{ input: { height: 48, fontSize: 18, fontWeight: 600, textAlign: 'right', fontFamily: tokens.font.ui } }}
    />
  )
}
