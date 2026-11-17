import { SimpleGrid, Stack } from '@mantine/core'
import { IconArrowBackUp, IconGift, IconReceipt2, IconSearch } from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'
import { useCan, useWorkingLocation } from '@/entities/viewer'
import { SellGiftCertificateDialog } from '@/features/till-gift-certificate'
import { ShiftControl } from '@/features/till-shift'
import { Perm } from '@/shared/lib'
import { HomeTile, Panel } from '@/shared/ui'
import { BookLookup } from './BookLookup'
import { ShiftReceiptsTable } from './ShiftReceiptsTable'

/** The cashier's start page (ShellCashier artboard): the shift, the till, returns, certificates, lookup, receipts. */
export function CashierHome() {
  const can = useCan()
  const location = useWorkingLocation()
  const store = location?.type === 'Store' ? location : null
  const tillTile = useRef<HTMLAnchorElement>(null)
  const lookup = useRef<HTMLInputElement>(null)
  const [selling, setSelling] = useState(false)
  useEffect(() => tillTile.current?.focus(), [])
  return (
    <Stack gap="lg">
      {store && <Panel title="Зміна" padding={16}><ShiftControl locationId={store.id} /></Panel>}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        <HomeTile ref={tillTile} to="/staff/till" primary icon={<IconReceipt2 size={32} stroke={1.75} />}
          title="Відкрити касу" text="Новий чек · сканер і клавіатура" />
        {can(Perm.ReturnsCreate, Perm.ReturnsConfirm) && (
          <HomeTile to="/staff/returns" icon={<IconArrowBackUp size={32} stroke={1.75} />}
            title="Оформити повернення" text="За чеком продажу" />
        )}
        <HomeTile to="#gift-certificate" icon={<IconGift size={32} stroke={1.75} />} title="Продати сертифікат"
          text="Номер і номінал подарункового сертифіката" onClick={() => setSelling(true)} />
        <HomeTile to="#book-lookup" icon={<IconSearch size={32} stroke={1.75} />} title="Знайти книгу"
          text="Де є в мережі та скільки" onClick={() => lookup.current?.focus()} />
      </SimpleGrid>
      {store && <ShiftReceiptsTable locationId={store.id} />}
      <div id="book-lookup"><BookLookup ref={lookup} /></div>
      <SellGiftCertificateDialog opened={selling} onClose={() => setSelling(false)} />
    </Stack>
  )
}
