import { Group, Text, UnstyledButton } from '@mantine/core'
import { useNetwork } from '@mantine/hooks'
import { tokens } from '@/shared/config/tokens'
import { Key } from '@/shared/ui'

function Connection() {
  const { online } = useNetwork()
  return (
    <Group gap={6} ml="auto" fw={500} c={online ? '#9FD7AF' : tokens.color.offlineIcon} fz={13} role="status">
      <span style={{ width: 8, height: 8, background: online ? '#4CB070' : tokens.color.offlineIcon }} />
      {online ? 'На зв’язку' : 'Немає з’єднання'}
    </Group>
  )
}

/** The dark strip of the till: store, cashier, connection and the F12 exit. Shift and register number do not exist yet (GAP-27). */
export function TillHeader({ store, cashier, onExit }: { store: string; cashier: string; onExit: () => void }) {
  return (
    <Group component="header" h={52} px={20} gap={20} wrap="nowrap" fz={13}
      style={{ flex: 'none', background: tokens.color.ink, color: tokens.color.paper }}>
      <Text fz={15} fw={700}>Каса</Text>
      <Text fz={13} c={tokens.color.lineStrong}>{store}</Text>
      <Connection />
      <Text fz={13} c={tokens.color.lineStrong}>{cashier}</Text>
      <UnstyledButton onClick={onExit} tabIndex={-1}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 34, padding: '0 12px', border: `1px solid ${tokens.color.ink2}`, color: tokens.color.paper, fontSize: 13, fontWeight: 500 }}>
        <Key inverted>F12</Key>Вихід
      </UnstyledButton>
    </Group>
  )
}
