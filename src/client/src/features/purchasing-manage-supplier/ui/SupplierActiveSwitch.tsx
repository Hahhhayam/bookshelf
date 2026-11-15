import { Stack, Switch, Text } from '@mantine/core'
import { errorMessage } from '@/shared/ui'
import { useSetSupplierActive } from '../model/useSupplierMutations'

/** An inactive supplier stays in old orders but is not offered for new ones. */
export function SupplierActiveSwitch({ id, name, active }: { id: string; name: string; active: boolean }) {
  const setActive = useSetSupplierActive()
  return (
    <Stack gap={2}>
      <Switch
        checked={active}
        disabled={setActive.isPending}
        onChange={(event) => setActive.mutate({ id, active: event.currentTarget.checked })}
        label={active ? 'Активний' : 'Неактивний'}
        aria-label={`${name}: ${active ? 'деактивувати' : 'активувати'}`}
      />
      {setActive.isError && <Text size="xs" c="red">{errorMessage(setActive.error)}</Text>}
    </Stack>
  )
}
