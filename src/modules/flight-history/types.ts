// Mirrors the backend flight history DTOs.
import type { Severity } from '../alert/types'

export interface Incident {
  alertId: string
  missionCode: string | null
  severity: Severity
  moment: string
}

export interface FlightHistoryResponse {
  droneCode: string
  flightHours: number
  completedMissions: number
  incidents: Incident[]
}
