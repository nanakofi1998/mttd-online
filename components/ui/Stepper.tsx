import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  label: string
  description?: string
}

interface StepperProps {
  steps: Step[]
  current: number
  className?: string
}

export function Stepper({ steps, current, className }: StepperProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* Progress bar */}
      <div className="relative mb-6">
        <div className="h-1 bg-surface-800 rounded-full">
          <div
            className="h-1 bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(current / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Step dots — desktop */}
      <div className="hidden sm:flex items-start justify-between gap-2">
        {steps.map((step, index) => {
          const done = index < current
          const active = index === current
          return (
            <div key={step.label} className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-300',
                  done && 'bg-primary border-primary text-white',
                  active && 'bg-surface-900 border-primary text-primary',
                  !done && !active && 'bg-surface-900 border-surface-700 text-surface-500'
                )}
              >
                {done ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <p
                className={cn(
                  'text-xs text-center leading-tight',
                  active ? 'text-surface-200 font-medium' : done ? 'text-surface-400' : 'text-surface-600'
                )}
              >
                {step.label}
              </p>
            </div>
          )
        })}
      </div>

      {/* Mobile: just step counter */}
      <div className="flex sm:hidden items-center justify-between">
        <p className="text-xs text-surface-500">
          Step <span className="text-surface-200 font-semibold">{current + 1}</span> of {steps.length}
        </p>
        <p className="text-xs font-medium text-surface-200">{steps[current]?.label}</p>
      </div>
    </div>
  )
}
