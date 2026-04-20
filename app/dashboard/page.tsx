import Link from 'next/link'
import {
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Clock,
  ChevronRight,
  MapPin,
} from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { SeverityBadge, StatusBadge } from '@/components/ui/Badge'
import { dashboardStats, mockAccidents, regionStats } from '@/lib/mockData'
import { formatDateTime } from '@/lib/utils'

export const metadata = { title: 'Overview | MTTD Dashboard' }

export default function DashboardPage() {
  const recent = mockAccidents.slice(0, 4)

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page title */}
      <div>
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="text-sm text-surface-500 mt-1">April 20, 2024 · Greater Accra Region</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Today's Accidents"
          value={dashboardStats.today}
          icon={AlertTriangle}
          accent="blue"
          trend={{ value: 12, label: 'vs yesterday' }}
        />
        <StatCard
          label="This Week"
          value={dashboardStats.week}
          icon={Clock}
          accent="teal"
          trend={{ value: -8, label: 'vs last week' }}
        />
        <StatCard
          label="Critical"
          value={dashboardStats.critical}
          icon={AlertTriangle}
          accent="red"
          trend={{ value: 5, label: 'this month' }}
        />
        <StatCard
          label="Resolved"
          value={dashboardStats.resolved}
          icon={CheckCircle}
          accent="emerald"
          trend={{ value: -3, label: 'this month' }}
        />
      </div>

      {/* Severity breakdown */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="section-title">Severity Breakdown · This Month</p>
          <Link href="/dashboard/analytics" className="text-xs text-primary hover:text-primary-hover flex items-center gap-1">
            Full analytics <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Critical', value: dashboardStats.critical, color: 'bg-red-500', pct: Math.round(dashboardStats.critical / dashboardStats.month * 100) },
            { label: 'Moderate', value: dashboardStats.moderate, color: 'bg-amber-500', pct: Math.round(dashboardStats.moderate / dashboardStats.month * 100) },
            { label: 'Minor', value: dashboardStats.minor, color: 'bg-blue-500', pct: Math.round(dashboardStats.minor / dashboardStats.month * 100) },
          ].map((s) => (
            <div key={s.label} className="bg-surface-800 rounded-xl p-3">
              <p className="text-lg font-semibold text-surface-200 tabular-nums">{s.value}</p>
              <p className="text-xs text-surface-500 mt-0.5">{s.label}</p>
              <div className="mt-2 h-1.5 bg-surface-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${s.color}`}
                  style={{ width: `${s.pct}%` }}
                />
              </div>
              <p className="text-xs text-surface-600 mt-1">{s.pct}% of total</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Region map placeholder */}
        <div className="card p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="section-title">Accident Density Map</p>
            <span className="text-xs text-surface-500">April 2024</span>
          </div>
          <div className="w-full h-56 bg-surface-800 rounded-xl flex items-center justify-center relative overflow-hidden border border-surface-700">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 20px,#334155 20px,#334155 21px),
                  repeating-linear-gradient(90deg,transparent,transparent 20px,#334155 20px,#334155 21px)`,
              }}
            />
            {/* Hotspot dots */}
            {[
              { top: '40%', left: '45%', size: 'w-8 h-8', opacity: 'opacity-70', label: 'Accra' },
              { top: '35%', left: '38%', size: 'w-5 h-5', opacity: 'opacity-50', label: '' },
              { top: '28%', left: '42%', size: 'w-6 h-6', opacity: 'opacity-60', label: 'Kumasi' },
              { top: '55%', left: '33%', size: 'w-4 h-4', opacity: 'opacity-40', label: '' },
              { top: '22%', left: '52%', size: 'w-3 h-3', opacity: 'opacity-30', label: '' },
            ].map((dot, i) => (
              <div
                key={i}
                className={`absolute rounded-full bg-red-500 ${dot.size} ${dot.opacity} blur-sm`}
                style={{ top: dot.top, left: dot.left, transform: 'translate(-50%,-50%)' }}
              />
            ))}
            <div className="relative z-10 text-center">
              <MapPin className="w-5 h-5 text-surface-400 mx-auto mb-1" />
              <p className="text-xs text-surface-500">Heatmap visualization</p>
            </div>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 mt-3">
            {['Low', 'Medium', 'High', 'Critical'].map((l, i) => (
              <div key={l} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: `rgba(239,68,68,${0.2 + i * 0.25})` }}
                />
                <span className="text-xs text-surface-500">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Region breakdown */}
        <div className="card p-4">
          <p className="section-title mb-4">By Region</p>
          <div className="space-y-3">
            {regionStats.slice(0, 5).map((r) => {
              const maxCount = regionStats[0].count
              return (
                <div key={r.region}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-surface-300 font-medium">{r.region}</p>
                    <p className="text-xs font-semibold text-surface-200 tabular-nums">{r.count}</p>
                  </div>
                  <div className="h-1.5 bg-surface-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(r.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent reports */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-4 border-b border-surface-800">
          <p className="section-title">Recent Reports</p>
          <Link href="/dashboard/accidents" className="text-xs text-primary hover:text-primary-hover flex items-center gap-1">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-surface-800">
                {['ID', 'Date', 'Location', 'Vehicle', 'Severity', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-surface-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.id} className="border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-surface-300">{r.id}</td>
                  <td className="px-4 py-3 text-xs text-surface-400">{formatDateTime(r.dateTime)}</td>
                  <td className="px-4 py-3 text-xs text-surface-300 max-w-[140px] truncate">
                    {r.location.road ?? r.location.address}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-surface-300">{r.vehicle.model}</p>
                    <p className="text-xs text-surface-500 font-mono">{r.vehicle.plateNumber}</p>
                  </td>
                  <td className="px-4 py-3"><SeverityBadge severity={r.severity} /></td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
