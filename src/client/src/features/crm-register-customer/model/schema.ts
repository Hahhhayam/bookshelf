import { z } from 'zod'

/** The server needs a name, a card, and at least one way to reach the customer. */
export const customerSchema = z.object({
  name: z.string().trim().min(1, 'Вкажіть ім’я'),
  phone: z.string().trim().refine((v) => v === '' || /^\+?[\d\s()-]{7,20}$/.test(v), 'Перевірте номер телефону'),
  email: z.string().trim().refine((v) => v === '' || z.email().safeParse(v).success, 'Перевірте e-mail'),
  cardNumber: z.string().trim().min(1, 'Вкажіть номер картки'),
}).refine((v) => v.phone !== '' || v.email !== '', { path: ['phone'], message: 'Потрібен телефон або e-mail' })

export type CustomerValues = z.infer<typeof customerSchema>

export const emptyCustomer: CustomerValues = { name: '', phone: '', email: '', cardNumber: '' }
