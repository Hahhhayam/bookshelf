import { Alert, Text, TextInput } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { saleApi } from '@/entities/sale'
import { tokens } from '@/shared/config/tokens'
import { formatMoney, fromCents, parseAmount } from '@/shared/lib'
import { errorMessage, FormModal } from '@/shared/ui'

function valueError(text: string, cents: number | null) {
  if (text === '') return null
  if (cents === null) return 'Невірна сума'
  return cents <= 0 ? 'Номінал має бути більшим за нуль' : null
}

/**
 * Selling a gift certificate (table 2.7): puts the printed number into circulation with its value. The customer pays
 * for it at the till like any other payment.
 */
export function SellGiftCertificateDialog({ opened, onClose }: { opened: boolean; onClose: () => void }) {
  const [number, setNumber] = useState('')
  const [value, setValue] = useState('')
  const issue = useMutation({
    mutationFn: ({ n, cents }: { n: string; cents: number }) => saleApi.issueGiftCertificate(n, fromCents(cents)),
  })
  const cents = parseAmount(value)
  const invalid = !number.trim() || cents === null || cents <= 0

  function close() {
    setNumber('')
    setValue('')
    issue.reset()
    onClose()
  }
  function submit() {
    if (!invalid && cents !== null) issue.mutate({ n: number.trim(), cents })
  }

  return (
    <FormModal opened={opened} title="Продаж сертифіката" submitLabel="Випустити сертифікат" loading={issue.isPending}
      error={issue.isError ? errorMessage(issue.error) : null} onSubmit={submit} onClose={close}>
      <TextInput data-autofocus label="Номер на сертифікаті" value={number} required
        onChange={(e) => setNumber(e.currentTarget.value)} styles={{ input: { fontFamily: tokens.font.mono } }} />
      <TextInput label="Номінал" inputMode="decimal" rightSection="₴" value={value} required
        onChange={(e) => setValue(e.currentTarget.value)} error={valueError(value, cents)} />
      {issue.isSuccess && cents !== null && (
        <Alert color="green" variant="light">
          <Text fz={14}>Сертифікат {number.trim()} на {formatMoney(fromCents(cents))} випущено. Прийміть оплату від клієнта.</Text>
        </Alert>
      )}
    </FormModal>
  )
}
