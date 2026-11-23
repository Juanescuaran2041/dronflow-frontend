// Mirrors the backend configuration DTOs.
export interface AssignmentRule {
  batteryWeight: number
  proximityWeight: number
  priorityWeight: number
}

export interface AlertThresholds {
  batteryMinPercent: number
  maxDeviationMeters: number
}

export interface MaintenanceThresholds {
  maxHours: number
  maxMissions: number
}
