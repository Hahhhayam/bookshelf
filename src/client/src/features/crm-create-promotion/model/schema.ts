import { z } from 'zod'
import type { Promotion } from '@/entities/reference'

const guid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const promotionSchema = z.object({
  name: z.string().trim().min(1, 'Вкажіть назву акції'),
  from: z.string().min(1, 'Вкажіть початок'),
  to: z.string().min(1, 'Вкажіть кінець'),
  scope: z.enum(['all', 'book', 'category']),
  book: z.string().nullable(),
  category: z.string().nullable(),
  audience: z.enum(['everyone', 'segment', 'customer']),
  segment: z.string().nullable(),
  customer: z.string().trim(),
  minimumQuantity: z.number({ error: 'Вкажіть кількість' }).int('Ціле число').min(1, 'Щонайменше 1'),
  discountPercent: z.number({ error: 'Вкажіть знижку' }).gt(0, 'Знижка має бути більшою за 0 %').max(100, 'Не більше 100 %'),
  priority: z.number({ error: 'Вкажіть пріоритет' }).int('Ціле число'),
})
  .refine((v) => !v.from || !v.to || new Date(v.to) > new Date(v.from), { path: ['to'], message: 'Кінець має бути пізніше за початок' })
  .refine((v) => v.scope !== 'book' || !!v.book, { path: ['book'], message: 'Оберіть книгу' })
  .refine((v) => v.scope !== 'category' || !!v.category, { path: ['category'], message: 'Оберіть категорію' })
  .refine((v) => v.audience !== 'segment' || !!v.segment, { path: ['segment'], message: 'Оберіть сегмент' })
  .refine((v) => v.audience !== 'customer' || guid.test(v.customer), { path: ['customer'], message: 'Вкажіть ідентифікатор клієнта з його картки' })

export type PromotionValues = z.infer<typeof promotionSchema>

export const emptyPromotion: PromotionValues = {
  name: '', from: '', to: '', scope: 'all', book: null, category: null,
  audience: 'everyone', segment: null, customer: '', minimumQuantity: 1, discountPercent: Number.NaN, priority: 0,
}

/** `datetime-local` gives local wall time; the API takes an offset date-time. */
export function toPromotion(values: PromotionValues): Omit<Promotion, 'id'> {
  return {
    name: values.name, from: new Date(values.from).toISOString(), to: new Date(values.to).toISOString(),
    book: values.scope === 'book' ? values.book : null,
    category: values.scope === 'category' ? values.category : null,
    segment: values.audience === 'segment' ? values.segment : null,
    customer: values.audience === 'customer' ? values.customer : null,
    minimumQuantity: values.minimumQuantity, discountPercent: values.discountPercent, priority: values.priority,
  }
}
