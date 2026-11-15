import { TextInput } from '@mantine/core'
import { IconBarcode } from '@tabler/icons-react'
import { forwardRef, useState, type KeyboardEvent } from 'react'
import { tokens } from '@/shared/config/tokens'

/**
 * A barcode scanner types the code and presses Enter; so does a person typing an ISBN. The field submits on Enter
 * and clears itself, ready for the next scan.
 */
export const ScanField = forwardRef<HTMLInputElement, {
  placeholder?: string
  onScan: (code: string) => void
  autoFocus?: boolean
  label?: string
}>(function ScanField({ placeholder = 'Скан або пошук', onScan, autoFocus, label }, ref) {
  const [value, setValue] = useState('')
  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter' || !value.trim()) return
    event.preventDefault()
    onScan(value.trim())
    setValue('')
  }
  return (
    <TextInput
      ref={ref}
      label={label}
      aria-label={label ?? placeholder}
      size="lg"
      autoFocus={autoFocus}
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      leftSection={<IconBarcode size={20} stroke={1.75} color={tokens.color.accent} />}
      styles={{ input: { fontFamily: tokens.font.mono } }}
    />
  )
})
