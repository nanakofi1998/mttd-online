'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown, ExternalLink, MapPin } from 'lucide-react'
import { SeverityBadge, StatusBadge } from '@/components/ui/Badge'
import { AccidentDrawer } from './AccidentDrawer'
import { formatDateTime } from '@/lib/utils'
import type { AccidentReport, Severity, AccidentStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

interface Props {
  data: AccidentReport[]
}

type SortKey = 'id' | 'dateTime' | 'severity' | 'status'
type SortDir = 'asc' | 'desc'

const severityOrder: Record<Severity, number> = { critical: 0, moderate: 1, minor: 2, resolved: 3 }

export function AccidentTable({ data }: Props) {
  const [selected, setSelected] = useState<AccidentReport | null>(null)
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'dateTime', dir: 'desc' })

  function toggleSort(key: SortKey) {
    setSort((s) => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' })
  }

  const sorted = [...data].sort((a, b) => {
    let cmp = 0
    if (sort.key === 'dateTime') cmp = new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    else if (sort.key === 'severity') cmp = severityOrder[a.severity] - severityOrder[b.severity]
    else if (sort.key === 'id') cmp = a.id.localeCompare(b.id)
    else if (sort.key === 'status') cmp = a.status.localeCompare(b.status)
    return sort.dir === 'asc' ? cmp : -cmp
  })

  function SortIcon({ col }: { col: SortKey }) {
    if (sort.key !== col) return <ChevronUp className="w-3 h-3 text-surface-600" />
    return sort.dir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-primary" />
      : <ChevronDown className="w-3 h-3 text-primary" />
  }

  function Th({ col, children }: { col: SortKey; children: React.ReactNode }) {
    return (
      <th
        className="px-4 py-3 text-left cursor-pointer select-none group"
        onClick={() => toggleSort(col)}
      >
        <div className="flex items-center gap-1 text-xs font-medium text-surface-500 group-hover:text-surface-300 transition-colors">
          {children}
          <SortIcon col={col} />
        </div>
      </th>
    )
  }

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="border-b border-surface-800">
              <Th col="id">ID</Th>
              <Th col="dateTime">Date & Time</Th>
              <th className="px-4 py-3 text-left text-xs font-medium text-surface-500">Location</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-surface-500">Vehicle</th>
              <Th col="severity">Severity</Th>
              <Th col="status">Status</Th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr
                key={row.id}
                onClick={() => setSelected(row)}
                className={cn(
                  'border-b border-surface-800/60 cursor-pointer transition-colors',
                  selected?.id === row.id
                    ? 'bg-primary/5'
                    : 'hover:bg-surface-800/40'
                )}
              >
                <td className="px-4 py-3">
                  <span className="text-xs font-mono font-medium text-surface-300">{row.id}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-surface-300">{formatDateTime(row.dateTime)}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 max-w-[160px]">
                    <MapPin className="w-3 h-3 text-surface-500 flex-shrink-0" />
                    <span className="text-xs text-surface-300 truncate">
                      {row.location.road ?? row.location.address}
                    </span>
                  </div>
                  <p className="text-xs text-surface-500 mt-0.5">{row.region}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-xs text-surface-300">{row.vehicle.model}</p>
                  <p className="text-xs text-surface-500 font-mono">{row.vehicle.plateNumber}</p>
                </td>
                <td className="px-4 py-3">
                  <SeverityBadge severity={row.severity} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-4 py-3">
                  <ExternalLink className="w-3.5 h-3.5 text-surface-600 group-hover:text-surface-400" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sorted.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-surface-500 text-sm">No records match your filters.</p>
          </div>
        )}
      </div>

      <AccidentDrawer report={selected} onClose={() => setSelected(null)} />
    </>
  )
}
