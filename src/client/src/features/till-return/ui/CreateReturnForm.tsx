import { Alert, Button, NumberInput, SegmentedControl, Stack, Text, TextInput } from '@mantine/core'
import { useState } from 'react'
import type { BookHit } from '@/entities/book'
import { conditionLabel, type ItemCondition } from '@/entities/sale'
import { shortId } from '@/shared/lib'
import { errorMessage, Panel } from '@/shared/ui'
import { useCreateReturn } from '../model/queries'
import { BookPicker } from './BookPicker'
import { isSaleId, SalePicker } from './SalePicker'

const conditions = (Object.keys(conditionLabel) as ItemCondition[]).map((value) => ({ value, label: conditionLabel[value] }))

/** A return at the till: sale, book, quantity, reason and condition; an administrator confirms it afterwards. */
export function CreateReturnForm() {
  const [sale, setSale] = useState('')
  const [book, setBook] = useState<BookHit | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [reason, setReason] = useState('')
  const [condition, setCondition] = useState<ItemCondition>('New')
  const create = useCreateReturn()
  const ready = isSaleId(sale) && book !== null && quantity >= 1 && reason.trim() !== ''

  function submit() {
    if (!ready || !book) return
    create.mutate(
      { sale: sale.trim(), book: book.id, title: book.title, quantity, reason: reason.trim(), condition },
      { onSuccess: () => { setBook(null); setQuantity(1); setReason('') } },
    )
  }

  return (
    <Panel title="Нове повернення" padding={16}>
      <Stack gap="md">
        <Text fz="sm" c="dimmed">Повернути книгу можна протягом 7 днів від дня покупки — давніший продаж сервер не прийме.</Text>
        <SalePicker value={sale} onChange={setSale} />
        <BookPicker value={book} onChange={setBook} />
        <NumberInput label="Кількість" min={1} allowDecimal={false} value={quantity}
          onChange={(v) => setQuantity(typeof v === 'number' ? v : 1)} w={160} />
        <TextInput label="Причина" placeholder="Наприклад: подарували дублікат" value={reason}
          onChange={(e) => setReason(e.currentTarget.value)} required />
        <Stack gap={4}>
          <Text fz="sm" fw={500}>Стан книги</Text>
          <SegmentedControl data={conditions} value={condition} onChange={(v) => setCondition(v as ItemCondition)} />
        </Stack>
        {create.isError && <Alert color="red" variant="light" title="Повернення не оформлено">{errorMessage(create.error)}</Alert>}
        {create.isSuccess && (
          <Alert color="green" variant="light">Повернення № {shortId(create.data)} створено й чекає підтвердження адміністратора.</Alert>
        )}
        <Button onClick={submit} disabled={!ready} loading={create.isPending} style={{ alignSelf: 'flex-start' }}>
          Оформити повернення
        </Button>
      </Stack>
    </Panel>
  )
}
