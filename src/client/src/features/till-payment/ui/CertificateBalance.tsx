import { Button, Group, Text } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { saleApi } from '@/entities/sale'
import { ApiError } from '@/shared/api'
import { tokens } from '@/shared/config/tokens'
import { errorMessage, MoneyText } from '@/shared/ui'

/** «Контроль залишку» (table 2.7): the certificate's remaining balance before it pays. */
export function CertificateBalance({ number }: { number: string }) {
  const check = useMutation({ mutationFn: (value: string) => saleApi.giftCertificate(value) })
  const { reset } = check
  useEffect(() => reset(), [number, reset])

  return (
    <Group gap={8} wrap="nowrap">
      <Button size="compact-xs" variant="default" disabled={!number.trim()} loading={check.isPending}
        onClick={() => check.mutate(number.trim())}>
        Перевірити залишок
      </Button>
      {check.isSuccess && <Text fz={13}>Залишок <MoneyText value={check.data.balance} variant="strong" /></Text>}
      {check.isError && (
        <Text fz={13} c={tokens.color.danger}>
          {check.error instanceof ApiError && check.error.status === 404 ? 'Сертифікат не знайдено' : errorMessage(check.error)}
        </Text>
      )}
    </Group>
  )
}
