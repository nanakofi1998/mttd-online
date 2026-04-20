'use client'

import { Minus, Plus } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import type { InjuryStatus, ReportFormData } from '@/lib/types'

interface Props {
  data: ReportFormData
  onChange: (data: Partial<ReportFormData>) => void
  errors: Partial<Record<string, string>>
}

const injuryOptions: { value: InjuryStatus; label: string; desc: string; color: string }[] = [
  {
    value: 'none',
    label: 'No Injuries',
    desc: 'Everyone is physically unharmed',
    color: 'emerald',
  },
  {
    value: 'minor',
    label: 'Minor Injuries',
    desc: 'Cuts, bruises, or mild pain',
    color: 'amber',
  },
  {
    value: 'severe',
    label: 'Severe Injuries',
    desc: 'Serious or life-threatening injuries',
    color: 'red',
  },
]

export function StepPeople({ data, onChange, errors }: Props) {
  const count = data.people.passengerCount ?? 0

  function update(field: string, value: string | number) {
    onChange({ people: { ...data.people, [field]: value } })
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-surface-200">People Involved</h2>
        <p className="text-sm text-surface-400 mt-1">Who was in the vehicle?</p>
      </div>

      <Input
        label="Driver's Full Name"
        placeholder="e.g. Kwame Mensah"
        required
        value={data.people.driverName ?? ''}
        onChange={(e) => update('driverName', e.target.value)}
        error={errors['people.driverName']}
      />

      {/* Passenger counter */}
      <div>
        <p className="label">Number of Passengers</p>
        <div className="flex items-center gap-4 mt-1">
          <button
            type="button"
            onClick={() => update('passengerCount', Math.max(0, count - 1))}
            className="w-11 h-11 bg-surface-800 hover:bg-surface-700 border border-surface-700 rounded-xl flex items-center justify-center transition-colors"
          >
            <Minus className="w-4 h-4 text-surface-300" />
          </button>
          <span className="text-3xl font-semibold text-surface-200 w-10 text-center tabular-nums">
            {count}
          </span>
          <button
            type="button"
            onClick={() => update('passengerCount', count + 1)}
            className="w-11 h-11 bg-surface-800 hover:bg-surface-700 border border-surface-700 rounded-xl flex items-center justify-center transition-colors"
          >
            <Plus className="w-4 h-4 text-surface-300" />
          </button>
        </div>
      </div>

      {/* Injury status selector */}
      <div>
        <p className="label">Injury Status <span className="text-red-400">*</span></p>
        {errors['people.injuryStatus'] && (
          <p className="text-xs text-red-400 mb-2">{errors['people.injuryStatus']}</p>
        )}
        <div className="space-y-2">
          {injuryOptions.map((opt) => {
            const selected = data.people.injuryStatus === opt.value
            const colorMap: Record<string, string> = {
              emerald: 'border-emerald-500/40 bg-emerald-500/5',
              amber: 'border-amber-500/40 bg-amber-500/5',
              red: 'border-red-500/40 bg-red-500/5',
            }
            const dotMap: Record<string, string> = {
              emerald: 'bg-emerald-400',
              amber: 'bg-amber-400',
              red: 'bg-red-400',
            }
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => update('injuryStatus', opt.value)}
                className={cn(
                  'w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-150',
                  selected
                    ? colorMap[opt.color]
                    : 'border-surface-800 bg-surface-900 hover:border-surface-600'
                )}
              >
                <div
                  className={cn(
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                    selected ? `border-current ${colorMap[opt.color]}` : 'border-surface-600'
                  )}
                >
                  {selected && (
                    <div className={cn('w-2 h-2 rounded-full', dotMap[opt.color])} />
                  )}
                </div>
                <div>
                  <p className={cn('text-sm font-medium', selected ? 'text-surface-100' : 'text-surface-300')}>
                    {opt.label}
                  </p>
                  <p className="text-xs text-surface-500">{opt.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
