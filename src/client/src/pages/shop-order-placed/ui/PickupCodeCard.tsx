import { Button, CopyButton, Group, Stack, Text, Title } from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'
import { Link } from 'react-router'
import type { TrackedOrder } from '@/entities/order'
import { storeName, useStores } from '@/entities/store'
import { tokens } from '@/shared/config/tokens'
import { shortId } from '@/shared/lib'
import { PickupCode } from './PickupCode'

export function PickupCodeCard({ order, code }: { order: TrackedOrder; code: string }) {
  const stores = useStores().data
  const store = order.store ? storeName(stores, order.store) : null
  return (
    <Stack gap="lg" role="status">
      <Group gap={10} c={tokens.color.positive} fw={600} fz={16}>
        <IconCheck size={22} stroke={2.2} />
        <span>Замовлення <span style={{ fontFamily: tokens.font.mono }}>{shortId(order.id)}</span> прийнято</span>
      </Group>
      <Title order={1} ff="var(--font-display)" fz={{ base: 32, sm: 46 }} lh={1.05}>Дякуємо! Ось ваш код отримання</Title>
      <Stack gap="md" p={{ base: 'md', sm: 28 }} style={{ background: tokens.color.surface, border: `1px solid ${tokens.color.line}` }}>
        <Text size="md" fw={600} c={tokens.color.ink2}>Код отримання</Text>
        <PickupCode code={code} />
        <Text fz={15} lh="23px">
          {store
            ? <>Назвіть або покажіть цей код на касі: <strong>{store}</strong>.</>
            : <>Доставимо за вказаною адресою. Код знадобиться, щоб відстежити замовлення.</>}
        </Text>
        <Group gap="sm">
          <Button component={Link} to={`/track/${encodeURIComponent(code)}`} size="lg">Відстежити замовлення</Button>
          <CopyButton value={code}>
            {({ copied, copy }) => (
              <Button variant="default" size="lg" onClick={copy}>{copied ? 'Скопійовано' : 'Скопіювати код'}</Button>
            )}
          </CopyButton>
        </Group>
      </Stack>
    </Stack>
  )
}
