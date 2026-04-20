export type Severity = 'critical' | 'moderate' | 'minor' | 'resolved'
export type AccidentStatus = 'pending' | 'under_review' | 'resolved' | 'closed'
export type WeatherCondition = 'clear' | 'rain' | 'fog' | 'harmattan' | 'night'
export type VehicleType = 'sedan' | 'suv' | 'truck' | 'motorcycle' | 'bus' | 'other'
export type InjuryStatus = 'none' | 'minor' | 'severe'
export type AccidentType =
  | 'head_on_collision'
  | 'rear_end'
  | 'side_swipe'
  | 'rollover'
  | 'pedestrian'
  | 'single_vehicle'
  | 'other'

export interface GeoLocation {
  lat: number
  lng: number
  address?: string
  landmark?: string
  road?: string
}

export interface VehicleInfo {
  model: string
  chassisNumber: string
  plateNumber: string
  vehicleType: VehicleType
  color: string
}

export interface PersonInfo {
  driverName: string
  passengerCount: number
  injuryStatus: InjuryStatus
}

export interface AccidentReport {
  id: string
  createdAt: string
  updatedAt: string
  status: AccidentStatus
  severity: Severity
  dateTime: string
  location: GeoLocation
  weather: WeatherCondition
  vehicle: VehicleInfo
  people: PersonInfo
  accidentType: AccidentType
  description: string
  mediaUrls: string[]
  officerNotes?: string
  region: string
}

export interface ReportFormData {
  // Step 1
  dateTime: string
  location: Partial<GeoLocation>
  weather: WeatherCondition | ''
  // Step 2
  vehicle: Partial<VehicleInfo>
  // Step 3
  people: Partial<PersonInfo>
  // Step 4
  accidentType: AccidentType | ''
  description: string
  mediaFiles: File[]
}

export interface DashboardStats {
  today: number
  week: number
  month: number
  critical: number
  moderate: number
  minor: number
  resolved: number
}

export interface RegionStat {
  region: string
  count: number
  critical: number
  moderate: number
  minor: number
}

export interface TrendPoint {
  date: string
  total: number
  critical: number
  moderate: number
  minor: number
}
