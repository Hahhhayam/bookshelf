import { Group, SimpleGrid, Stack, UnstyledButton } from '@mantine/core'
import { IconArrowsSplit2, IconCash, IconCreditCard, IconGift } from '@tabler/icons-react'
import type { CSSProperties, ReactNode } from 'react'
import { tokens } from '@/shared/config/tokens'
import { Key } from '@/shared/ui'

export type PayAction = 'Cash' | 'Card' | 'GiftCertificate' | 'Split'

const base: CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '0 18px',
  fontSize: 17, fontWeight: 600, boxSizing: 'border-box', width: '100%',
}
const main: CSSProperties = { ...base, height: 64, background: tokens.color.accent, color: '#FFFFFF' }
const alt: CSSProperties = { ...base, height: 56, background: tokens.color.surface, color: tokens.color.ink, border: `1px solid ${tokens.color.lineStrong}` }
const disabledStyle: CSSProperties = { background: tokens.color.sunk, color: tokens.color.disabledText, cursor: 'not-allowed' }

function PayButton({ style, icon, label, k, inverted, disabled, onClick }: {
  style: CSSProperties; icon: ReactNode; label: string; k: string; inverted?: boolean; disabled: boolean; onClick: () => void
}) {
  return (
    <UnstyledButton style={{ ...style, ...(disabled ? disabledStyle : null) }} disabled={disabled} onClick={onClick} tabIndex={-1}>
      <Group gap={10} wrap="nowrap">{icon}{label}</Group>
      <Key inverted={inverted && !disabled}>{k}</Key>
    </UnstyledButton>
  )
}

/** F8 cash, F9 card, F10 certificate pay the whole total; F7 splits it. */
export function PayButtons({ disabled, onPay }: { disabled: boolean; onPay: (action: PayAction) => void }) {
  return (
    <Stack gap={10}>
      <PayButton style={main} icon={<IconCash size={24} stroke={1.75} />} label="Готівка" k="F8" inverted
        disabled={disabled} onClick={() => onPay('Cash')} />
      <SimpleGrid cols={2} spacing={10}>
        <PayButton style={alt} icon={<IconCreditCard size={22} stroke={1.75} />} label="Картка" k="F9"
          disabled={disabled} onClick={() => onPay('Card')} />
        <PayButton style={alt} icon={<IconGift size={22} stroke={1.75} />} label="Сертифікат" k="F10"
          disabled={disabled} onClick={() => onPay('GiftCertificate')} />
      </SimpleGrid>
      <UnstyledButton disabled={disabled} onClick={() => onPay('Split')} tabIndex={-1}
        style={{
          height: 44, border: `1px dashed ${tokens.color.lineStrong}`, fontSize: 14, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          color: disabled ? tokens.color.disabledText : tokens.color.ink,
        }}>
        <IconArrowsSplit2 size={18} stroke={1.75} />Розділити оплату: готівка, бонуси, сертифікат<Key>F7</Key>
      </UnstyledButton>
    </Stack>
  )
}
