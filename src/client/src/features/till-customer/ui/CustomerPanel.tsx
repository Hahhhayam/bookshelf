import { Group, Stack, Text } from '@mantine/core'
import { IconStar } from '@tabler/icons-react'
import { tierLabel, type CustomerCard } from '@/entities/customer'
import { uah } from '@/shared/api'
import { statusTone, tokens } from '@/shared/config/tokens'
import { Initials, Key, MoneyText } from '@/shared/ui'

const caption = { fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: tokens.color.ink3 } as const

function Header({ action }: { action: string }) {
  return (
    <Group justify="space-between">
      <span style={caption}>Клієнт</span>
      <Group gap={6} fz={12} c={tokens.color.ink2}><Key>F4</Key>{action}</Group>
    </Group>
  )
}

/** The receipt's customer: name, card, tier and bonus balance; one bonus is one hryvnia at the till. */
export function CustomerPanel({ customer }: { customer: CustomerCard | null }) {
  if (!customer) {
    return (
      <Stack gap={12} p="md" style={{ background: tokens.color.paper }}>
        <Header action="знайти" />
        <Text fz={15} c={tokens.color.ink2}>Без клієнта. Скануйте картку лояльності після F4, щоб нарахувати бонуси.</Text>
      </Stack>
    )
  }
  return (
    <Stack gap={12} p="md" style={{ background: tokens.color.paper }}>
      <Header action="змінити" />
      <Group gap={12} wrap="nowrap">
        <Initials name={customer.name} size={44} solid />
        <Stack gap={2} style={{ minWidth: 0 }}>
          <Text fz={17} fw={700} truncate>{customer.name}</Text>
          <Text fz={13} c={tokens.color.ink2}>Картка •••• {customer.card.slice(-4)}</Text>
        </Stack>
        <Group gap={6} h={24} px={8} ml="auto" wrap="nowrap"
          style={{ background: statusTone.attention.bg, color: statusTone.attention.text, fontSize: 12, fontWeight: 700 }}>
          <IconStar size={14} stroke={1.75} />{tierLabel[customer.tier]}
        </Group>
      </Group>
      <Group justify="space-between" align="baseline" pt={10} style={{ borderTop: `1px solid ${tokens.color.line}` }}>
        <Text fz={14} c={tokens.color.ink2}>Бонусний рахунок</Text>
        <MoneyText value={uah(customer.bonusBalance)} variant="strong" size={17} />
      </Group>
    </Stack>
  )
}
