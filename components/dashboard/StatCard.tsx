import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  trend?: { value: number; label: string }
  accent?: 'blue' | 'red' | 'amber' | 'emerald' | 'teal'
  className?: string
}

const accentMap = {
  blue: {
    icon: 'bg-primary/10 text-primary',
    value: 'text-primary',
  },
  red: {
    icon: 'bg-red-500/10 text-red-400',
    value: 'text-red-400',
  },
  amber: {
    icon: 'bg-amber-500/10 text-amber-400',
    value: 'text-amber-400',
  },
  emerald: {
    icon: 'bg-emerald-500/10 text-emerald-400',
    value: 'text-emerald-400',
  },
  teal: {
    icon: 'bg-teal-500/10 text-teal-400',
    value: 'text-teal-400',
  },
}

export function StatCard({ label, value, icon: Icon, trend, accent = 'blue', className }: StatCardProps) {
  const colors = accentMap[accent]

  return (
    <div className={cn('card p-4 flex flex-col gap-3', className)}>
      <div className="flex items-start justify-between gap-2">
        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', colors.icon)}>
          <Icon className="w-4 h-4" />
        </div>
        {trend && (
          <div className={cn(
            'flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5',
            trend.value >= 0
              ? 'bg-red-500/10 text-red-400'
              : 'bg-emerald-500/10 text-emerald-400'
          )}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div>
        <p className={cn('text-2xl font-semibold tabular-nums', colors.value)}>{value}</p>
        <p className="text-xs text-surface-500 mt-0.5">{label}</p>
        {trend && (
          <p className="text-xs text-surface-600 mt-0.5">{trend.label}</p>
        )}
      </div>
    </div>
  )
}
