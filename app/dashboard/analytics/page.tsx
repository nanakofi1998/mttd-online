import { TrendingUp, AlertTriangle, MapPin, Clock } from 'lucide-react'
import { TrendChart } from '@/components/analytics/TrendChart'
import { RegionChart } from '@/components/analytics/RegionChart'
import { VehicleChart } from '@/components/analytics/VehicleChart'
import { HourlyChart } from '@/components/analytics/HourlyChart'
import { trendData, regionStats, dashboardStats } from '@/lib/mockData'

export const metadata = { title: 'Analytics | MTTD Dashboard' }

function ChartCard({
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  title: string
  subtitle?: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="section-title">{title}</h3>
          {subtitle && <p className="text-xs text-surface-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="w-8 h-8 bg-surface-800 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-surface-400" />
        </div>
      </div>
      {children}
    </div>
  )
}

export default function AnalyticsPage() {
  const total = dashboardStats.month
  const severityBreakdown = [
    { label: 'Critical', count: dashboardStats.critical, color: 'bg-red-500', pct: Math.round(dashboardStats.critical / total * 100) },
    { label: 'Moderate', count: dashboardStats.moderate, color: 'bg-amber-500', pct: Math.round(dashboardStats.moderate / total * 100) },
    { label: 'Minor', count: dashboardStats.minor, color: 'bg-blue-500', pct: Math.round(dashboardStats.minor / total * 100) },
    { label: 'Resolved', count: dashboardStats.resolved, color: 'bg-emerald-500', pct: Math.round(dashboardStats.resolved / total * 100) },
  ]

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="text-sm text-surface-500 mt-1">April 2024 · All Regions</p>
        </div>
        <div className="flex items-center gap-2">
          {['7 days', '30 days', '3 months'].map((p, i) => (
            <button
              key={p}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                i === 1
                  ? 'bg-primary/10 border border-primary/20 text-primary'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {severityBreakdown.map((s) => (
          <div key={s.label} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.color}`} />
              <p className="text-xs text-surface-500">{s.label}</p>
            </div>
            <p className="text-2xl font-semibold text-surface-200 tabular-nums">{s.count}</p>
            <div className="mt-2 h-1 bg-surface-800 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
            </div>
            <p className="text-xs text-surface-600 mt-1">{s.pct}% of {total}</p>
          </div>
        ))}
      </div>

      {/* Trend chart (full width) */}
      <ChartCard
        title="Accident Trends"
        subtitle="Daily totals broken down by severity — last 7 days"
        icon={TrendingUp}
      >
        <TrendChart data={trendData} />
      </ChartCard>

      {/* Region + Vehicle (side by side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard
          title="Accidents by Region"
          subtitle="Stacked by severity"
          icon={MapPin}
        >
          <RegionChart data={regionStats} />
        </ChartCard>

        <ChartCard
          title="Vehicle Type Distribution"
          subtitle="Share of total accidents"
          icon={AlertTriangle}
        >
          <VehicleChart />
        </ChartCard>
      </div>

      {/* Hourly distribution */}
      <ChartCard
        title="Accidents by Hour of Day"
        subtitle="Peak hours highlighted in red — April 2024"
        icon={Clock}
      >
        <HourlyChart />
        <div className="flex items-center gap-4 mt-3">
          {[
            { color: 'bg-red-500', label: 'Peak hour' },
            { color: 'bg-amber-500', label: 'High activity' },
            { color: 'bg-primary', label: 'Normal' },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
              <span className="text-xs text-surface-500">{l.label}</span>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Top regions table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-800">
          <h3 className="section-title">Region Breakdown</h3>
          <p className="text-xs text-surface-500 mt-0.5">All regions ranked by total accidents</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-surface-800">
                {['Region', 'Total', 'Critical', 'Moderate', 'Minor', 'Share'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-surface-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {regionStats.map((r, i) => {
                const share = Math.round((r.count / regionStats.reduce((s, x) => s + x.count, 0)) * 100)
                return (
                  <tr key={r.region} className="border-b border-surface-800/50 hover:bg-surface-800/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-surface-500 w-4">{i + 1}</span>
                        <span className="text-sm font-medium text-surface-200">{r.region}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-surface-200 tabular-nums">{r.count}</td>
                    <td className="px-4 py-3 text-sm text-red-400 tabular-nums">{r.critical}</td>
                    <td className="px-4 py-3 text-sm text-amber-400 tabular-nums">{r.moderate}</td>
                    <td className="px-4 py-3 text-sm text-blue-400 tabular-nums">{r.minor}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-surface-800 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${share}%` }} />
                        </div>
                        <span className="text-xs text-surface-500">{share}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
