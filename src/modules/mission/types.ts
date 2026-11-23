// Mirrors the backend mission DTOs.
import type { Location } from '../fleet/types'

export type { Location }

export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const
export type Priority = (typeof PRIORITIES)[number]

export const MISSION_STATES = ['PENDING', 'TAKEOFF', 'IN_PROGRESS', 'PAUSED', 'RETURNING', 'COMPLETED', 'ABORTED'] as const
export type MissionState = (typeof MISSION_STATES)[number]

export interface CreateMissionRequest {
  type: string
  priority: Priority
  origin: Location
  destination: Location
  requiredPayload: number
  minEndurance: number
}

export interface MissionResponse {
  code: string
  type: string
  priority: Priority
  origin: Location
  destination: Location
  requiredPayload: number
  minEndurance: number
  route: { points: Location[] } | null
  assignedDroneCode: string | null
  state: MissionState
  routeAttempts: number
  createdAt: string
  start: string | null
  end: string | null
}

export interface MissionFilter {
  droneCode?: string
  from?: string
  to?: string
  state?: MissionState
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
}

export const MISSION_STATE_LABELS: Record<MissionState, string> = {
  PENDING: 'Pendiente',
  TAKEOFF: 'Despegue',
  IN_PROGRESS: 'En curso',
  PAUSED: 'Pausada',
  RETURNING: 'Retorno',
  COMPLETED: 'Finalizada',
  ABORTED: 'Abortada',
}
