import { SimpleGrid, Stack } from '@mantine/core'
import { IconArrowBackUp, IconReceipt2, IconSearch } from '@tabler/icons-react'
import { useEffect, useRef } from 'react'
import { useCan } from '@/entities/viewer'
import { Perm } from '@/shared/lib'
import { HomeTile } from '@/shared/ui'
import { BookLookup } from './BookLookup'
import { ShiftReceiptsTable } from './ShiftReceiptsTable'

/** The cashier's start page (ShellCashier artboard): open the till with Enter, returns, book lookup, my receipts. */
export function CashierHome() {
  const can = useCan()
  const tillTile = useRef<HTMLAnchorElement>(null)
  const lookup = useRef<HTMLInputElement>(null)
  useEffect(() => tillTile.current?.focus(), [])
  return (
    <Stack gap="lg">
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        <HomeTile ref={tillTile} to="/staff/till" primary icon={<IconReceipt2 size={32} stroke={1.75} />}
          title="Відкрити касу" text="Новий чек · сканер і клавіатура" />
        {can(Perm.ReturnsCreate, Perm.ReturnsConfirm) && (
          <HomeTile to="/staff/returns" icon={<IconArrowBackUp size={32} stroke={1.75} />}
            title="Оформити повернення" text="За номером чека або скан книги" />
        )}
        <HomeTile to="#book-lookup" icon={<IconSearch size={32} stroke={1.75} />} title="Знайти книгу"
          text="Де є в мережі та скільки" onClick={() => lookup.current?.focus()} />
      </SimpleGrid>
      <ShiftReceiptsTable />
      <div id="book-lookup"><BookLookup ref={lookup} /></div>
    </Stack>
  )
}
