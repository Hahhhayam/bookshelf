import { Checkbox, Stack, Text } from '@mantine/core'
import { referenceName } from '@/entities/reference'
import { StorePicker, useMyStore } from '@/features/shop-my-store'
import { tokens } from '@/shared/config/tokens'

/** «Є в моєму магазині»: the only filter the API supports for the shop (`availableAt`). */
export function StoreFilter({ locations, onlyMyStore, onChange }: {
  locations: readonly string[]
  onlyMyStore: boolean
  onChange: (on: boolean) => void
}) {
  const store = useMyStore()
  return (
    <Stack component="aside" aria-label="Фільтри" gap="sm" p="sm" w={{ base: '100%', md: 260 }}
      style={{ background: tokens.color.accentSoft, flex: 'none' }}>
      <Checkbox label="Є в моєму магазині" fw={700} checked={onlyMyStore} onChange={(e) => onChange(e.currentTarget.checked)} />
      <Text size="sm" c={tokens.color.ink2} pl={28}>
        {store ? referenceName('locations', store) : 'Оберіть магазин, щоб бачити, що є поруч.'}
      </Text>
      <StorePicker locations={locations} label="Змінити магазин" />
    </Stack>
  )
}
