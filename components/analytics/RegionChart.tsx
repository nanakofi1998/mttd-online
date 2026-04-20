'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { RegionStat } from '@/lib/types'

interface Props {
  data: RegionStat[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-900 border border-surface-700 rounded-xl px-3 py-2.5 shadow-modal text-xs">
      <p className="text-surface-400 font-medium mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: p.fill }} />
          <span className="text-surface-300 capitalize">{p.name}:</span>
          <span className="text-surface-200 font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export function RegionChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }} barSize={20}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
        <XAxis
          dataKey="region"
          tick={{ fontSize: 10, fill: '#64748B' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#64748B' }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1E293B' }} />
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 12, color: '#94A3B8' }}
          iconType="square"
          iconSize={8}
        />
        <Bar dataKey="critical" name="Critical" fill="#DC2626" radius={[3, 3, 0, 0]} stackId="a" />
        <Bar dataKey="moderate" name="Moderate" fill="#F59E0B" radius={[0, 0, 0, 0]} stackId="a" />
        <Bar dataKey="minor" name="Minor" fill="#2563EB" radius={[3, 3, 0, 0]} stackId="a" />
      </BarChart>
    </ResponsiveContainer>
  )
}
