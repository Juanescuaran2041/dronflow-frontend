import { request } from '../../shared/api/http'
import type { MaintenanceRecordRequest, MaintenanceRecordResponse } from './types'

export const maintenanceRecordsApi = {
  create: (body: MaintenanceRecordRequest) =>
    request<MaintenanceRecordResponse>('/maintenance-records', { method: 'POST', body }),
  listByDrone: (droneCode: string) =>
    request<MaintenanceRecordResponse[]>(`/drones/${encodeURIComponent(droneCode)}/maintenance-records`),
}
