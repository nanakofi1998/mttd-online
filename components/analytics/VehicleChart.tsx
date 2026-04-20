'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { vehicleTypeData } from '@/lib/mockData'

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-surface-900 border border-surface-700 rounded-xl px-3 py-2 shadow-modal text-xs">
      <p className="text-surface-200 font-semibold">{d.name}</p>
      <p className="text-surface-400">{d.value} accidents ({d.payload.percent?.toFixed(0)}%)</p>
    </div>
  )
}

export function VehicleChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={vehicleTypeData}
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
          stroke="none"
        >
          {vehicleTypeData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 12, color: '#94A3B8' }}
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span style={{ color: '#94A3B8' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
