import { Group, Loader, TextInput } from '@mantine/core'
import { IconBarcode } from '@tabler/icons-react'
import { forwardRef, useState, type KeyboardEvent } from 'react'
import { tokens } from '@/shared/config/tokens'
import { Key } from '@/shared/ui'

function Hint({ k, children }: { k: string; children: string }) {
  return <Group gap={6} wrap="nowrap" fz={13} c={tokens.color.ink2}><Key>{k}</Key>{children}</Group>
}

/**
 * The till's 64 px scan field (Till artboard). A scanner types the code and Enter; the field submits and clears.
 * `error` paints the red frame of the "not found / not enough stock" state.
 */
export const TillScanInput = forwardRef<HTMLInputElement, {
  onScan: (code: string) => void
  busy?: boolean
  error?: boolean
  placeholder?: string
}>(function TillScanInput({ onScan, busy, error, placeholder = 'Скануйте штрихкод або введіть ISBN' }, ref) {
  const [value, setValue] = useState('')
  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter' || !value.trim()) return
    event.preventDefault()
    onScan(value.trim())
    setValue('')
  }
  const frame = error ? tokens.color.danger : tokens.color.accent
  return (
    <TextInput
      ref={ref}
      autoFocus
      aria-label="Штрихкод, ISBN або назва"
      placeholder={placeholder}
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
      onKeyDown={onKeyDown}
      leftSection={busy ? <Loader size="sm" color="plum" /> : <IconBarcode size={28} stroke={1.75} color={frame} />}
      leftSectionWidth={56}
      rightSection={<Group gap={14} wrap="nowrap"><Hint k="Enter">додати</Hint><Hint k="F2">пошук за назвою</Hint></Group>}
      rightSectionWidth={300}
      rightSectionPointerEvents="none"
      styles={{
        input: {
          height: 64, fontSize: 20, fontWeight: 500, border: `2px solid ${frame}`,
          boxShadow: `0 0 0 4px ${error ? '#FBE6E4' : '#E6D6EB'}`,
        },
      }}
    />
  )
})
