import { UnstyledButton } from '@mantine/core'
import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { tokens } from '@/shared/config/tokens'

type Props = Omit<ComponentPropsWithoutRef<'button'>, 'style'> & { on?: boolean; height?: number }

/** The list filter chip of the artboard: outlined, plum and soft when a filter is on. Menus attach to it. */
export const FilterChip = forwardRef<HTMLButtonElement, Props>(function FilterChip(
  { on = false, height = 36, children, ...rest }, ref,
) {
  return (
    <UnstyledButton
      ref={ref}
      {...rest}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, height, padding: '0 12px', whiteSpace: 'nowrap',
        fontSize: 13, fontWeight: on ? 600 : 500,
        border: `1px solid ${on ? tokens.color.accent : tokens.color.lineStrong}`,
        background: on ? tokens.color.accentSoft : tokens.color.surface,
        color: on ? tokens.color.accent : tokens.color.ink,
      }}
    >
      {children}
    </UnstyledButton>
  )
})
