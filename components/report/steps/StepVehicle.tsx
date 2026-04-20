'use client'

import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { ReportFormData } from '@/lib/types'

interface Props {
  data: ReportFormData
  onChange: (data: Partial<ReportFormData>) => void
  errors: Partial<Record<string, string>>
}

const vehicleTypeOptions = [
  { value: 'sedan', label: 'Sedan / Saloon' },
  { value: 'suv', label: 'SUV / 4x4' },
  { value: 'truck', label: 'Truck / Lorry' },
  { value: 'motorcycle', label: 'Motorcycle' },
  { value: 'bus', label: 'Bus / Minibus' },
  { value: 'other', label: 'Other' },
]

const colorOptions = [
  { value: 'White', label: 'White' },
  { value: 'Black', label: 'Black' },
  { value: 'Silver', label: 'Silver' },
  { value: 'Gray', label: 'Gray' },
  { value: 'Red', label: 'Red' },
  { value: 'Blue', label: 'Blue' },
  { value: 'Green', label: 'Green' },
  { value: 'Yellow', label: 'Yellow' },
  { value: 'Brown', label: 'Brown' },
  { value: 'Other', label: 'Other' },
]

export function StepVehicle({ data, onChange, errors }: Props) {
  function update(field: string, value: string) {
    onChange({ vehicle: { ...data.vehicle, [field]: value } })
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-surface-200">Vehicle Details</h2>
        <p className="text-sm text-surface-400 mt-1">Information about the vehicle involved.</p>
      </div>

      <Input
        label="Car Model / Make"
        placeholder="e.g. Toyota Corolla, Hyundai Tucson"
        required
        value={data.vehicle.model ?? ''}
        onChange={(e) => update('model', e.target.value)}
        error={errors['vehicle.model']}
      />

      <Input
        label="Plate Number"
        placeholder="e.g. GR-2456-21"
        required
        value={data.vehicle.plateNumber ?? ''}
        onChange={(e) => update('plateNumber', e.target.value.toUpperCase())}
        error={errors['vehicle.plateNumber']}
        className="uppercase tracking-widest"
      />

      <Input
        label="Chassis Number (VIN)"
        placeholder="17-character VIN"
        value={data.vehicle.chassisNumber ?? ''}
        onChange={(e) => update('chassisNumber', e.target.value.toUpperCase())}
        hint="Optional — found on the dashboard or door frame"
        className="uppercase tracking-widest"
      />

      <Select
        label="Vehicle Type"
        required
        options={vehicleTypeOptions}
        placeholder="Select type..."
        value={data.vehicle.vehicleType ?? ''}
        onChange={(e) => update('vehicleType', e.target.value)}
        error={errors['vehicle.vehicleType']}
      />

      <Select
        label="Vehicle Color"
        required
        options={colorOptions}
        placeholder="Select color..."
        value={data.vehicle.color ?? ''}
        onChange={(e) => update('color', e.target.value)}
        error={errors['vehicle.color']}
      />
    </div>
  )
}
