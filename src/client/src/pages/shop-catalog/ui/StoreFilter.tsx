import { Checkbox, Stack, Text } from '@mantine/core'
import { storeName, useStores } from '@/entities/store'
import { StorePicker, useMyStore } from '@/features/shop-my-store'
import { tokens } from '@/shared/config/tokens'

/** «Є в моєму магазині» (`availableAt`). */
export function StoreFilter({ onlyMyStore, onChange }: {
  onlyMyStore: boolean
  onChange: (on: boolean) => void
}) {
  const store = useMyStore()
  const stores = useStores().data
  return (
    <Stack component="aside" aria-label="Фільтри" gap="sm" p="sm" w={{ base: '100%', md: 260 }}
      style={{ background: tokens.color.accentSoft, flex: 'none' }}>
      <Checkbox label="Є в моєму магазині" fw={700} checked={onlyMyStore} onChange={(e) => onChange(e.currentTarget.checked)} />
      <Text size="sm" c={tokens.color.ink2} pl={28}>
        {store ? storeName(stores, store) : 'Оберіть магазин, щоб бачити, що є поруч.'}
      </Text>
      <StorePicker label="Змінити магазин" />
    </Stack>
  )
}
