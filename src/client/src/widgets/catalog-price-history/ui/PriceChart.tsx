import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { PricePoint } from '@/entities/book'
import { tokens } from '@/shared/config/tokens'
import { formatDate, formatMoney } from '@/shared/lib'

/** A step line: a price holds until the next change; the last step runs to today. */
export function PriceChart({ points }: { points: readonly PricePoint[] }) {
  const currency = points[0]?.price.currency ?? 'UAH'
  const data = points.map((point) => ({ at: new Date(point.validFrom).getTime(), amount: point.price.amount }))
  const last = data[data.length - 1]
  if (last) data.push({ at: Date.now(), amount: last.amount })

  return (
    <div role="img" aria-label="Графік зміни ціни" style={{ width: '100%', height: 180 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={tokens.color.line} vertical={false} />
          <XAxis dataKey="at" type="number" scale="time" domain={['dataMin', 'dataMax']}
            tickFormatter={(v: number) => formatDate(new Date(v).toISOString())}
            tick={{ fill: tokens.color.ink3, fontSize: 12 }} stroke={tokens.color.lineStrong} />
          <YAxis width={64} tick={{ fill: tokens.color.ink3, fontSize: 12 }} stroke={tokens.color.lineStrong}
            domain={['auto', 'auto']} tickFormatter={(v: number) => String(v)} />
          <Tooltip
            labelFormatter={(v) => formatDate(new Date(Number(v)).toISOString())}
            formatter={(v) => [formatMoney({ amount: Number(v), currency }), 'Ціна']} />
          <Line type="stepAfter" dataKey="amount" stroke={tokens.color.accent} strokeWidth={2}
            dot={{ r: 4, fill: tokens.color.accent, stroke: tokens.color.surface, strokeWidth: 2 }} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
