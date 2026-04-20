'use client'

import { useEffect } from 'react'
import { X, MapPin, Car, Users, Clock, FileText, AlertTriangle } from 'lucide-react'
import { SeverityBadge, StatusBadge } from '@/components/ui/Badge'
import {
  formatDateTime,
  weatherLabels,
  accidentTypeLabels,
  vehicleTypeLabels,
} from '@/lib/utils'
import type { AccidentReport } from '@/lib/types'

interface Props {
  report: AccidentReport | null
  onClose: () => void
}

function Section({ title, icon: Icon, children }: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <div className="border-t border-surface-800 pt-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-3.5 h-3.5 text-surface-500" />
        <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">{title}</p>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="text-xs text-surface-500 flex-shrink-0 w-28">{label}</p>
      <p className="text-xs text-surface-200 text-right flex-1">{value ?? '—'}</p>
    </div>
  )
}

export function AccidentDrawer({ report, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    if (report) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [report])

  if (!report) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:bg-transparent"
        onClick={onClose}
      />
      <aside className="fixed right-0 top-0 h-full w-full max-w-sm bg-surface-900 border-l border-surface-800 z-50 flex flex-col shadow-modal animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-surface-800 flex-shrink-0">
          <div>
            <p className="text-sm font-semibold text-surface-200">{report.id}</p>
            <p className="text-xs text-surface-500 mt-0.5">
              {formatDateTime(report.dateTime)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-surface-500 hover:text-surface-200 p-1.5 rounded-lg hover:bg-surface-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-800 flex-shrink-0">
          <SeverityBadge severity={report.severity} />
          <StatusBadge status={report.status} />
          <span className="text-xs text-surface-500 ml-auto">{report.region}</span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Map placeholder */}
          <div className="w-full h-32 bg-surface-800 border border-surface-700 rounded-xl flex items-center justify-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 16px,#334155 16px,#334155 17px),
                  repeating-linear-gradient(90deg,transparent,transparent 16px,#334155 16px,#334155 17px)`,
              }}
            />
            <div className="relative z-10 flex flex-col items-center gap-1">
              <MapPin className="w-5 h-5 text-red-400" />
              <p className="text-xs text-surface-400">{report.location.road ?? report.location.address}</p>
            </div>
          </div>

          <Section title="Location" icon={MapPin}>
            <Row label="Address" value={report.location.address} />
            <Row label="Road" value={report.location.road} />
            <Row label="Landmark" value={report.location.landmark} />
            <Row label="Weather" value={weatherLabels[report.weather]} />
          </Section>

          <Section title="Vehicle" icon={Car}>
            <Row label="Model" value={report.vehicle.model} />
            <Row label="Plate" value={report.vehicle.plateNumber} />
            <Row label="Type" value={vehicleTypeLabels[report.vehicle.vehicleType]} />
            <Row label="Color" value={report.vehicle.color} />
            <Row label="Chassis (VIN)" value={report.vehicle.chassisNumber} />
          </Section>

          <Section title="People" icon={Users}>
            <Row label="Driver" value={report.people.driverName} />
            <Row label="Passengers" value={report.people.passengerCount} />
            <Row
              label="Injuries"
              value={
                report.people.injuryStatus === 'none'
                  ? 'None'
                  : report.people.injuryStatus === 'minor'
                  ? 'Minor'
                  : 'Severe'
              }
            />
          </Section>

          <Section title="Accident" icon={AlertTriangle}>
            <Row label="Type" value={accidentTypeLabels[report.accidentType]} />
          </Section>

          {report.description && (
            <div className="bg-surface-800 rounded-xl p-3">
              <p className="text-xs font-medium text-surface-400 mb-1.5">Description</p>
              <p className="text-xs text-surface-300 leading-relaxed">{report.description}</p>
            </div>
          )}

          <Section title="Timeline" icon={Clock}>
            <Row label="Reported" value={formatDateTime(report.createdAt)} />
            <Row label="Last updated" value={formatDateTime(report.updatedAt)} />
          </Section>

          {report.officerNotes && (
            <Section title="Officer Notes" icon={FileText}>
              <p className="text-xs text-surface-300 leading-relaxed">{report.officerNotes}</p>
            </Section>
          )}
        </div>
      </aside>
    </>
  )
}
