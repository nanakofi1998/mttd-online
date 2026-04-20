'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { hourlyData } from '@/lib/mockData'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-900 border border-surface-700 rounded-xl px-3 py-2 shadow-modal text-xs">
      <p className="text-surface-400">{label}:00</p>
      <p className="text-surface-200 font-semibold">{payload[0].value} accidents</p>
    </div>
  )
}

export function HourlyChart() {
  const peak = Math.max(...hourlyData.map((d) => d.count))

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={hourlyData} margin={{ top: 4, right: 4, bottom: 0, left: -24 }} barSize={16}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
        <XAxis
          dataKey="hour"
          tick={{ fontSize: 10, fill: '#64748B' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}h`}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#64748B' }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1E293B' }} />
        <Bar dataKey="count" radius={[3, 3, 0, 0]}>
          {hourlyData.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.count === peak ? '#DC2626' : entry.count > peak * 0.6 ? '#F59E0B' : '#2563EB'}
              opacity={entry.count === 0 ? 0.3 : 1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
