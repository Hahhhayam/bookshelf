import type { Money } from '@/shared/api'

export type LoyaltyTier = 'Basic' | 'Silver' | 'Gold'
export type BonusKind = 'Accrual' | 'Redemption' | 'Reversal'

export interface CustomerCard {
  id: string
  name: string
  phone: string | null
  email: string | null
  tier: LoyaltyTier
  card: string
  segments: string[]
  bonusBalance: number
  bonusOperations: { kind: BonusKind; points: number; document: string; at: string }[]
  purchases: { sale: string; location: string; at: string; total: Money; status: 'Completed' | 'Cancelled' }[]
}

/** What the shop shows a buyer about the loyalty program (FR-14); no personal data. */
export interface BonusSummary {
  tier: LoyaltyTier
  balance: number
  operations: { kind: BonusKind; points: number; at: string }[]
}

export const tierLabel: Record<LoyaltyTier, string> = { Basic: 'Базовий', Silver: 'Срібний', Gold: 'Золотий' }

export const bonusKindLabel: Record<BonusKind, string> = {
  Accrual: 'Нараховано', Redemption: 'Списано', Reversal: 'Сторновано',
}
