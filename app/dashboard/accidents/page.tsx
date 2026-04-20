'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, Download, SlidersHorizontal } from 'lucide-react'
import { AccidentTable } from '@/components/dashboard/AccidentTable'
import { mockAccidents } from '@/lib/mockData'
import type { Severity, AccidentStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const SEVERITY_OPTS: { value: Severity | 'all'; label: string }[] = [
  { value: 'all', label: 'All Severities' },
  { value: 'critical', label: 'Critical' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'minor', label: 'Minor' },
  { value: 'resolved', label: 'Resolved' },
]

const STATUS_OPTS: { value: AccidentStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
]

const REGION_OPTS = [
  'All Regions',
  'Greater Accra',
  'Ashanti',
  'Western',
  'Central',
  'Northern',
  'Volta',
  'Bono',
]

export default function AccidentsPage() {
  const [search, setSearch] = useState('')
  const [severity, setSeverity] = useState<Severity | 'all'>('all')
  const [status, setStatus] = useState<AccidentStatus | 'all'>('all')
  const [region, setRegion] = useState('All Regions')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    let data = mockAccidents
    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.vehicle.plateNumber.toLowerCase().includes(q) ||
          a.people.driverName.toLowerCase().includes(q) ||
          (a.location.road ?? '').toLowerCase().includes(q)
      )
    }
    if (severity !== 'all') data = data.filter((a) => a.severity === severity)
    if (status !== 'all') data = data.filter((a) => a.status === status)
    if (region !== 'All Regions') data = data.filter((a) => a.region === region)
    return data
  }, [search, severity, status, region])

  function exportCSV() {
    const headers = ['ID', 'Date', 'Location', 'Vehicle', 'Plate', 'Severity', 'Status', 'Region']
    const rows = filtered.map((a) => [
      a.id,
      a.dateTime,
      a.location.road ?? a.location.address ?? '',
      a.vehicle.model,
      a.vehicle.plateNumber,
      a.severity,
      a.status,
      a.region,
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mttd-accidents-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-title">Accident Records</h1>
          <p className="text-sm text-surface-500 mt-1">
            {filtered.length} of {mockAccidents.length} reports
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="btn-secondary flex items-center gap-2 flex-shrink-0"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Search + filters */}
      <div className="card p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500 pointer-events-none" />
            <input
              type="search"
              placeholder="Search by ID, plate, driver, road..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-800 border border-surface-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-surface-200 placeholder-surface-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={cn(
              'btn-secondary flex items-center gap-2 flex-shrink-0',
              showFilters && 'border-primary/40 text-primary bg-primary/5'
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {(severity !== 'all' || status !== 'all' || region !== 'All Regions') && (
              <span className="w-2 h-2 bg-primary rounded-full" />
            )}
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-surface-800 animate-fade-in">
            <div>
              <label className="label">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Severity | 'all')}
                className="input-base"
              >
                {SEVERITY_OPTS.map((o) => (
                  <option key={o.value} value={o.value} className="bg-surface-900">{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AccidentStatus | 'all')}
                className="input-base"
              >
                {STATUS_OPTS.map((o) => (
                  <option key={o.value} value={o.value} className="bg-surface-900">{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="input-base"
              >
                {REGION_OPTS.map((r) => (
                  <option key={r} value={r} className="bg-surface-900">{r}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <AccidentTable data={filtered} />
        {/* Pagination placeholder */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-surface-800">
          <p className="text-xs text-surface-500">Showing {filtered.length} results</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={cn(
                  'w-7 h-7 rounded text-xs font-medium transition-colors',
                  p === 1
                    ? 'bg-primary text-white'
                    : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800'
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
