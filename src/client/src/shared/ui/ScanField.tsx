import { Group, Loader, TextInput, type TextInputProps } from '@mantine/core'
import { IconBarcode } from '@tabler/icons-react'
import { forwardRef, useState, type KeyboardEvent } from 'react'
import { statusTone, tokens } from '@/shared/config/tokens'
import { Key } from './Key'

export interface ScanHint {
  key: string
  label: string
}

interface Look {
  busy?: boolean
  error?: boolean
  hints?: readonly ScanHint[]
}

function Hint({ hint }: { hint: ScanHint }) {
  return <Group gap={6} wrap="nowrap" fz={13} c={tokens.color.ink2}><Key>{hint.key}</Key>{hint.label}</Group>
}

function icon(busy: boolean | undefined, size: number, color: string) {
  return busy ? <Loader size="sm" color="plum" /> : <IconBarcode size={size} stroke={1.75} color={color} />
}

function largeLook({ busy, error }: Look): TextInputProps {
  return {
    size: 'lg',
    leftSection: icon(busy, 20, error ? tokens.color.danger : tokens.color.accent),
    styles: { input: { fontFamily: tokens.font.mono, borderColor: error ? tokens.color.danger : undefined } },
  }
}

/** The till's 64 px field (Till artboard): a thick frame, red in the error state, and key hints on the right. */
function extraLargeLook({ busy, error, hints = [] }: Look): TextInputProps {
  const frame = error ? tokens.color.danger : tokens.color.accent
  return {
    leftSection: icon(busy, 28, frame),
    leftSectionWidth: 56,
    rightSection: hints.length > 0 && <Group gap={14} wrap="nowrap">{hints.map((h) => <Hint key={h.key} hint={h} />)}</Group>,
    rightSectionWidth: hints.length > 0 ? 300 : undefined,
    rightSectionPointerEvents: 'none',
    styles: {
      input: {
        height: 64, fontSize: 20, fontWeight: 500, border: `2px solid ${frame}`,
        boxShadow: `0 0 0 4px ${error ? statusTone.problem.bg : '#E6D6EB'}`,
      },
    },
  }
}

function useScanValue(onScan: (code: string) => void) {
  const [value, setValue] = useState('')
  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter' || !value.trim()) return
    event.preventDefault()
    onScan(value.trim())
    setValue('')
  }
  return { value, onKeyDown, onChange: (event: { currentTarget: HTMLInputElement }) => setValue(event.currentTarget.value) }
}

/**
 * A barcode scanner types the code and presses Enter; so does a person typing an ISBN. The field submits on Enter
 * and clears itself, ready for the next scan. `busy` shows a loader in place of the barcode icon, `error` paints the
 * frame red; `hints` (key + action) are shown in the `xl` size only.
 */
export const ScanField = forwardRef<HTMLInputElement, Look & {
  placeholder?: string
  onScan: (code: string) => void
  autoFocus?: boolean
  label?: string
  'aria-label'?: string
  size?: 'lg' | 'xl'
}>(function ScanField({ placeholder = 'Скан або пошук', onScan, autoFocus, label, size = 'lg', ...rest }, ref) {
  const scan = useScanValue(onScan)
  const look = size === 'xl' ? extraLargeLook(rest) : largeLook(rest)
  return (
    <TextInput
      ref={ref}
      label={label}
      aria-label={rest['aria-label'] ?? label ?? placeholder}
      autoFocus={autoFocus}
      placeholder={placeholder}
      {...scan}
      {...look}
    />
  )
})
