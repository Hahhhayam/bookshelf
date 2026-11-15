import { Group } from '@mantine/core'
import { tokens } from '@/shared/config/tokens'
import { Key } from '@/shared/ui'

function Hint({ keys, text, ml }: { keys: string[]; text: string; ml?: string }) {
  return <Group gap={6} ml={ml} wrap="nowrap">{keys.map((k) => <Key key={k}>{k}</Key>)}{text}</Group>
}

export function KeyHints() {
  return (
    <Group gap={18} fz={13} c={tokens.color.ink2} style={{ flex: 'none' }}>
      <Hint keys={['↑', '↓']} text="вибрати рядок" />
      <Hint keys={['+', '−']} text="кількість" />
      <Hint keys={['Del']} text="прибрати рядок" />
      <Hint keys={['F4']} text="клієнт" />
      <Hint keys={['Esc']} text="назад до сканування" />
      <Hint keys={['Ctrl', 'Del']} text="анулювати чек" ml="auto" />
    </Group>
  )
}
