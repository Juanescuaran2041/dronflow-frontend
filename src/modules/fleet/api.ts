import { request } from '../../shared/api/http'
import type { DroneResponse, RegisterDroneRequest } from './types'

export type DroneAction = 'report-fault' | 'decommission' | 'reactivate'

export const dronesApi = {
  list: () => request<DroneResponse[]>('/drones'),
  register: (body: RegisterDroneRequest) => request<DroneResponse>('/drones', { method: 'POST', body }),
  run: (code: string, action: DroneAction) =>
    request<DroneResponse>(`/drones/${encodeURIComponent(code)}/${action}`, { method: 'POST' }),
}
