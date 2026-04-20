import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Severity, AccidentStatus } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatTimeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export const severityConfig: Record<
  Severity,
  { label: string; color: string; bg: string; dot: string }
> = {
  critical: {
    label: 'Critical',
    color: 'text-red-400',
    bg: 'bg-red-500/10 border border-red-500/20',
    dot: 'bg-red-400',
  },
  moderate: {
    label: 'Moderate',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border border-amber-500/20',
    dot: 'bg-amber-400',
  },
  minor: {
    label: 'Minor',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border border-blue-500/20',
    dot: 'bg-blue-400',
  },
  resolved: {
    label: 'Resolved',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border border-emerald-500/20',
    dot: 'bg-emerald-400',
  },
}

export const statusConfig: Record<
  AccidentStatus,
  { label: string; color: string; bg: string }
> = {
  pending: {
    label: 'Pending',
    color: 'text-slate-400',
    bg: 'bg-slate-500/10 border border-slate-500/20',
  },
  under_review: {
    label: 'Under Review',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border border-amber-500/20',
  },
  resolved: {
    label: 'Resolved',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border border-emerald-500/20',
  },
  closed: {
    label: 'Closed',
    color: 'text-slate-500',
    bg: 'bg-slate-600/10 border border-slate-600/20',
  },
}

export const weatherLabels: Record<string, string> = {
  clear: 'Clear / Sunny',
  rain: 'Rain',
  fog: 'Fog / Mist',
  harmattan: 'Harmattan',
  night: 'Night / Poor Visibility',
}

export const accidentTypeLabels: Record<string, string> = {
  head_on_collision: 'Head-on Collision',
  rear_end: 'Rear-end Collision',
  side_swipe: 'Side-swipe',
  rollover: 'Rollover',
  pedestrian: 'Pedestrian Involved',
  single_vehicle: 'Single Vehicle',
  other: 'Other',
}

export const vehicleTypeLabels: Record<string, string> = {
  sedan: 'Sedan / Saloon',
  suv: 'SUV / 4x4',
  truck: 'Truck / Lorry',
  motorcycle: 'Motorcycle',
  bus: 'Bus / Minibus',
  other: 'Other',
}
