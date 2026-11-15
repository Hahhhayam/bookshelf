import { Group, Stack, Text, UnstyledButton } from '@mantine/core'
import { useRef, type KeyboardEvent } from 'react'
import type { BookHit } from '@/entities/book'
import { tokens } from '@/shared/config/tokens'
import { MoneyText } from '@/shared/ui'

/** Buttons for found books; ↑/↓ move between them, Enter picks. */
export function BookHitList({ hits, locationId, onPick, autoFocus }: {
  hits: BookHit[]
  locationId: string
  onPick: (hit: BookHit) => void
  autoFocus?: boolean
}) {
  const list = useRef<HTMLDivElement>(null)
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    const buttons = [...(list.current?.querySelectorAll('button') ?? [])]
    const at = buttons.indexOf(document.activeElement as HTMLButtonElement)
    buttons[Math.max(0, Math.min(buttons.length - 1, at + (event.key === 'ArrowDown' ? 1 : -1)))]?.focus()
  }
  return (
    <Stack ref={list} gap={0} onKeyDown={onKeyDown} style={{ border: `1px solid ${tokens.color.line}` }}>
      {hits.map((hit, i) => {
        const here = hit.availability.find((a) => a.location === locationId)?.available ?? 0
        return (
          <UnstyledButton key={hit.id} data-autofocus={autoFocus && i === 0 ? true : undefined} onClick={() => onPick(hit)}
            px="md" py="sm" style={{ borderBottom: `1px solid ${tokens.color.line}` }}>
            <Group justify="space-between" wrap="nowrap">
              <Stack gap={2}>
                <Text fw={600} fz={16}>{hit.title}</Text>
                <Text fz={13} c={here > 0 ? tokens.color.ink2 : tokens.color.danger}>В магазині: {here} шт.</Text>
              </Stack>
              <MoneyText value={hit.price} variant="strong" />
            </Group>
          </UnstyledButton>
        )
      })}
    </Stack>
  )
}
