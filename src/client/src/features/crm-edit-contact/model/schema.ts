import { z } from 'zod'

/** The same rules as at registration: a name and at least one way to reach the customer. */
export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Вкажіть ім’я'),
  phone: z.string().trim().refine((v) => v === '' || /^\+?[\d\s()-]{7,20}$/.test(v), 'Перевірте номер телефону'),
  email: z.string().trim().refine((v) => v === '' || z.email().safeParse(v).success, 'Перевірте e-mail'),
}).refine((v) => v.phone !== '' || v.email !== '', { path: ['phone'], message: 'Потрібен телефон або e-mail' })

export type ContactValues = z.infer<typeof contactSchema>
