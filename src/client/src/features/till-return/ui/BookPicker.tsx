import { Alert, Group, Loader, Select, Stack, Text } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { bookApi, type BookHit } from '@/entities/book'
import { formatMoney } from '@/shared/lib'
import { errorMessage, MoneyText, ScanField } from '@/shared/ui'

/** The returned book, found by scan, ISBN or title. */
export function BookPicker({ value, onChange }: { value: BookHit | null; onChange: (hit: BookHit | null) => void }) {
  const lookup = useMutation({ mutationFn: (code: string) => bookApi.findByCode(code) })
  const hits = lookup.data ?? []

  function scan(code: string) {
    onChange(null)
    lookup.mutate(code, { onSuccess: (found) => { if (found.length === 1) onChange(found[0]!) } })
  }

  return (
    <Stack gap="xs">
      <ScanField label="Книга" placeholder="Скан, ISBN або назва" onScan={scan} />
      {lookup.isPending && <Group gap="xs"><Loader size="xs" color="plum" /><Text fz="sm" c="dimmed">Шукаємо…</Text></Group>}
      {lookup.isError && <Alert color="red" variant="light">{errorMessage(lookup.error)}</Alert>}
      {lookup.isSuccess && hits.length === 0 && <Alert color="yellow" variant="light">Книгу не знайдено. Перевірте код або назву.</Alert>}
      {hits.length > 1 && (
        <Select label="Знайдено кілька — оберіть" data={hits.map((h) => ({ value: h.id, label: `${h.title} · ${formatMoney(h.price)}` }))}
          value={value?.id ?? null} onChange={(id) => onChange(hits.find((h) => h.id === id) ?? null)} />
      )}
      {value && (
        <Group justify="space-between" p="sm" style={{ background: 'var(--mantine-color-plum-0)' }}>
          <Text fw={600}>{value.title}</Text>
          <MoneyText value={value.price} />
        </Group>
      )}
    </Stack>
  )
}
