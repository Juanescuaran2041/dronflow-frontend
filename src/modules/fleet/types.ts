// Mirrors the backend fleet DTOs.
export const DRONE_TYPES = ['delivery', 'inspection', 'monitoring'] as const
export type DroneType = (typeof DRONE_TYPES)[number]

export type DroneState =
  | 'AVAILABLE'
  | 'ON_MISSION'
  | 'CHARGING'
  | 'IN_MAINTENANCE'
  | 'OUT_OF_SERVICE'
  | 'DECOMMISSIONED'

export interface Location {
  name: string
  latitude: number
  longitude: number
  altitude: number
}

export interface RegisterDroneRequest {
  code: string
  type: string
  batteryCapacity: number
  enduranceMin: number
  maxPayload: number
  equipment: string[]
}

export interface DroneResponse {
  code: string
  type: string
  batteryCapacity: number
  batteryLevelPercent: number
  enduranceMin: number
  maxPayload: number
  equipment: string[]
  location: Location | null
  state: DroneState
}

export const DRONE_TYPE_LABELS: Record<DroneType, string> = {
  delivery: 'Entrega',
  inspection: 'Inspección',
  monitoring: 'Monitoreo/fotografía',
}

export const DRONE_STATE_LABELS: Record<DroneState, string> = {
  AVAILABLE: 'Disponible',
  ON_MISSION: 'En misión',
  CHARGING: 'Cargando',
  IN_MAINTENANCE: 'En mantenimiento',
  OUT_OF_SERVICE: 'Fuera de servicio',
  DECOMMISSIONED: 'Dado de baja',
}
