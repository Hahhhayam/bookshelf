import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { PricePoint } from '@/entities/book'
import { tokens } from '@/shared/config/tokens'
import { formatDate, formatMoney, formatNumber } from '@/shared/lib'

const month = new Intl.DateTimeFormat('uk-UA', { month: 'short' })

/** A step line: a price holds until the next change, and the last one holds until today. */
function toSeries(points: readonly PricePoint[]) {
  const sorted = [...points].sort((a, b) => a.validFrom.localeCompare(b.validFrom))
  const series = sorted.map((p) => ({ at: new Date(p.validFrom).getTime(), amount: p.price.amount }))
  const last = series[series.length - 1]
  if (last) series.push({ at: Math.max(Date.now(), last.at), amount: last.amount })
  return { series, currency: sorted[0]?.price.currency ?? 'UAH' }
}

export function PriceHistoryChart({ points }: { points: readonly PricePoint[] }) {
  const { series, currency } = toSeries(points)
  const money = (amount: number) => formatMoney({ amount, currency })
  const summary = series.slice(0, -1).map((p) => `${formatDate(new Date(p.at).toISOString())}: ${money(p.amount)}`).join('; ')

  return (
    <div role="img" aria-label={`Історія ціни. ${summary}`} style={{ width: '100%', maxWidth: 560, height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series} margin={{ top: 12, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={tokens.color.line} vertical={false} />
          <XAxis dataKey="at" type="number" scale="time" domain={['dataMin', 'dataMax']}
            tickFormatter={(v: number) => month.format(new Date(v))} stroke={tokens.color.ink3} fontSize={12} />
          <YAxis width={52} domain={['auto', 'auto']} tickFormatter={(v: number) => formatNumber(v)}
            stroke={tokens.color.ink3} fontSize={12} />
          <Tooltip
            formatter={(value) => [money(Number(value)), 'Ціна']}
            labelFormatter={(label) => formatDate(new Date(Number(label)).toISOString())}
          />
          <Line type="stepAfter" dataKey="amount" stroke={tokens.color.accent} strokeWidth={2} dot={false}
            activeDot={{ r: 5 }} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
