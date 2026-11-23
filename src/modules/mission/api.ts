import { request } from '../../shared/api/http'
import type { CreateMissionRequest, Location, MissionFilter, MissionResponse } from './types'

export type MissionAction = 'authorize-takeoff' | 'pause' | 'resume' | 'abort'

const path = (code: string) => `/missions/${encodeURIComponent(code)}`

export const missionsApi = {
  create: (body: CreateMissionRequest) => request<MissionResponse>('/missions', { method: 'POST', body }),
  get: (code: string) => request<MissionResponse>(path(code)),
  search: (filter: MissionFilter) => {
    const query = new URLSearchParams(Object.entries(filter).filter(([, value]) => value) as [string, string][])
    return request<MissionResponse[]>(`/missions?${query}`)
  },
  run: (code: string, action: MissionAction) => request<MissionResponse>(`${path(code)}/${action}`, { method: 'POST' }),
  redirect: (code: string, destination: Location) =>
    request<MissionResponse>(`${path(code)}/redirect`, { method: 'POST', body: { destination } }),
}
