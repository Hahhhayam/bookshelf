import { Text, TextInput } from '@mantine/core'
import { useEffect, useState } from 'react'
import { formatAmount, formatMoney, fromCents, parseAmount, toCents } from '@/shared/lib'
import { FormModal } from '@/shared/ui'
import type { ReceiptLine } from '../model/types'

/** F6: a manual discount off the selected line (FR-04); only a user with the discount right gets here. Zero removes it. */
export function LineDiscountDialog({ line, onApply, onClose }: {
  line: ReceiptLine | null
  onApply: (discount: ReceiptLine['manualDiscount']) => void
  onClose: () => void
}) {
  const [text, setText] = useState('')
  useEffect(() => { if (line) setText(line.manualDiscount ? formatAmount(toCents(line.manualDiscount)) : '') }, [line])

  const lineCents = line ? toCents(line.unitPrice) * line.quantity : 0
  const cents = parseAmount(text)
  const error = cents === null ? 'Невірна сума' : cents > lineCents ? 'Знижка не може перевищувати суму рядка' : null

  function submit() {
    if (error || cents === null) return
    onApply(cents === 0 ? null : fromCents(cents))
    onClose()
  }

  return (
    <FormModal opened={line !== null} title="Ручна знижка" submitLabel="Застосувати" onSubmit={submit} onClose={onClose}>
      <Text fz={15}>«{line?.title}», {line?.quantity} шт. на {formatMoney(fromCents(lineCents))}</Text>
      <TextInput data-autofocus label="Знижка на рядок" inputMode="decimal" rightSection="₴" value={text}
        onChange={(e) => setText(e.currentTarget.value)} error={text !== '' ? error : null}
        description="Порожньо або 0 — без ручної знижки; тоді діють акції." />
    </FormModal>
  )
}
