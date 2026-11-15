import { Text } from '@mantine/core'
import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { tokens } from '@/shared/config/tokens'
import { Panel } from '@/shared/ui'

export interface BarRow {
  key: string
  label: string
  value: number
}

const rowHeight = 34

/** Revenue split as horizontal bars (stores, categories), largest first. */
export function RevenueBars({ title, rows, format }: {
  title: string
  rows: BarRow[]
  format: (value: number) => string
}) {
  const sorted = [...rows].sort((a, b) => b.value - a.value)
  return (
    <Panel title={title}>
      {sorted.length === 0
        ? <Text c="dimmed" size="sm" p="md">Немає продажів за цей період</Text>
        : (
          <div style={{ padding: '12px 8px', height: sorted.length * rowHeight + 24 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sorted} layout="vertical" margin={{ top: 0, right: 112, bottom: 0, left: 8 }} barCategoryGap={8}>
                <XAxis type="number" hide domain={[0, 'dataMax']} />
                <YAxis
                  type="category" dataKey="label" width={150} axisLine={false} tickLine={false}
                  tick={{ fill: tokens.color.ink, fontSize: 13 }}
                />
                <Bar dataKey="value" fill={tokens.color.accent} background={{ fill: tokens.color.paper }} isAnimationActive={false}>
                  <LabelList
                    dataKey="value" position="right" fill={tokens.color.ink2} fontSize={13}
                    formatter={(value: unknown) => format(Number(value))}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
    </Panel>
  )
}
