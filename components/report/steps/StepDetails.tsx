'use client'

import { Select } from '@/components/ui/Select'
import { TextArea } from '@/components/ui/Input'
import { FileUpload } from '@/components/ui/FileUpload'
import type { AccidentType, ReportFormData } from '@/lib/types'

interface Props {
  data: ReportFormData
  onChange: (data: Partial<ReportFormData>) => void
  errors: Partial<Record<string, string>>
}

const accidentTypeOptions = [
  { value: 'head_on_collision', label: 'Head-on Collision' },
  { value: 'rear_end', label: 'Rear-end Collision' },
  { value: 'side_swipe', label: 'Side-swipe' },
  { value: 'rollover', label: 'Rollover' },
  { value: 'pedestrian', label: 'Pedestrian Involved' },
  { value: 'single_vehicle', label: 'Single Vehicle' },
  { value: 'other', label: 'Other' },
]

export function StepDetails({ data, onChange, errors }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-surface-200">Accident Details</h2>
        <p className="text-sm text-surface-400 mt-1">Describe what happened.</p>
      </div>

      <Select
        label="Accident Type"
        required
        options={accidentTypeOptions}
        placeholder="Select accident type..."
        value={data.accidentType}
        onChange={(e) => onChange({ accidentType: e.target.value as AccidentType })}
        error={errors.accidentType}
      />

      <TextArea
        label="Description"
        required
        rows={5}
        placeholder="Describe the sequence of events, road conditions, any other vehicles involved..."
        value={data.description}
        onChange={(e) => onChange({ description: e.target.value })}
        error={errors.description}
        hint="Be as specific as possible — this helps officers assess the scene."
      />

      <FileUpload
        label="Photos & Videos"
        files={data.mediaFiles}
        onChange={(files) => onChange({ mediaFiles: files })}
        maxFiles={5}
      />
    </div>
  )
}
