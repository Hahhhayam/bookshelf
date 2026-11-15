import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Group, SimpleGrid, Stack, TextInput } from '@mantine/core'
import { useForm } from 'react-hook-form'
import { tokens } from '@/shared/config/tokens'
import { errorMessage } from '@/shared/ui'
import { customerSchema, emptyCustomer, type CustomerValues } from '../model/schema'
import { useRegisterCustomer } from '../model/useRegisterCustomer'

export function RegisterCustomerForm({ onRegistered }: { onRegistered: (customerId: string) => void }) {
  const register = useRegisterCustomer()
  const form = useForm<CustomerValues>({ resolver: zodResolver(customerSchema), defaultValues: emptyCustomer })
  const errors = form.formState.errors

  function submit(values: CustomerValues) {
    register.mutate(values, { onSuccess: ({ id }) => onRegistered(id) })
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} noValidate aria-label="Реєстрація клієнта">
      <Stack gap="sm">
        <TextInput label="Ім’я та прізвище" withAsterisk {...form.register('name')} error={errors.name?.message} />
        <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="sm">
          <TextInput label="Телефон" type="tel" placeholder="+380…" {...form.register('phone')} error={errors.phone?.message} />
          <TextInput label="E-mail" type="email" {...form.register('email')} error={errors.email?.message} />
        </SimpleGrid>
        <TextInput label="Номер картки лояльності" withAsterisk {...form.register('cardNumber')} error={errors.cardNumber?.message}
          styles={{ input: { fontFamily: tokens.font.mono } }} />
        {register.isError && <Alert color="red" title="Не вдалося зареєструвати">{errorMessage(register.error)}</Alert>}
        <Group justify="flex-end"><Button type="submit" loading={register.isPending}>Зареєструвати</Button></Group>
      </Stack>
    </form>
  )
}
