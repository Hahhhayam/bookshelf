import { Alert, Button, NumberInput, SegmentedControl, Stack, Text, TextInput } from '@mantine/core'
import { useState } from 'react'
import { conditionLabel, type ItemCondition, type PricedLine } from '@/entities/sale'
import { errorMessage, Panel } from '@/shared/ui'
import { useCreateReturn } from '../model/queries'
import { SaleLinePicker } from './SaleLinePicker'
import { isSaleId, SalePicker } from './SalePicker'

const conditions = (Object.keys(conditionLabel) as ItemCondition[]).map((value) => ({ value, label: conditionLabel[value] }))

/** A return at the till: receipt, position, quantity, reason and condition; an administrator confirms it afterwards. */
export function CreateReturnForm({ locationId }: { locationId: string }) {
  const [sale, setSale] = useState('')
  const [line, setLine] = useState<PricedLine | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [reason, setReason] = useState('')
  const [condition, setCondition] = useState<ItemCondition>('New')
  const create = useCreateReturn(locationId)
  const saleId = isSaleId(sale) ? sale.trim() : undefined
  const ready = saleId !== undefined && line !== null && quantity >= 1 && quantity <= line.quantity && reason.trim() !== ''

  function pickSale(id: string) {
    setSale(id)
    setLine(null)
  }
  function submit() {
    if (!ready || !saleId || !line) return
    create.mutate(
      { sale: saleId, items: [{ book: line.book, quantity }], reason: reason.trim(), condition },
      { onSuccess: () => { setLine(null); setQuantity(1); setReason('') } },
    )
  }

  return (
    <Panel title="Нове повернення" padding={16}>
      <Stack gap="md">
        <Text fz="sm" c="dimmed">Повернути книгу можна протягом 7 днів від дня покупки — давніший продаж сервер не прийме.</Text>
        <SalePicker locationId={locationId} value={sale} onChange={pickSale} />
        <SaleLinePicker sale={saleId} value={line} onChange={setLine} />
        <NumberInput label="Кількість" min={1} max={line?.quantity} allowDecimal={false} value={quantity}
          onChange={(v) => setQuantity(typeof v === 'number' ? v : 1)} w={160} />
        <TextInput label="Причина" placeholder="Наприклад: подарували дублікат" value={reason}
          onChange={(e) => setReason(e.currentTarget.value)} required />
        <Stack gap={4}>
          <Text fz="sm" fw={500}>Стан книги</Text>
          <SegmentedControl data={conditions} value={condition} onChange={(v) => setCondition(v as ItemCondition)} />
        </Stack>
        {create.isError && <Alert color="red" variant="light" title="Повернення не оформлено">{errorMessage(create.error)}</Alert>}
        {create.isSuccess && (
          <Alert color="green" variant="light">Повернення створено й чекає підтвердження адміністратора.</Alert>
        )}
        <Button onClick={submit} disabled={!ready} loading={create.isPending} style={{ alignSelf: 'flex-start' }}>
          Оформити повернення
        </Button>
      </Stack>
    </Panel>
  )
}
