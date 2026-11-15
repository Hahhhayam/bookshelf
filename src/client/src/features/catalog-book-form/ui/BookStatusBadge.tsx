import type { SaleStatus } from '@/entities/book'
import type { StatusTone } from '@/shared/config/tokens'
import { StatusBadge } from '@/shared/ui'

const saleStatus: Record<SaleStatus, { label: string; tone: StatusTone }> = {
  Active: { label: 'Активна', tone: 'ready' },
  Deactivated: { label: 'Деактивована', tone: 'done' },
}

export function BookStatusBadge({ status }: { status: SaleStatus }) {
  return <StatusBadge {...saleStatus[status]} />
}
