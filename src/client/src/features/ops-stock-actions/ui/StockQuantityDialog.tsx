import { Alert, Button, Group, Modal, NumberInput, Stack, Text, Textarea } from '@mantine/core'
import { useState, type ReactNode } from 'react'
import { errorMessage } from '@/shared/ui'

/** A quantity, a mandatory reason and a confirming button: the shape of both the adjustment and the write-off. */
export function StockQuantityDialog({ opened, title, intro, quantityLabel, initial, max, confirmLabel, danger, pending, error, onSubmit, onClose }: {
  opened: boolean
  title: string
  intro: ReactNode
  quantityLabel: string
  initial: number
  max?: number
  confirmLabel: string
  danger?: boolean
  pending: boolean
  error: unknown
  onSubmit: (quantity: number, reason: string) => void
  onClose: () => void
}) {
  const [quantity, setQuantity] = useState<number>(initial)
  const [reason, setReason] = useState('')
  const valid = reason.trim().length > 0 && quantity >= 0 && (max === undefined || quantity <= max)

  return (
    <Modal opened={opened} onClose={onClose} title={<Text fw={600} fz={20}>{title}</Text>} centered>
      <form onSubmit={(event) => { event.preventDefault(); if (valid) onSubmit(quantity, reason.trim()) }}>
        <Stack gap="md">
          <Text size="md">{intro}</Text>
          <NumberInput
            label={quantityLabel} min={0} max={max} allowDecimal={false} data-autofocus
            value={quantity} onChange={(value) => setQuantity(typeof value === 'number' ? value : 0)}
          />
          <Textarea label="Причина" required autosize minRows={2} value={reason} onChange={(event) => setReason(event.currentTarget.value)} />
          {error != null && <Alert color="red" variant="light">{errorMessage(error)}</Alert>}
          <Group justify="flex-end" gap="sm">
            <Button variant="default" onClick={onClose}>Скасувати</Button>
            <Button type="submit" color={danger ? 'red' : undefined} disabled={!valid} loading={pending}>{confirmLabel}</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
