'use client'

import { Navigation } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { ReportFormData } from '@/lib/types'

interface Props {
  data: ReportFormData
  onChange: (data: Partial<ReportFormData>) => void
  errors: Partial<Record<string, string>>
}

const weatherOptions = [
  { value: 'clear', label: 'Clear / Sunny' },
  { value: 'rain', label: 'Rain' },
  { value: 'fog', label: 'Fog / Mist' },
  { value: 'harmattan', label: 'Harmattan' },
  { value: 'night', label: 'Night / Poor Visibility' },
]

export function StepOverview({ data, onChange, errors }: Props) {
  function detectGPS() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition((pos) => {
      onChange({
        location: {
          ...data.location,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          address: `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`,
        },
      })
    })
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-surface-200">Accident Overview</h2>
        <p className="text-sm text-surface-400 mt-1">When and where did the accident occur?</p>
      </div>

      <Input
        label="Date & Time"
        type="datetime-local"
        required
        value={data.dateTime}
        onChange={(e) => onChange({ dateTime: e.target.value })}
        error={errors.dateTime}
      />

      {/* Location block */}
      <div className="space-y-3">
        <p className="label">Location <span className="text-red-400">*</span></p>

        <button
          type="button"
          onClick={detectGPS}
          className="w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary rounded-lg py-3 text-sm font-medium transition-colors"
        >
          <Navigation className="w-4 h-4" />
          Auto-detect my GPS location
        </button>

        {data.location.lat && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0" />
            <p className="text-xs text-emerald-400">
              Location detected: {data.location.lat?.toFixed(4)}, {data.location.lng?.toFixed(4)}
            </p>
          </div>
        )}

        {/* Map placeholder */}
        <div className="w-full h-40 bg-surface-800 border border-surface-700 rounded-xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 20px, #334155 20px, #334155 21px),
                repeating-linear-gradient(90deg, transparent, transparent 20px, #334155 20px, #334155 21px)`,
            }}
          />
          {data.location.lat ? (
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div className="w-6 h-6 bg-primary rounded-full border-2 border-white shadow-lg" />
              <p className="text-xs text-surface-300 bg-surface-900/80 px-2 py-0.5 rounded">
                Pin dropped
              </p>
            </div>
          ) : (
            <p className="relative z-10 text-xs text-surface-500">Map · Tap to drop pin</p>
          )}
        </div>

        <Input
          label="Road / Street"
          placeholder="e.g. N1 Motorway, Liberation Road"
          value={data.location.road ?? ''}
          onChange={(e) => onChange({ location: { ...data.location, road: e.target.value } })}
          error={errors.road}
        />

        <Input
          label="Nearest Landmark"
          placeholder="e.g. Near Accra Mall, Kejetia Market"
          value={data.location.landmark ?? ''}
          onChange={(e) => onChange({ location: { ...data.location, landmark: e.target.value } })}
        />
      </div>

      <Select
        label="Weather Condition"
        required
        options={weatherOptions}
        placeholder="Select weather..."
        value={data.weather}
        onChange={(e) => onChange({ weather: e.target.value as ReportFormData['weather'] })}
        error={errors.weather}
      />
    </div>
  )
}
