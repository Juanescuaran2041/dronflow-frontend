// Mirrors the backend maintenance record DTOs.
export const MAINTENANCE_RESULTS = ['APPROVED', 'REQUIRES_REPAIR', 'DECOMMISSION'] as const
export type MaintenanceResult = (typeof MAINTENANCE_RESULTS)[number]

export interface MaintenanceRecordRequest {
  droneCode: string
  result: MaintenanceResult
}

export interface MaintenanceRecordResponse {
  id: string
  droneCode: string
  result: MaintenanceResult
  date: string
}

export const MAINTENANCE_RESULT_LABELS: Record<MaintenanceResult, string> = {
  APPROVED: 'Aprobado',
  REQUIRES_REPAIR: 'Requiere reparación',
  DECOMMISSION: 'Dron dado de baja',
}
