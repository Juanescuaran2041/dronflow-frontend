// Mirrors the backend alert DTOs.
import type { Priority } from '../mission/types'

export const ALERT_TYPES = ['LOW_BATTERY', 'ROUTE_DEVIATION', 'RESTRICTED_ZONE', 'MAINTENANCE'] as const
export type AlertType = (typeof ALERT_TYPES)[number]

export const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const
export type Severity = Priority

export interface AlertResponse {
  id: string
  generatedAt: string
  type: AlertType
  severity: Severity
  droneCode: string
  missionCode: string | null
  detail: string
}

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  LOW_BATTERY: 'Batería baja',
  ROUTE_DEVIATION: 'Desvío de ruta',
  RESTRICTED_ZONE: 'Zona restringida',
  MAINTENANCE: 'Recomendación de mantenimiento',
}
