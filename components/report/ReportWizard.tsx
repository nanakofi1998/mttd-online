'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, CheckCircle } from 'lucide-react'
import { Stepper } from '@/components/ui/Stepper'
import { StepOverview } from './steps/StepOverview'
import { StepVehicle } from './steps/StepVehicle'
import { StepPeople } from './steps/StepPeople'
import { StepDetails } from './steps/StepDetails'
import { StepReview } from './steps/StepReview'
import type { ReportFormData } from '@/lib/types'

const STORAGE_KEY = 'mttd_report_draft'

const STEPS = [
  { label: 'Overview', description: 'Time, location & weather' },
  { label: 'Vehicle', description: 'Car details' },
  { label: 'People', description: 'Driver & passengers' },
  { label: 'Details', description: 'Accident info & media' },
  { label: 'Review', description: 'Confirm & submit' },
]

function defaultForm(): ReportFormData {
  return {
    dateTime: new Date().toISOString().slice(0, 16),
    location: {},
    weather: '',
    vehicle: {},
    people: {},
    accidentType: '',
    description: '',
    mediaFiles: [],
  }
}

function validate(step: number, data: ReportFormData): Partial<Record<string, string>> {
  const errors: Partial<Record<string, string>> = {}
  if (step === 0) {
    if (!data.dateTime) errors.dateTime = 'Required'
    if (!data.weather) errors.weather = 'Required'
    if (!data.location.road && !data.location.lat) errors.road = 'Enter a road name or use GPS'
  }
  if (step === 1) {
    if (!data.vehicle.model) errors['vehicle.model'] = 'Required'
    if (!data.vehicle.plateNumber) errors['vehicle.plateNumber'] = 'Required'
    if (!data.vehicle.vehicleType) errors['vehicle.vehicleType'] = 'Required'
    if (!data.vehicle.color) errors['vehicle.color'] = 'Required'
  }
  if (step === 2) {
    if (!data.people.driverName) errors['people.driverName'] = "Driver's name is required"
    if (!data.people.injuryStatus) errors['people.injuryStatus'] = 'Select an injury status'
  }
  if (step === 3) {
    if (!data.accidentType) errors.accidentType = 'Required'
    if (!data.description || data.description.trim().length < 20)
      errors.description = 'Please provide at least 20 characters'
  }
  return errors
}

export function ReportWizard() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<ReportFormData>(defaultForm)
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [referenceId, setReferenceId] = useState('')

  // Load draft from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setData({ ...parsed, mediaFiles: [] })
      }
    } catch {}
  }, [])

  // Auto-save draft
  useEffect(() => {
    try {
      const { mediaFiles, ...rest } = data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rest))
    } catch {}
  }, [data])

  function update(partial: Partial<ReportFormData>) {
    setData((prev) => ({ ...prev, ...partial }))
    setErrors({})
  }

  function next() {
    const errs = validate(step, data)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setStep((s) => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function back() {
    setErrors({})
    setStep((s) => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function jumpTo(s: number) {
    setErrors({})
    setStep(s)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function submit() {
    const id = `ACC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`
    setReferenceId(id)
    localStorage.removeItem(STORAGE_KEY)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-5">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-semibold text-surface-200 mb-2">Report Submitted</h2>
        <p className="text-surface-400 mb-5 max-w-sm">
          Your accident report has been received and will be reviewed by an MTTD officer.
        </p>
        <div className="bg-surface-800 border border-surface-700 rounded-xl px-6 py-4 mb-6">
          <p className="text-xs text-surface-500 mb-1">Reference ID</p>
          <p className="text-xl font-semibold text-primary tracking-widest">{referenceId}</p>
        </div>
        <p className="text-xs text-surface-500 max-w-xs">
          Save this ID to follow up on your report. You may be contacted by an officer.
        </p>
        <button
          onClick={() => { setData(defaultForm()); setStep(0); setSubmitted(false) }}
          className="btn-ghost mt-6"
        >
          Report another accident
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Progress */}
      <div className="px-4 sm:px-0 pt-4 pb-6">
        <Stepper steps={STEPS} current={step} />
      </div>

      {/* Step content */}
      <div className="px-4 sm:px-0 pb-32 animate-slide-up">
        {step === 0 && <StepOverview data={data} onChange={update} errors={errors} />}
        {step === 1 && <StepVehicle data={data} onChange={update} errors={errors} />}
        {step === 2 && <StepPeople data={data} onChange={update} errors={errors} />}
        {step === 3 && <StepDetails data={data} onChange={update} errors={errors} />}
        {step === 4 && <StepReview data={data} onEdit={jumpTo} />}
      </div>

      {/* Sticky bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-950/95 backdrop-blur-sm border-t border-surface-800 px-4 py-4 z-50">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          {step > 0 && (
            <button type="button" onClick={back} className="btn-secondary flex items-center gap-1.5">
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="btn-primary flex-1">
              Continue
            </button>
          ) : (
            <button type="button" onClick={submit} className="btn-primary flex-1">
              Submit Report
            </button>
          )}
        </div>
        <p className="text-center text-xs text-surface-600 mt-2">
          Draft auto-saved · <button className="text-surface-500 hover:text-surface-300" onClick={() => {
            localStorage.removeItem(STORAGE_KEY)
            setData(defaultForm())
            setStep(0)
          }}>Clear draft</button>
        </p>
      </div>
    </div>
  )
}
