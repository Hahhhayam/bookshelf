import { Chip, Group, Text } from '@mantine/core'
import { figureOptions, type Figure, type FigureState } from '../model/figures'

/** Which figures the dashboard shows (scenario 3.12 step 2). */
export function FigurePicker({ state }: { state: FigureState }) {
  return (
    <Group gap="xs" wrap="wrap">
      <Text size="sm" c="dimmed">Показники:</Text>
      <Chip.Group multiple value={state.figures} onChange={(value) => state.setFigures(value as Figure[])}>
        {figureOptions.map((option) => (
          <Chip key={option.value} value={option.value} size="xs" variant="outline">{option.label}</Chip>
        ))}
      </Chip.Group>
    </Group>
  )
}
