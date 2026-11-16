import { Group, Stack, Text, UnstyledButton } from '@mantine/core'
import { useRef, type KeyboardEvent, type ReactNode } from 'react'
import { tokens } from '@/shared/config/tokens'
import { MoneyText } from '@/shared/ui'
import type { BookHit } from '../model/types'

function moveFocus(list: HTMLElement | null, event: KeyboardEvent) {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
  event.preventDefault()
  const buttons = [...(list?.querySelectorAll('button') ?? [])]
  const at = buttons.indexOf(document.activeElement as HTMLButtonElement)
  buttons[Math.max(0, Math.min(buttons.length - 1, at + (event.key === 'ArrowDown' ? 1 : -1)))]?.focus()
}

/**
 * Buttons for found books; ↑/↓ move between them, Enter picks. `caption` adds a line under the title (stock at the
 * till's store, say); `dense` is the inline variant under a scan field.
 */
export function BookHitList({ hits, onPick, caption, autoFocus, dense = false }: {
  hits: BookHit[]
  onPick: (hit: BookHit) => void
  caption?: (hit: BookHit) => ReactNode
  autoFocus?: boolean
  dense?: boolean
}) {
  const list = useRef<HTMLDivElement>(null)
  return (
    <Stack ref={list} gap={0} onKeyDown={(e) => moveFocus(list.current, e)}
      style={{ border: `1px solid ${tokens.color.line}`, background: tokens.color.surface }}>
      {hits.map((hit, i) => (
        <UnstyledButton key={hit.id} data-autofocus={autoFocus && i === 0 ? true : undefined} onClick={() => onPick(hit)}
          px="md" py={dense ? 8 : 'sm'} style={{ borderBottom: `1px solid ${tokens.color.line}` }}>
          <Group justify="space-between" wrap="nowrap">
            <Stack gap={2}>
              <Text fw={600} fz={dense ? 14 : 16}>{hit.title}</Text>
              {caption?.(hit)}
            </Stack>
            {dense ? <MoneyText value={hit.price} variant="muted" size={13} /> : <MoneyText value={hit.price} variant="strong" />}
          </Group>
        </UnstyledButton>
      ))}
    </Stack>
  )
}
