import { Table, Text, UnstyledButton } from '@mantine/core'
import { IconBarcode } from '@tabler/icons-react'
import { useEffect, useRef } from 'react'
import { useBookCard } from '@/entities/book'
import { discountSourceLabel, type PricedLine } from '@/entities/sale'
import { uah } from '@/shared/api'
import { tokens } from '@/shared/config/tokens'
import { EmptyState, MoneyText } from '@/shared/ui'
import type { ReceiptLine } from '../model/types'

const stepStyle = {
  width: 32, height: 32, border: `1px solid ${tokens.color.lineStrong}`, background: tokens.color.surface,
  color: tokens.color.ink, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
} as const

const th = { background: tokens.color.sunk, fontSize: 12, fontWeight: 600, color: tokens.color.ink2, height: 36 } as const

/** Authors and ISBN under the title; the scan result carries neither, so each comes from the cached book card. */
function LineSubtitle({ book }: { book: string }) {
  const card = useBookCard(book).data
  if (!card) return null
  const authors = card.authors.join(', ')
  return (
    <Text fz={13} c={tokens.color.ink2}>
      {authors}{authors && card.isbn ? ' · ' : ''}
      {card.isbn && <span style={{ fontFamily: tokens.font.mono, fontSize: 12 }}>{card.isbn}</span>}
    </Text>
  )
}

/** The line total from the server's quote, with the discount that made it; the plain product until the quote comes. */
function LineTotal({ line, priced }: { line: ReceiptLine; priced: PricedLine | undefined }) {
  const total = priced?.total ?? uah(Math.round(line.unitPrice.amount * line.quantity * 100) / 100)
  const discount = priced && priced.discount.amount.amount > 0 ? priced.discount : null
  return (
    <>
      <MoneyText value={total} variant="strong" />
      {discount && (
        <Text fz={12} c={tokens.color.accent}>
          {discountSourceLabel[discount.source]} −<MoneyText value={discount.amount} />
        </Text>
      )}
    </>
  )
}

function LineRow({ line, priced, index, selected, onSelect, onStep }: {
  line: ReceiptLine
  priced: PricedLine | undefined
  index: number
  selected: boolean
  onSelect: () => void
  onStep: (delta: 1 | -1) => void
}) {
  const ref = useRef<HTMLTableRowElement>(null)
  useEffect(() => { if (selected) ref.current?.scrollIntoView({ block: 'nearest' }) }, [selected])
  const cell = selected ? { background: tokens.color.accentSoft } : undefined
  return (
    <Table.Tr ref={ref} aria-selected={selected} onClick={onSelect} style={{ cursor: 'pointer' }}>
      <Table.Td style={{ ...cell, boxShadow: selected ? `inset 3px 0 0 ${tokens.color.accent}` : undefined, color: selected ? tokens.color.accent : tokens.color.ink3, fontWeight: selected ? 600 : 400 }}>
        {index + 1}
      </Table.Td>
      <Table.Td style={cell}>
        <Text fw={600} fz={16}>{line.title}</Text>
        <LineSubtitle book={line.book} />
      </Table.Td>
      <Table.Td style={{ ...cell, textAlign: 'center' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <UnstyledButton style={stepStyle} aria-label="Менше" tabIndex={-1} disabled={line.quantity <= 1}
            onClick={(e) => { e.stopPropagation(); onStep(-1) }}>−</UnstyledButton>
          <strong style={{ minWidth: 16 }}>{line.quantity}</strong>
          <UnstyledButton style={stepStyle} aria-label="Більше" tabIndex={-1}
            onClick={(e) => { e.stopPropagation(); onStep(1) }}>+</UnstyledButton>
        </span>
      </Table.Td>
      <Table.Td style={{ ...cell, textAlign: 'right' }}><MoneyText value={line.unitPrice} /></Table.Td>
      <Table.Td style={{ ...cell, textAlign: 'right' }}>
        <LineTotal line={line} priced={priced} />
      </Table.Td>
    </Table.Tr>
  )
}

/** The receipt lines; clicks select a line, the page's keyboard does the rest. */
export function ReceiptLines({ lines, priced, selected, onSelect, onStep }: {
  lines: ReceiptLine[]
  priced: (book: string) => PricedLine | undefined
  selected: number
  onSelect: (index: number) => void
  onStep: (index: number, delta: 1 | -1) => void
}) {
  if (lines.length === 0) {
    return (
      <EmptyState
        icon={<IconBarcode size={40} stroke={1.75} />}
        title="Чек порожній"
        text="Скануйте штрихкод або введіть ISBN і натисніть Enter. F2 — пошук за назвою."
      />
    )
  }
  return (
    <Table stickyHeader fz={15} verticalSpacing={10} horizontalSpacing={12}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th style={{ ...th, width: 28 }}>№</Table.Th>
          <Table.Th style={th}>Книга</Table.Th>
          <Table.Th style={{ ...th, width: 128, textAlign: 'center' }}>Кількість</Table.Th>
          <Table.Th style={{ ...th, textAlign: 'right' }}>Ціна</Table.Th>
          <Table.Th style={{ ...th, textAlign: 'right' }}>Сума</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {lines.map((line, index) => (
          <LineRow key={line.book} line={line} priced={priced(line.book)} index={index} selected={index === selected}
            onSelect={() => onSelect(index)} onStep={(delta) => onStep(index, delta)} />
        ))}
      </Table.Tbody>
    </Table>
  )
}
