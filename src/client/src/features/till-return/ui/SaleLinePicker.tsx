import { Radio, Stack, Text } from '@mantine/core'
import { useBookTitles } from '@/entities/book'
import { useSale, type PricedLine } from '@/entities/sale'
import { errorMessage, MoneyText } from '@/shared/ui'

/** Scenario 3.6 step 1: the position of the receipt being returned, with what was paid for it. */
export function SaleLinePicker({ sale, value, onChange }: {
  sale: string | undefined
  value: PricedLine | null
  onChange: (line: PricedLine | null) => void
}) {
  const query = useSale(sale)
  const lines = query.data?.lines ?? []
  const titleOf = useBookTitles(lines.map((l) => l.book))
  if (!sale) return <Text fz="sm" c="dimmed">Оберіть чек, щоб побачити його позиції.</Text>
  if (query.isPending) return <Text fz="sm" c="dimmed">Завантаження чека…</Text>
  if (query.isError) return <Text fz="sm" c="red">{errorMessage(query.error)}</Text>
  return (
    <Radio.Group label="Позиція чека" value={value?.book ?? null}
      onChange={(book) => onChange(lines.find((l) => l.book === book) ?? null)}>
      <Stack gap={6} mt={4}>
        {lines.map((line) => (
          <Radio key={line.book} value={line.book} label={
            <span>{titleOf(line.book)} · {line.quantity} шт. · <MoneyText value={line.total} /></span>
          } />
        ))}
      </Stack>
    </Radio.Group>
  )
}
