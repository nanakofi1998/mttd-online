'use client'

import { Edit2, MapPin, Car, Users, AlertTriangle } from 'lucide-react'
import { cn, weatherLabels, accidentTypeLabels, vehicleTypeLabels } from '@/lib/utils'
import type { ReportFormData } from '@/lib/types'

interface Props {
  data: ReportFormData
  onEdit: (step: number) => void
}

function ReviewSection({
  title,
  icon: Icon,
  step,
  onEdit,
  children,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  step: number
  onEdit: (step: number) => void
  children: React.ReactNode
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-surface-800 rounded-lg flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-surface-400" />
          </div>
          <p className="text-sm font-semibold text-surface-200">{title}</p>
        </div>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="flex items-center gap-1 text-xs text-primary hover:text-primary-hover transition-colors"
        >
          <Edit2 className="w-3 h-3" />
          Edit
        </button>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">{children}</div>
    </div>
  )
}

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <p className="text-xs text-surface-500">{label}</p>
      <p className="text-sm text-surface-200 mt-0.5 font-medium">
        {value ?? <span className="text-surface-600 font-normal">—</span>}
      </p>
    </div>
  )
}

const injuryLabels: Record<string, string> = {
  none: 'No Injuries',
  minor: 'Minor Injuries',
  severe: 'Severe Injuries',
}

export function StepReview({ data, onEdit }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-surface-200">Review & Submit</h2>
        <p className="text-sm text-surface-400 mt-1">
          Please check all details before submitting.
        </p>
      </div>

      <ReviewSection title="Accident Overview" icon={MapPin} step={0} onEdit={onEdit}>
        <Field
          label="Date & Time"
          value={data.dateTime ? new Date(data.dateTime).toLocaleString('en-GB') : null}
        />
        <Field
          label="Weather"
          value={data.weather ? weatherLabels[data.weather] : null}
        />
        <Field label="Road / Street" value={data.location.road} />
        <Field label="Landmark" value={data.location.landmark} />
      </ReviewSection>

      <ReviewSection title="Vehicle" icon={Car} step={1} onEdit={onEdit}>
        <Field label="Model" value={data.vehicle.model} />
        <Field label="Plate Number" value={data.vehicle.plateNumber} />
        <Field label="Type" value={data.vehicle.vehicleType ? vehicleTypeLabels[data.vehicle.vehicleType] : null} />
        <Field label="Color" value={data.vehicle.color} />
        <Field label="Chassis (VIN)" value={data.vehicle.chassisNumber || '—'} />
      </ReviewSection>

      <ReviewSection title="People Involved" icon={Users} step={2} onEdit={onEdit}>
        <Field label="Driver" value={data.people.driverName} />
        <Field label="Passengers" value={data.people.passengerCount} />
        <Field
          label="Injuries"
          value={data.people.injuryStatus ? injuryLabels[data.people.injuryStatus] : null}
        />
      </ReviewSection>

      <ReviewSection title="Accident Details" icon={AlertTriangle} step={3} onEdit={onEdit}>
        <Field
          label="Type"
          value={data.accidentType ? accidentTypeLabels[data.accidentType] : null}
        />
        <Field label="Media Files" value={`${data.mediaFiles.length} file(s)`} />
        <div className="col-span-2">
          <p className="text-xs text-surface-500">Description</p>
          <p className="text-sm text-surface-300 mt-0.5 leading-relaxed">
            {data.description || <span className="text-surface-600">—</span>}
          </p>
        </div>
      </ReviewSection>

      <div className={cn(
        'flex items-start gap-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3'
      )}>
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-300">
          By submitting, you confirm this information is accurate.
          False reports may be subject to legal action.
        </p>
      </div>
    </div>
  )
}
